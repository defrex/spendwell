# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-04-08 19:39
from __future__ import unicode_literals
from dateutil.relativedelta import relativedelta

from django.db import migrations
from delorean import Delorean

from apps.core.utils import this_month, months_ago


def first_data_month(apps, user):
    Transaction = apps.get_model('transactions', 'Transaction')

    first_transaction = Transaction.objects.filter(owner=user).order_by('date').first()
    if not first_transaction:
        return user.created
    else:
        return Delorean(first_transaction.date).truncate('month').datetime


def backfill_buckets(apps, schema_editor):
    Bucket = apps.get_model('buckets', 'Bucket')
    BucketMonth = apps.get_model('buckets', 'BucketMonth')
    month_start = this_month()

    for bucket in Bucket.objects.all():
        for i in range(months_ago(first_data_month(apps, bucket.owner))):
            BucketMonth.objects.get_or_create(
                bucket=bucket,
                month_start=month_start - relativedelta(months=i + 1),
            )


class Migration(migrations.Migration):

    dependencies = [
        ('transactions', '0012_transaction_finicity_id'),
        ('users', '0009_user_dashboard_help'),
        ('buckets', '0007_auto_20160315_2140'),
    ]

    operations = [
        migrations.RunPython(backfill_buckets),
    ]
