
import graphene
from graphene.utils import with_context
from graphene.relay.types import Edge
from django.conf import settings

from plaid import Client

from apps.buckets.utils import autodetect_bills

from .models import Institution
from .schema import InstitutionNode


InstitutionEdge = Edge.for_node(InstitutionNode)


class ConnectPlaidInstitutionMutation(graphene.relay.ClientIDMutation):
    class Input:
        full_sync = graphene.Boolean()
        public_token = graphene.String()
        plaid_institution_id = graphene.String()
        logo = graphene.String()

    viewer = graphene.Field('Viewer')

    @classmethod
    @with_context
    def mutate_and_get_payload(cls, input, context, info):
        from spendwell.schema import Viewer

        plaid_client = Client(
            client_id=settings.PLAID_CLIENT_ID,
            secret=settings.PLAID_SECRET,
        )

        token_response = plaid_client.exchange_token(input['public_token']).json()
        institution_response = plaid_client.institution(input['plaid_institution_id']).json()

        institution = Institution.objects.from_plaid(
            owner=context.user,
            plaid_id=input['plaid_institution_id'],
            plaid_public_token=input['public_token'],
            plaid_access_token=token_response['access_token'],
            logo_data=input.get('logo'),
            data=institution_response,
        )

        if 'full_sync' in input and input['full_sync']:
            institution.sync()
        else:
            institution.sync_accounts()

        return ConnectPlaidInstitutionMutation(viewer=Viewer())


class SyncInstitutionsMutation(graphene.relay.ClientIDMutation):
    class Input:
        pass

    viewer = graphene.Field('Viewer')

    @classmethod
    @with_context
    def mutate_and_get_payload(cls, input, context, info):
        from spendwell.schema import Viewer

        context.user.sync()
        context.user.estimate_income()
        context.user.save()

        autodetect_bills(context.user)

        return SyncInstitutionsMutation(viewer=Viewer())


class InstitutionsMutations(graphene.ObjectType):
    connect_plaid_institution = graphene.Field(ConnectPlaidInstitutionMutation)
    sync_institutions = graphene.Field(SyncInstitutionsMutation)

    class Meta:
        abstract = True
