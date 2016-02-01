# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-02-01 22:40
from __future__ import unicode_literals

from django.conf import settings
import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('buckets', '0004_bucket_filters'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bucket',
            name='filters',
            field=django.contrib.postgres.fields.jsonb.JSONField(default=list),
        ),
        migrations.AlterField(
            model_name='bucket',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='buckets', to=settings.AUTH_USER_MODEL),
        ),
    ]
