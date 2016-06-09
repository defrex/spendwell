
from decimal import Decimal
from dateutil.relativedelta import relativedelta

from apps.core.utils import this_month
from apps.transactions.models import Transaction
from .models import Bucket


def bill_month_match(transaction, month_start, ago):
    prev_month_start = month_start - relativedelta(months=ago)
    prev_month_end = month_start - relativedelta(months=ago - 1)

    amount_variation = transaction.amount * Decimal('.10')

    match_count = transaction.account.transactions.filter(
        description=transaction.description,
        date__gte=prev_month_start,
        date__lt=prev_month_end,
        amount__gt=transaction.amount + amount_variation,
        amount__lt=transaction.amount - amount_variation,
    ).count()

    return match_count == 1


def autodetect_bills(user):
    Bucket.objects.filter(owner=user, type='bill').delete()

    full_month_end = this_month()
    full_month_start = full_month_end - relativedelta(months=1)

    for transaction in Transaction.objects.filter(
        owner=user,
        date__gte=full_month_start,
        date__lt=full_month_end,
        amount__lt=0,
    ):
        if (
            bill_month_match(transaction, full_month_start, 0) and
            bill_month_match(transaction, full_month_start, 1) and
            bill_month_match(transaction, full_month_start, 2)
        ):
            Bucket.objects.create(
                owner=user,
                name=transaction.description,
                type='bill',
                filters=[{
                    'description_exact': transaction.description,
                    'account': transaction.account.id,
                }],
            ).assign_transactions()
