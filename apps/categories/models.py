
from django.db import models

from apps.core.models import MBModel


class Category(MBModel):
    parent = models.ForeignKey('categories.Category', related_name='children', null=True)
    plaid_id = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=255)
