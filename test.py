from PIL import Image
from io import BytesIO
from subprocess import call
import json, requests, logging, random, sys
import xml.etree.ElementTree as ET

# logging.basicConfig(level=logging.DEBUG)

# PARSE GOOGLE MAPS STYLE JSON (https://mapstyle.withgoogle.com/) AND REORDER TO OBJECT FOR URL
def parse_style():
    with open('styling.json') as f:
        content = json.loads(f.read())
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
def save_cropped_google_map(center, file_name):
    payload = {
        'center': center,
        'size': '640x640',
        'scale': 2,
        'zoom': 14,
        'key': 'AIzaSyAy2awhVyQuvbdg0-3AzPZdUJpRejF9yj8',
        'style': parse_style()
    }
    map_request = requests.get('https://maps.googleapis.com/maps/api/staticmap', params=payload)
    with Image.open(BytesIO(map_request.content)) as f:
        width = f.size[0]
        height = f.size[1]
        f = f.crop((0, 0, width, height - 50))
        f.save(file_name)

# RANDOMIZE COLORS
def randomize_colors(file_name, palette):
    with open(file_name) as svg:
        tree = ET.parse(svg)
        root = tree.getroot()
        g = root.find('{http://www.w3.org/2000/svg}g')

        for path in g.iter('{http://www.w3.org/2000/svg}path'):
            path.set('fill', random.choice(palette))
        
        tree.write(file_name)
        
def get_palette(id):
    xml = requests.get('http://www.colourlovers.com/api/palette/{}'.format(id))
    root = ET.fromstring(xml.content)
    colors = []
    for color in root.find('palette/colors'):
        colors.append('#{}'.format(color.text))
        
    return colors
    
if __name__ == "__main__":
    # GET MAP FROM GOOGLE
    save_cropped_google_map(sys.argv[1], 'temp.png')
    
    # CONVERT TO BMP, ONLY ACCEPTED FILE TYPE BY POTRACE
    call(["convert", 'temp.png', 'temp.bmp'])
    
    # TRACE BMP FILE
    call(["potrace", '--svg', '--turdsize', '50', 'temp.bmp'])
    
    #RANDOMIZE
    palette = get_palette(sys.argv[2])
    bg_color = palette.pop(int(sys.argv[3]))
    randomize_colors('temp.svg', palette)
    
    file_name = '{}.png'.format(sys.argv[1].replace(' ', '_').lower())
    call(['convert', 
          'temp.svg', 
          '-background', 
          bg_color, 
          '-flatten', 
          '-bordercolor', 
          bg_color,
          '-border', 
          '50x50',
          file_name])
