from __future__ import unicode_literals
import xml.etree.ElementTree as ET
import uuid
import random
from io import BytesIO
from PIL import Image, ImageFont, ImageDraw
from django.conf import settings
from django.db import models
from django.core.files.base import ContentFile
from django.contrib.postgres.fields import ArrayField, JSONField
import requests
import cairosvg

from helpers import parse_style, hex_to_rgba, get_opposite_color


class Map(models.Model):
    zoom = models.IntegerField()
    center = models.CharField(max_length=50)
    colors = ArrayField(models.CharField(max_length=7))
    background_color = models.CharField(max_length=7)
    title = models.CharField(max_length=50, null=True, blank=True)
    font = models.ForeignKey('Font', on_delete=models.PROTECT)
    width = models.DecimalField(max_digits=5, decimal_places=2)
    height = models.DecimalField(max_digits=5, decimal_places=2)
    svg = models.FileField(upload_to='maps/')

    def save_svg(self, svg):
        file_name = '{}.{}'.format(uuid.uuid4(), 'svg')
        self.svg.save(file_name, ContentFile(svg))

    def get_cropped_google_map(self):
        if self.width < self.height:
            size = '{}x{}'.format(
                640, int(round(640 * (self.width / self.height), 0)))
        else:
            size = '{}x{}'.format(
                int(round(640 * (self.height / self.width), 0)), 640)

        payload = {
            'center': self.center,
            'size': size,
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
        # We should store the ttf files so we don't need to get it from Google every time
        font_file = BytesIO(requests.get(self.font.get_url()).content)
        font = ImageFont.truetype(
            font_file, border_width * 3)
        text_w, text_h = font.getsize(self.title)

        bg_color = hex_to_rgba(self.background_color)
        img_w, img_h = img.size
        cropped = img.crop((border_width, border_width,
                            img_w - border_width, img_h - (border_width * 2) - text_h))
        border_img = Image.new(
            'RGBA', img.size, bg_color)
        offset = (border_width, border_width)
        border_img.paste(cropped, offset)

        text_color = hex_to_rgba(get_opposite_color(
            self.background_color, self.colors))
        text_x = (img_w / 2) - (text_w / 2)
        text_y = img_h - text_h - border_width
        draw = ImageDraw.Draw(border_img)
        draw.text((text_x, text_y), self.title,
                  font=font, fill=text_color)

        return border_img

    def get_png(self, border_width, thumbnail=False):
        buffer_img = BytesIO()
        cairosvg.svg2png(bytestring=self.svg.read(), write_to=buffer_img)

        with Image.open(buffer_img) as img:
            img = self._set_png_bg_color(img)
            img = self._set_png_border(img, border_width)
            if thumbnail:
                img.thumbnail((400, 400), Image.ANTIALIAS)
            buffer_img.seek(0)
            img.save(buffer_img, format='png')
            buffer_img.seek(0)
            return buffer_img.read()

    def __unicode__(self):
        return self.title or str(self.pk)


class Palette(models.Model):
    title = models.CharField(max_length=50)
    colors = ArrayField(models.CharField(max_length=7))

    def __unicode__(self):
        return self.title


class PrintSize(models.Model):
    title = models.CharField(max_length=50)
    width = models.DecimalField(max_digits=5, decimal_places=2)
    height = models.DecimalField(max_digits=5, decimal_places=2)

    def __unicode__(self):
        return self.title

class Font(models.Model):
    family = models.CharField(max_length=50)
    active = models.BooleanField(default=False)
    files = JSONField()

    def get_url(self):
        return self.files.get('regular') or self.files.itervalues().next()

    def __unicode__(self):
        return self.family
