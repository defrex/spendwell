# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-02-09 22:01
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('goals', '0002_goal_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='GoalMonth',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('deleted', models.BooleanField(default=False)),
                ('month_start', models.DateTimeField()),
                ('target_amount', models.DecimalField(decimal_places=2, max_digits=12)),
                ('filled_amount', models.DecimalField(decimal_places=2, max_digits=12)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.RemoveField(
            model_name='goal',
            name='monthly_amount',
        ),
        migrations.AddField(
            model_name='goalmonth',
            name='goal',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='months', to='goals.Goal'),
        ),
    ]