# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-19 08:34
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_palette'),
    ]

    operations = [
        migrations.AddField(
            model_name='map',
            name='title',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]