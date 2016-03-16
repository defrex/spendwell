
from django.contrib import admin

from spendwell.admin import admin_site
from .models import Bucket, BucketMonth


class BucketAdmin(admin.ModelAdmin):
    list_displat = ('name', 'owner_secret_id')
    readonly_fields = ('owner_secret_id',)
    fields = (
        'owner_secret_id',
        'name',
        'filters',
        'type',
    )

admin_site.register(Bucket, BucketAdmin)


class BucketMonthAdmin(admin.ModelAdmin):
    list_display = ('bucket', 'month_start')

admin_site.register(BucketMonth, BucketMonthAdmin)
