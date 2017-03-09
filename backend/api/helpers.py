import json, requests
import xml.etree.ElementTree as ET

# PARSE GOOGLE MAPS STYLE JSON (https://mapstyle.withgoogle.com/) AND REORDER TO OBJECT FOR URL
def parse_style(json_str):
    content = json.loads(json_str)
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
    
    
def get_palette(id):
    # xml = requests.get('http://www.colourlovers.com/api/palette/{}'.format(id))
    # root = ET.fromstring(xml.content)
    colors = ['#FFFF00', '#FF0000', '#00EE00']
    # for color in root.find('palette/colors'):
    #     colors.append('#{}'.format(color.text))
        
    return colors
    

def hex_to_rgba(color):
    hex_code = color[1:]
    rgba = tuple(int(hex_code[i:i+2], 16) for i in (0, 2 ,4)) + (255,)
    
    return rgba
