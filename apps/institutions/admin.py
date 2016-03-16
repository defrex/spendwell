
from django.contrib import admin

from spendwell.admin import admin_site
from .models import Institution


class InstitutionAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner_secret_id')
    readonly_fields = ('owner_secret_id',)
    fields = (
        'owner_secret_id',
        'name',
        'plaid_id',
        'last_sync',
    )

admin_site.register(Institution, InstitutionAdmin)
