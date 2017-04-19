from rest_framework import serializers

from api.models import Palette

class PaletteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Palette
        fields = ('id', 'title', 'colors')
