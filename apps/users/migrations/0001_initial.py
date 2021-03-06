# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-12-23 22:28
from __future__ import unicode_literals

import apps.users.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('email', models.EmailField(max_length=255, unique=True, verbose_name='email address')),
                ('is_active', models.BooleanField(default=True)),
                ('is_admin', models.BooleanField(default=False)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('last_sync', models.DateTimeField(blank=True, null=True)),
                ('finicity_id', models.CharField(blank=True, max_length=255, null=True)),
                ('estimated_income', models.DecimalField(decimal_places=2, default=0, max_digits=12)),
                ('timezone', models.CharField(default='America/Toronto', max_length=100)),
                ('estimated_income_confirmed', models.BooleanField(default=False)),
                ('dashboard_help', models.BooleanField(default=True)),
                ('create_label_help', models.BooleanField(default=True)),
                ('create_bill_help', models.BooleanField(default=True)),
                ('create_goal_help', models.BooleanField(default=True)),
                ('email_subscribed', models.BooleanField(default=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='AuthToken',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token', models.CharField(max_length=255)),
                ('device_type', models.CharField(max_length=255)),
                ('device_name', models.CharField(max_length=255)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='BetaCode',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key', models.CharField(default=apps.users.models.get_beta_code, max_length=255)),
                ('intended_for', models.CharField(blank=True, default='', max_length=255)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('used', models.DateTimeField(blank=True, null=True)),
                ('used_by', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='BetaSignup',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('email', models.EmailField(max_length=255, unique=True, verbose_name='email address')),
                ('beta_code', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='beta_signup', to='users.BetaCode')),
            ],
        ),
    ]
