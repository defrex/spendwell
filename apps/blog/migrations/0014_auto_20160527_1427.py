# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-05-27 18:27
from __future__ import unicode_literals

from django.db import migrations
import taggit.managers


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0013_auto_20160526_1527'),
    ]

    operations = [
        migrations.AlterField(
            model_name='entry',
            name='tags',
            field=taggit.managers.TaggableManager(blank=True, help_text='A comma-separated list of tags.', through='taggit.TaggedItem', to='taggit.Tag', verbose_name='Tags'),
        ),
    ]
