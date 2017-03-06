# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-03-05 14:39
from __future__ import unicode_literals

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Map',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('zoom', models.IntegerField()),
                ('center', models.CharField(max_length=50)),
                ('colors', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=7), size=None)),
                ('background_color', models.CharField(max_length=7)),
                ('svg', models.FileField(upload_to='maps/')),
            ],
        ),
    ]
