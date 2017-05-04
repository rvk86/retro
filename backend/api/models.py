from __future__ import unicode_literals
import xml.etree.ElementTree as ET
import uuid
import random
from io import BytesIO
from PIL import Image, ImageFont, ImageDraw
from django.conf import settings
from django.db import models
from django.core.files.base import ContentFile
from django.contrib.postgres.fields import ArrayField
import requests
import cairosvg

from helpers import parse_style, hex_to_rgba, get_opposite_color


class Map(models.Model):
    zoom = models.IntegerField()
    center = models.CharField(max_length=50)
    colors = ArrayField(models.CharField(max_length=7))
    background_color = models.CharField(max_length=7)
    title = models.CharField(max_length=50, null=True, blank=True)
    svg = models.FileField(upload_to='maps/')

    def save_svg(self, svg):
        file_name = '{}.{}'.format(uuid.uuid4(), 'svg')
        self.svg.save(file_name, ContentFile(svg))

    def get_cropped_google_map(self):
        payload = {
            'center': self.center,
            'size': '640x640',
            'scale': 2,
            'zoom': self.zoom,
            'key': settings.GOOGLE_API_KEY,
            'style': parse_style(settings.MAP_STYLE)
        }

        map_request = requests.get(
            'https://maps.googleapis.com/maps/api/staticmap', params=payload)
        with Image.open(BytesIO(map_request.content)) as img:
            width = img.size[0]
            height = img.size[1]
            img = img.crop((0, 0, width, height - 50))
            return img

    def randomize_path_colors(self, svg):
        xml = ET.fromstring(svg)
        svg_g = xml.find('{http://www.w3.org/2000/svg}g')

        for path in svg_g.iter('{http://www.w3.org/2000/svg}path'):
            path.set('fill', random.choice(self.colors))

        return ET.tostring(xml)

    def _set_png_bg_color(self, img):
        bg_color = hex_to_rgba(self.background_color)
        img_w, img_h = img.size

        background = Image.new('RGBA', (img_w, img_h), bg_color)
        bg_img = Image.alpha_composite(background, img)

        return bg_img

    def _set_png_border(self, img, border_width):
        font = ImageFont.truetype(
            '{}/fonts/Asar-Regular.ttf'.format(settings.STATICFILES_DIRS[0]), 200)
        text_w, text_h = font.getsize(self.title)

        bg_color = hex_to_rgba(self.background_color)
        img_w, img_h = img.size
        bg_w = img_w + border_width
        bg_h = img_h + text_h + border_width + (border_width / 2)
        border_img = Image.new(
            'RGBA', (bg_w, bg_h), bg_color)
        offset = (border_width / 2, border_width / 2)
        border_img.paste(img, offset)

        text_color = hex_to_rgba(get_opposite_color(
            self.background_color, self.colors))
        text_x = (bg_w / 2) - (text_w / 2)
        text_y = bg_h - text_h - border_width
        draw = ImageDraw.Draw(border_img)
        draw.text((text_x, text_y), self.title,
                  font=font, fill=text_color)

        return border_img

    def get_png(self, border_width):
        buffer_img = BytesIO()
        cairosvg.svg2png(bytestring=self.svg.read(), write_to=buffer_img)

        with Image.open(buffer_img) as img:
            img = self._set_png_bg_color(img)
            img = self._set_png_border(img, border_width)
            buffer_img.seek(0)
            img.save(buffer_img, format='png')
            buffer_img.seek(0)
            return buffer_img.read()


class Palette(models.Model):
    title = models.CharField(max_length=50)
    colors = ArrayField(models.CharField(max_length=7))

class PrintSize(models.Model):
    title = models.CharField(max_length=50)
    width = models.DecimalField(max_digits=5, decimal_places=2)
    height = models.DecimalField(max_digits=5, decimal_places=2)
