from subprocess import Popen, PIPE
import tempfile
import requests
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
import xml.etree.ElementTree as ET

from django.conf import settings
from models import Map, Palette, PrintSize, Font
from serializers import PaletteSerializer, PrintSizeSerializer, FontSerializer


@api_view(['GET'])
def map(request):
    params = request.query_params
    print_size = PrintSize.objects.get(pk=params['print_size_id'])
    colors = Palette.objects.get(pk=params['palette_id']).colors
    background_color = colors.pop(int(params['background_index']))


    map_row = Map.objects.create(**{
        'zoom': params['zoom'],
        'center': params['center'],
        'colors': colors,
        'background_color': background_color,
        'title': params['title'],
        'font': Font.objects.get(pk=params['font_id']),
        'width': print_size.width,
        'height': print_size.height,
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
                    # TODO: width and height flipped. I'm too lazy to figure
                    # out why
                    '--width',
                    str(map_row.height),
                    '--height',
                    str(map_row.width),
                    '--output',
                    '-',
                    temp.name], stdout=PIPE)

    svg = traced.stdout.read()
    svg = map_row.randomize_path_colors(svg)
    map_row.save_svg(svg)

    result = map_row.get_png(50)

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


@api_view(['GET'])
def font_list(request):
    fonts = Font.objects.filter(active=True).all()
    serializer = FontSerializer(fonts, many=True)
    return Response(serializer.data)
