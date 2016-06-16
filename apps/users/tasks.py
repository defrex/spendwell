
from celery import shared_task
from django.utils import timezone
from dateutil.relativedelta import relativedelta

from apps.core.utils import this_month, months_ago
from apps.core.utils.email import send_email
from apps.users.models import User


@shared_task
def estimate_income(user_id):
    user = User.objects.get(id=user_id)

    current_month = this_month()
    income_months = [
        user.transactions
        .filter(amount__gt=0)
        .filter(account__disabled=False)
        .filter(date__lt=current_month - relativedelta(months=i))
        .filter(date__gte=current_month - relativedelta(months=i + 1))
        .is_transfer(False)
        .sum()
        for i in range(months_ago(user.first_data_month()) - 1)
    ]

    if len(income_months) > 0:
        user.estimated_income = min(income_months)
    else:
        user.estimated_income = 0

    user.save()


@shared_task
def user_sync_complete(user_id):
    user = User.objects.get(id=user_id)

    if not user.last_sync:
        send_email(
            to=user.email,
            subject='Get Started With Spendwell',
            template='users/email/sync-notification.html',
        )

    user.last_sync = timezone.now()
    user.save()
