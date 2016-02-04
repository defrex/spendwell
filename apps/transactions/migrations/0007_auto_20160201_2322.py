# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-02-01 23:22
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_auto_20160201_2240'),
        ('transactions', '0006_auto_20160201_2240'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='transfer_pair',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='transactions.Transaction'),
        ),
        migrations.AddField(
            model_name='transaction',
            name='transfer_to',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='incoming_transfers', to='accounts.Account'),
        ),
    ]