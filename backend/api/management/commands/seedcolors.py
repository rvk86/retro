from django.core.management.base import BaseCommand
import requests
import xml.etree.ElementTree as ET

from api.models import Palette

class Command(BaseCommand):
    help = 'Populate Palette table with initial data from colourlovers'

    def handle(self, **kwargs):
        # Colourlovers results (max 100)
        num_results = 100
        
        xml = requests.get(
            'http://www.colourlovers.com/api/palettes/top/?numResults={}'.format(num_results))
        root = ET.fromstring(xml.content)
        xml_palettes = root.findall('palette')

        palettes = []
        for palette in xml_palettes:
            p = {
                'title': palette.find('title').text,
                'colors': [],
            }
            for color in palette.find('colors'):
                p['colors'].append('#{}'.format(color.text))
            palettes.append(p)

        Palette.objects.bulk_create([Palette(**p) for p in palettes])
