
import graphene
from graphene.relay.types import Edge
from graphene.utils import with_context

from apps.core.utils import instance_for_node_id

from .schema import AccountNode
from .models import Account


AccountEdge = Edge.for_node(AccountNode)


class DisableAccountMutation(graphene.relay.ClientIDMutation):
    class Input:
        account_id = graphene.ID()
        detect_transfers = graphene.Boolean()

    account = graphene.Field(AccountNode)

    @classmethod
    @with_context
    def mutate_and_get_payload(cls, input, context, info):
        account = instance_for_node_id(input.get('account_id'), context, info)
        account.disable(input.get('detect_transfers', True))
        return DisableAccountMutation(account=account)


class EnableAccountMutation(graphene.relay.ClientIDMutation):
    class Input:
        account_id = graphene.ID()

    account = graphene.Field(AccountNode)

    @classmethod
    @with_context
    def mutate_and_get_payload(cls, input, context, info):
        account = instance_for_node_id(input.get('account_id'), context, info)
        account.enable()
        return EnableAccountMutation(account=account)


class CreateAccountMutation(graphene.relay.ClientIDMutation):
    class Input:
        institution_id = graphene.ID()
        name = graphene.String()

    viewer = graphene.Field('Viewer')

    @classmethod
    @with_context
    def mutate_and_get_payload(cls, input, context, info):
        from spendwell.schema import Viewer

        Account.objects.create(
            owner=context.user,
            institution=instance_for_node_id(input.get('institution_id'), context, info),
            name=input.get('name'),
        )

        return CreateAccountMutation(viewer=Viewer())


class AccountsMutations(graphene.ObjectType):
    disable_account = graphene.Field(DisableAccountMutation)
    enable_account = graphene.Field(EnableAccountMutation)
    create_account = graphene.Field(CreateAccountMutation)

    class Meta:
        abstract = True
