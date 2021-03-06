
import graphene

from apps.core.fields import SWNode, SWFilterConnectionField
from apps.core.types import Money
from apps.transactions.schema import TransactionNode
from apps.transactions.fields import TransactionConnectionField

from .models import Account
from .filters import AccountFilter


class AccountNode(SWNode):
    current_balance = graphene.Field(Money)
    transactions = TransactionConnectionField(TransactionNode)

    class Meta:
        model = Account
        filter_order_by = ['name']
        only_fields = (
            'name',
            'type',
            'subtype',
            'current_balance',
            'number_snippet',
            'transactions',
            'disabled',
            'institution',
        )


class AccountsQuery(graphene.ObjectType):
    account = graphene.relay.NodeField(AccountNode)
    accounts = SWFilterConnectionField(AccountNode, filterset_class=AccountFilter)

    class Meta:
        abstract = True
