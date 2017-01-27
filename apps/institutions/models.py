
import logging
from django.db import models
from apps.core.models import SWModel, SWManager


logger = logging.getLogger(__name__)


class InstitutionManager(SWManager):
    pass


class Institution(SWModel):
    owner = models.ForeignKey(
        'users.User',
        related_name='institutions',
        on_delete=models.CASCADE,
    )

    name = models.CharField(max_length=255)
    plaid_id = models.CharField(max_length=255, null=True, blank=True)
    plaid_access_token = models.CharField(max_length=255, null=True, blank=True)
    plaid_public_token = models.CharField(max_length=255, null=True, blank=True)
    finicity_id = models.CharField(max_length=255, null=True, blank=True)
    upload_only = models.BooleanField(default=True)
    reauth_required = models.BooleanField(default=False)
    last_sync = models.DateTimeField(null=True, blank=True)

    logo = models.ImageField(upload_to='institutions/institution/logo', blank=True, null=True)

    objects = InstitutionManager()

    class Meta:
        unique_together = ('plaid_id', 'owner')

    def __str__(self):
        return self.name

    @property
    def institution_template(self):
        if not hasattr(self, '_institution_template'):
            if not self.finicity_id:
                self._institution_template = None

            else:
                try:
                    self._institution_template = InstitutionTemplate.objects.get(
                        finicity_id=self.finicity_id
                    )
                except InstitutionTemplate.DoesNotExist:
                    self._institution_template = None

        return self._institution_template

    @property
    def current_balance(self):
        return (
            self.accounts
            .filter(disabled=False)
            .aggregate(models.Sum('current_balance'))
            ['current_balance__sum']
        ) or 0


class InstitutionTemplate(models.Model):
    name = models.CharField(max_length=255)
    url = models.CharField(max_length=255)
    finicity_id = models.CharField(max_length=255, blank=True, null=True)
    plaid_id = models.CharField(max_length=255, blank=True, null=True)
    color = models.CharField(max_length=21, default='#000000')
    image = models.ImageField(
        upload_to='finicity/institutions',
        null=True, blank=True,
    )
    default = models.CharField(max_length=20, blank=True, default='', choices=(
        ('', 'Search Only'),
        ('us', 'USA'),
        ('ca', 'Canada'),
    ))
