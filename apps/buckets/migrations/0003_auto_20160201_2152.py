# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-02-01 21:52
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('buckets', '0002_auto_20151202_1521'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='bucket',
            name='autofill',
        ),
        migrations.RemoveField(
            model_name='bucket',
            name='monthly_amount',
        ),
    ]