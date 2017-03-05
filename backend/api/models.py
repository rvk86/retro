from __future__ import unicode_literals
from django.conf import settings
from django.db import models
from django.contrib.postgres.fields import ArrayField
import xml.etree.ElementTree as ET
from PIL import Image
from io import BytesIO

from helpers import parse_style, hex_to_rgba

class Map(models.Model):
    zoom = models.IntegerField()
    center = models.CharField(max_length=50)
    colors = ArrayField(models.CharField(max_length=7))
    background_color = models.CharField(max_length=7)
    svg = models.FileField(upload_to='maps/')
    
    def get_cropped_google_map(self):
        payload = {
            'center': self.center,
            'size': '640x640',
            'scale': 2,
            'zoom': self.zoom,
            'key': settings.GOOGLE_API_KEY,
            'style': parse_style(settings.MAP_STYLE)
        }
        map_request = requests.get('https://maps.googleapis.com/maps/api/staticmap', params=payload)
        with Image.open(BytesIO(map_request.content)) as f:
            width = f.size[0]
            height = f.size[1]
            f = f.crop((0, 0, width, height - 50))
            return f
            
    def randomize_path_colors(self, svg, colors):
        xml = ET.fromstring(svg)
        g = xml.find('{http://www.w3.org/2000/svg}g')

        for path in g.iter('{http://www.w3.org/2000/svg}path'):
            path.set('fill', random.choice(colors))

        return ET.tostring(xml)
        
    def _set_png_bg_color(self, img):
        bg_color = hex_to_rgba(self.bg_color)
        img_w, img_h = img.size
        
        background = Image.new('RGBA', (img_w, img_h), bg_color)
        bg_img = Image.alpha_composite(background, img)
        
        return bg_img
    
    def _set_png_border(self, img, border_width):
        bg_color = hex_to_rgba(self.bg_color)
        img_w, img_h = img.size
        border_img = Image.new('RGBA', (img_w + border_size, img_h + border_size), bg_color)
        bg_w, bg_h = border_img.size
        offset = ((bg_w - img_w) / 2, (bg_h - img_h) / 2)
        border_img.paste(img, offset)
        
        return border_img
        
    def get_png(self, border_width):
        buffer_img = BytesIO()
        png = cairosvg.svg2png(bytestring=ET.tostring(self.svg), write_to=buffer_img)
        
        with Image.open(buffer_img) as img:
            img = self._set_png_bg_color(img)
            img = self._set_png_border(img, border_width)
            buffer_img.seek(0)
            border.save(buffer_img, format='png')
            buffer_img.seek(0)
            return buffer_img.read()
