# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-02-04 20:44
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_auto_20160201_2240'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='type',
            field=models.CharField(default='chequing', max_length=255),
        ),
    ]
