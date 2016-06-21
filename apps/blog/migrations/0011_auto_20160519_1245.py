# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-05-19 16:45
from __future__ import unicode_literals

from django.db import migrations
import resize.fields


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0010_auto_20160519_1228'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='hero_art',
            field=resize.fields.ResizedImageField(resolutions=('1920x525', '750x500'), upload_to=''),
        ),
        migrations.AlterField(
            model_name='entry',
            name='hero_art',
            field=resize.fields.ResizedImageField(resolutions=('1920x525', '750x500'), upload_to=''),
        ),
    ]
