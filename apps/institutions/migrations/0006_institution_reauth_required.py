# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-04-01 19:17
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('institutions', '0005_institution_finicity_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='institution',
            name='reauth_required',
            field=models.BooleanField(default=False),
        ),
    ]