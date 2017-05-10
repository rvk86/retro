from rest_framework import serializers

from api.models import Palette, PrintSize, Font

class PaletteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Palette
        fields = ('id', 'title', 'colors')

class PrintSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrintSize
        fields = ('id', 'title', 'width', 'height')

class FontSerializer(serializers.ModelSerializer):
    class Meta:
        model = Font
        fields = ('id', 'family')
