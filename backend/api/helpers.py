import json


def parse_style(json_str):
    '''
    Parse Google Maps style json (https://mapstyle.withgoogle.com/)
    and reorder to object for URL
    '''
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


def hex_to_rgba(color):
    hex_code = color[1:]
    rgba = tuple(int(hex_code[i:i + 2], 16) for i in (0, 2, 4)) + (255,)

    return rgba
    

def get_brightness(rgba):
    return int((rgba[0] + rgba[1] + rgba[2]) / 3)
    
    
def darken(rgba, value):
    red = int(rgba[0] - (rgba[0] * value))
    green = int(rgba[1] - (rgba[1] * value))
    blue = int(rgba[2] - (rgba[2] * value))
    return (red, green, blue, rgba[3])
    
    
def lighten(rgba, value):
    red = int(rgba[0] + (rgba[0] * value))
    if red > 255:
        red = 255
    green = int(rgba[1] + (rgba[1] * value))
    if green > 255:
        green = 255
    blue = int(rgba[2] + (rgba[2] * value))
    if blue > 255:
        blue = 255
    return (red, green, blue, rgba[3])
    

def get_opposite_color(color, colors):
    color_b = get_brightness(hex_to_rgba(color))
    brightnesses = [get_brightness(hex_to_rgba(c)) for c in colors]
    diffs = [abs(color_b - b) for b in brightnesses]
    
    max_diff = max(diffs)
    max_index = diffs.index(max_diff)
    
    return colors[max_index]
        
