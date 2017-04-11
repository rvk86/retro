from subprocess import Popen, PIPE
import tempfile
import base64
import requests
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
import xml.etree.ElementTree as ET

from models import Map
from helpers import get_palette


@api_view(['GET'])
def map(request):
    params = request.query_params
    colors = get_palette(params['palette_id'])
    background_color = colors.pop(int(params['background_index']))

    map_row = Map.objects.create(**{
        'zoom': params['zoom'],
        'center': params['center'],
        'colors': colors,
        'background_color': background_color
    })

    bmp = map_row.get_cropped_google_map()
    temp = tempfile.NamedTemporaryFile()
    bmp.save(temp, 'bmp')

    # TRACE BMP FILE. Apparently using pypotrace doesn't work because of memory issues
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
    xml = requests.get('http://www.colourlovers.com/api/palettes/top')
    root = ET.fromstring(xml.content)
    xml_palettes = root.findall('palette')

    palettes = []
    for palette in xml_palettes:
        p = {
            'title': palette.find('title').text,
            'id': palette.find('id').text,
            'colors': [],
        }
        for color in palette.find('colors'):
            p['colors'].append('#{}'.format(color.text))
        palettes.append(p)
        
    return Response(palettes)
