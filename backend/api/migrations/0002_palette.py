# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-19 05:30
from __future__ import unicode_literals

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Palette',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=50)),
                ('colors', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=7), size=None)),
            ],
        ),
    ]
