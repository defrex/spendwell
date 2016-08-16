# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-08-04 15:08
from __future__ import unicode_literals

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('buckets', '0013_bucketavatar'),
    ]

    operations = [
        migrations.AddField(
            model_name='bucket',
            name='fixed_amount',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True),
        ),
        migrations.AddField(
            model_name='bucket',
            name='use_fixed_amount',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='bucket',
            name='_filters',
            field=django.contrib.postgres.fields.jsonb.JSONField(blank=True, default=list, null=True),
        ),
        migrations.AlterField(
            model_name='bucket',
            name='type',
            field=models.CharField(choices=[('expense', 'Expense Category'), ('bill', 'Bill'), ('goal', 'Goal'), ('account', 'External Account')], default='expense', max_length=10),
        ),
    ]