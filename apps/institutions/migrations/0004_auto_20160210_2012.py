# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-02-10 20:12
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('institutions', '0003_auto_20160210_1744'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='institution',
            unique_together=set([('plaid_id', 'owner')]),
        ),
    ]
