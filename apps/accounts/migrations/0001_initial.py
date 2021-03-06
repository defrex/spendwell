# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-12-23 22:28
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('institutions', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Account',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=255)),
                ('type', models.CharField(default='chequing', max_length=255)),
                ('subtype', models.CharField(max_length=255, null=True)),
                ('current_balance', models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True)),
                ('available_balance', models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True)),
                ('number_snippet', models.CharField(blank=True, max_length=255, null=True)),
                ('plaid_id', models.CharField(blank=True, max_length=255, null=True)),
                ('finicity_id', models.CharField(blank=True, max_length=255, null=True)),
                ('disabled', models.BooleanField(db_index=True, default=False)),
                ('institution', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='accounts', to='institutions.Institution')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='accounts', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
