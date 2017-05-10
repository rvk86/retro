from django.core.management.base import BaseCommand
import requests
import xml.etree.ElementTree as ET

from django.conf import settings
from api.models import Font

class Command(BaseCommand):
    help = 'Populate Fonts table with data from Google fonts'

    def handle(self, **kwargs):
        payload = {
            'key': settings.GOOGLE_API_KEY
        }
        fonts = requests.get(
            'https://www.googleapis.com/webfonts/v1/webfonts', payload)

        font_list = []
        for font in fonts.json()['items']:
            font_list.append({
                'family': font['family'],
                'files': font['files']
            })

        Font.objects.bulk_create([Font(**f) for f in font_list])
