from rest_framework import serializers

from api.models import Palette, PrintSize

class PaletteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Palette
        fields = ('id', 'title', 'colors')

class PrintSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrintSize
        fields = ('id', 'title', 'width', 'height')
