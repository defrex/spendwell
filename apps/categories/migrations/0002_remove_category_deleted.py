# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-02-10 15:01
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('categories', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='category',
            name='deleted',
        ),
    ]
