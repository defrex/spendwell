
from django import forms
import django_filters as filters

from apps.categories.models import Category

from .models import Transaction


class BooleanMethodFilter(filters.MethodFilter):
    field_class = forms.BooleanField


class TransactionFilter(filters.FilterSet):
    description = filters.CharFilter(lookup_type='icontains')
    category = filters.MethodFilter()
    date_lte = filters.DateTimeFilter(name='date', lookup_type='lte')
    date_gte = filters.DateTimeFilter(name='date', lookup_type='gte')
    amount_lt = filters.NumberFilter(name='amount', lookup_type='lt')
    amount_gt = filters.NumberFilter(name='amount', lookup_type='gt')
    is_transfer = BooleanMethodFilter()

    class Meta:
        model = Transaction
        fields = (
            'description',
            'category',
            'date_lte',
            'date_gte',
            'amount_gt',
            'amount_lt',
            'from_savings',
            'is_transfer',
        )

    def filter_category(self, queryset, value):
        category = Category.objects.get(id=value)
        return queryset.filter(category__in=[category] + category.all_children())

    def filter_is_transfer(self, queryset, value):
        return queryset.is_transfer(value)
