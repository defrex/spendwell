
from django.db import models

from apps.core.models import SWModel, SWManager


class AccountManager(SWManager):
    pass


class Account(SWModel):
    owner = models.ForeignKey(
        'users.User',
        related_name='accounts',
        on_delete=models.CASCADE,
    )
    institution = models.ForeignKey(
        'institutions.Institution',
        related_name='accounts',
        on_delete=models.CASCADE,
    )

    name = models.CharField(max_length=255)
    type = models.CharField(max_length=255, default='chequing')
    subtype = models.CharField(max_length=255, null=True)
    current_balance = models.DecimalField(
        decimal_places=2,
        max_digits=12,
        null=True, blank=True,
    )
    available_balance = models.DecimalField(
        decimal_places=2,
        max_digits=12,
        null=True, blank=True,
    )
    number_snippet = models.CharField(max_length=255, blank=True, null=True)
    plaid_id = models.CharField(max_length=255, blank=True, null=True)
    finicity_id = models.CharField(max_length=255, blank=True, null=True)
    disabled = models.BooleanField(default=False, db_index=True)

    objects = AccountManager()

    def __str__(self):
        if self.subtype:
            return '{} - {} > {}'.format(self.name, self.type, self.subtype)
        else:
            return '{} - {}'.format(self.name, self.type)

    def disable(self, detect_transfers=True):
        from apps.transactions.tasks import detect_transfers as detect_transfers_task

        self.disabled = True
        self.save()
        self.transactions.all().delete()

        if detect_transfers:
            detect_transfers_task.delay(self.owner.id)

    def enable(self):
        self.disabled = False
        self.save()
