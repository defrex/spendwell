# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-04-12 17:31
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('transactions', '0012_transaction_finicity_id'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='buckettransaction',
            unique_together=set([]),
        ),
        migrations.RemoveField(
            model_name='buckettransaction',
            name='bucket_month',
        ),
        migrations.RemoveField(
            model_name='buckettransaction',
            name='transaction',
        ),
        migrations.RemoveField(
            model_name='transaction',
            name='bucket_months',
        ),
        migrations.DeleteModel(
            name='BucketTransaction',
        ),
    ]