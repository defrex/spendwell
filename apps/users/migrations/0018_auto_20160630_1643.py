# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-06-30 16:43
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0017_authtoken'),
    ]

    operations = [
        migrations.RenameField(
            model_name='authtoken',
            old_name='device_id',
            new_name='device_name',
        ),
        migrations.RemoveField(
            model_name='authtoken',
            name='expiry',
        ),
    ]