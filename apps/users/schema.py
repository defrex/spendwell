
import delorean
import graphene
from graphene.utils import with_context
from graphene.core.types.custom_scalars import DateTime

from apps.core.types import Money, Month
from apps.transactions.schema import TransactionNode
from apps.transactions.fields import TransactionConnectionField
from apps.buckets.schema import BucketNode
from apps.buckets.models import Bucket

from .summary import MonthSummary, BucketMonth


class BucketMonthNode(graphene.relay.Node):
    bucket = graphene.Field(BucketNode)
    month = graphene.Field(Month())
    amount = graphene.Field(Money())
    avg_amount = graphene.Field(Money())
    fixed_amount = graphene.Field(Money())
    use_fixed_amount = graphene.Field(graphene.Boolean())
    target_amount = graphene.Field(Money())
    transactions = TransactionConnectionField(TransactionNode)
    bill_paid = graphene.Field(graphene.Boolean())

    @classmethod
    @with_context
    def get_node(Cls, id, context, info):
        bucket_id, month = id.split(':')

        try:
            bucket = Bucket.objects.get(id=bucket_id, owner=context.user)
        except Bucket.DoesNotExist:
            return None

        month_start = delorean.parse('{}/01'.format(month)).truncate('month').datetime
        bucket_month = BucketMonth(bucket, month_start)
        return Cls(
            bucket=bucket_month.bucket,
            month=bucket_month.month_start,
            amount=bucket_month.amount,
            avg_amount=bucket_month.avg_amount,
            transactions=bucket_month.transactions,
            bill_paid=bucket_month.bill_paid,
        )

    def to_global_id(self):
        return self.global_id('{}:{:%Y/%m}'.format(self.bucket.id, self.month))


class Summary(graphene.ObjectType):
    month_start = graphene.Field(Month())

    true_income = graphene.Field(Money())
    from_savings_income = graphene.Field(Money())
    income = graphene.Field(Money())
    income_estimated = graphene.Field(graphene.Boolean())
    estimated_income = graphene.Field(Money())

    goals_total = graphene.Field(Money())
    bills_paid_total = graphene.Field(Money())
    bills_unpaid_total = graphene.Field(Money())
    spent = graphene.Field(Money())
    allocated = graphene.Field(Money())

    net = graphene.Field(Money())
    spent_from_savings = graphene.Field(Money())

    bucket_months = graphene.relay.ConnectionField(BucketMonthNode)
    transactions = TransactionConnectionField(TransactionNode)


class Settings(graphene.ObjectType):
    timezone = graphene.Field(graphene.String())
    estimated_income_confirmed = graphene.Field(graphene.Boolean())
    dashboard_help = graphene.Field(graphene.Boolean())
    create_label_help = graphene.Field(graphene.Boolean())
    create_bill_help = graphene.Field(graphene.Boolean())
    create_goal_help = graphene.Field(graphene.Boolean())


class UsersQuery(graphene.ObjectType):
    bucket_month = graphene.relay.NodeField(BucketMonthNode)
    summary = graphene.Field(Summary, month=Month())

    safe_to_spend = graphene.Field(Money())
    first_month = graphene.Field(Month())
    email = graphene.Field(graphene.String())
    is_admin = graphene.Field(graphene.Boolean())
    estimated_income = graphene.Field(Money())
    last_sync = graphene.Field(DateTime())

    settings = graphene.Field(Settings)

    class Meta:
        abstract = True

    @with_context
    def resolve_safe_to_spend(self, args, context, info):
        return MonthSummary(context.user).net

    @with_context
    def resolve_summary(self, args, context, info):
        return MonthSummary(context.user, args['month'])

    @with_context
    def resolve_first_month(self, args, context, info):
        return context.user.first_data_month()

    @with_context
    def resolve_email(self, args, context, info):
        return context.user.email

    @with_context
    def resolve_is_admin(self, args, context, info):
        return context.user.is_admin

    @with_context
    def resolve_estimated_income(self, args, context, info):
        return context.user.estimated_income

    @with_context
    def resolve_last_sync(self, args, context, info):
        return context.user.last_sync

    @with_context
    def resolve_settings(self, args, context, info):
        return context.user
