from subprocess import Popen, PIPE
import tempfile
import base64
from django.http import HttpResponse
from rest_framework.decorators import api_view

from models import Map
from helpers import get_palette


@api_view(['GET'])
def map(request):
    if request.method == 'GET':
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
