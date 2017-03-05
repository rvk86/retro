from django.http import HttpResponse
from django.conf import settings
from django.core.files.base import ContentFile
from rest_framework.response import Response
from rest_framework.decorators import api_view
import xml.etree.ElementTree as ET
from PIL import Image, ImageFilter
from io import BytesIO
from subprocess import call, Popen, PIPE
import json, requests, random, tempfile, cairosvg, base64, zlib, scour, uuid

from api.models import Map


# PARSE GOOGLE MAPS STYLE JSON (https://mapstyle.withgoogle.com/) AND REORDER TO OBJECT FOR URL
def parse_style():
    content = json.loads(settings.MAP_STYLE)
    styles = []
    for style in content:
        value = ''
        
        if style.get('featureType'):
            value = '{}feature:{}|'.format(value, style['featureType'])
            
        if style.get('elementType'):
            value = '{}element:{}|'.format(value, style['elementType'])
            
        i = 0
        for styler in style['stylers']:
            for key, val in styler.items():
                val = str(val).replace('#', '0x')
                if i == 0:
                    value = '{}{}:{}'.format(value, key, val)
                else:
                    value = '{}|{}:{}'.format(value, key, val)
            i += 1
            
        styles.append(value)
    
    return styles

# GET FILE FROM GOOGLE STATIC MAPS API
def get_cropped_google_map(center, zoom):
    payload = {
        'center': center,
        'size': '640x640',
        'scale': 2,
        'zoom': zoom,
        'key': 'AIzaSyAy2awhVyQuvbdg0-3AzPZdUJpRejF9yj8',
        'style': parse_style()
    }
    map_request = requests.get('https://maps.googleapis.com/maps/api/staticmap', params=payload)
    with Image.open(BytesIO(map_request.content)) as f:
        width = f.size[0]
        height = f.size[1]
        f = f.crop((0, 0, width, height - 50))
        return f

# RANDOMIZE COLORS
def randomize_colors(xml, palette):
    g = xml.find('{http://www.w3.org/2000/svg}g')

    for path in g.iter('{http://www.w3.org/2000/svg}path'):
        path.set('fill', random.choice(palette))

    return xml
        
def get_palette(id):
    xml = requests.get('http://www.colourlovers.com/api/palette/{}'.format(id))
    root = ET.fromstring(xml.content)
    colors = []
    for color in root.find('palette/colors'):
        colors.append('#{}'.format(color.text))
        
    return colors

def svg_to_png(svg, bg_color):
    border_size = 100
    # Convert hex notation color to tuple
    bg_color = bg_color[1:]
    bg_color = tuple(int(bg_color[i:i+2], 16) for i in (0, 2 ,4)) + (255,)
    
    buffer_img = BytesIO()
    png = cairosvg.svg2png(bytestring=ET.tostring(svg), write_to=buffer_img)
    
    with Image.open(buffer_img) as img:
        img_w, img_h = img.size
        
        background = Image.new('RGBA', (img_w, img_h), bg_color)
        img = Image.alpha_composite(background, img)
        
        border = Image.new('RGBA', (img_w + border_size, img_h + border_size), bg_color)
        bg_w, bg_h = border.size
        offset = ((bg_w - img_w) / 2, (bg_h - img_h) / 2)
        border.paste(img, offset)
        
        buffer_img.seek(0)
        border.save(buffer_img, format='png')
        buffer_img.seek(0)
        return buffer_img.read()

@api_view(['GET'])
def map(request):
    if request.method == 'GET':
        params = request.query_params

        # GET MAP FROM GOOGLE
        bmp = get_cropped_google_map(params['center'], params['zoom'])
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
                        temp.name],
                        stdout=PIPE)
        svg = traced.stdout.read()
        
        # import ipdb; ipdb.set_trace()
        
        #RANDOMIZE
        palette = get_palette(params['palette_id'])
        bg_color = palette.pop(int(params['background_index']))
        randomized_svg = randomize_colors(ET.fromstring(svg), palette)

        file_name = '{}.{}'.format(uuid.uuid4(), 'svg')
        map_row = Map.objects.create(**params.dict())
        map_row.svg.save(file_name, ContentFile(str(ET.tostring(randomized_svg))))
        map_row.save()
        
        result = svg_to_png(randomized_svg, bg_color)
        
        return HttpResponse(base64.b64encode(result), content_type="image/png")
