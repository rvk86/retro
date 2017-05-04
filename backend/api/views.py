from subprocess import Popen, PIPE
import tempfile
import base64
import requests
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
import xml.etree.ElementTree as ET

from models import Map, Palette, PrintSize
from serializers import PaletteSerializer, PrintSizeSerializer


@api_view(['GET'])
def map(request):
    params = request.query_params
    colors = Palette.objects.get(pk=params['palette_id']).colors
    background_color = colors.pop(int(params['background_index']))

    map_row = Map.objects.create(**{
        'zoom': params['zoom'],
        'center': params['center'],
        'colors': colors,
        'background_color': background_color,
        'title': params['title'],
    })

    bmp = map_row.get_cropped_google_map()
    temp = tempfile.NamedTemporaryFile()
    bmp.save(temp, 'bmp')

    # TRACE BMP FILE. Apparently using pypotrace doesn't work because of
    # memory issues
    traced = Popen(['potrace',
                    '--svg',
                    '--turdsize',
                    '50',
                    '--opttolerance',
                    '10',
                    '--output',
                    '-',
                    temp.name], stdout=PIPE)

    svg = traced.stdout.read()
    svg = map_row.randomize_path_colors(svg)
    map_row.save_svg(svg)

    result = map_row.get_png(100)

    return HttpResponse(result, content_type="image/png")


@api_view(['GET'])
def palette_list(request):
    palettes = Palette.objects.all()
    serializer = PaletteSerializer(palettes, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def print_size_list(request):
    print_sizes = PrintSize.objects.all()
    serializer = PrintSizeSerializer(print_sizes, many=True)
    return Response(serializer.data)
