# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-06-07 19:52
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('institutions', '0011_auto_20160527_1329'),
    ]

    operations = [
        migrations.CreateModel(
            name='InstitutionTemplate',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('url', models.CharField(max_length=255)),
                ('finicity_id', models.CharField(max_length=255)),
                ('plaid_id', models.CharField(max_length=255)),
                ('color', models.CharField(default='#000000', max_length=7)),
                ('image', models.ImageField(blank=True, null=True, upload_to='finicity/institutions')),
            ],
        ),
    ]