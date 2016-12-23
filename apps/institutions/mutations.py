
import graphene
from graphene.utils import with_context
from graphene.relay.types import Edge

from .models import Institution
from .schema import InstitutionNode


InstitutionEdge = Edge.for_node(InstitutionNode)


class CreateInstitutionMutation(graphene.relay.ClientIDMutation):
    class Input:
        name = graphene.String()
        color = graphene.String()

    viewer = graphene.Field('Viewer')

    @classmethod
    @with_context
    def mutate_and_get_payload(cls, input, context, info):
        from spendwell.schema import Viewer

        Institution.objects.create(
            owner=context.user,
            name=input['name'],
        )

        return CreateInstitutionMutation(viewer=Viewer())


class InstitutionsMutations(graphene.ObjectType):
    create_institution = graphene.Field(CreateInstitutionMutation)

    class Meta:
        abstract = True
