
from decimal import Decimal

import graphene
from graphene.relay.types import Edge

from .models import Goal
from .schema import GoalNode


GoalEdge = Edge.for_node(GoalNode)


class CreateGoalMutation(graphene.relay.ClientIDMutation):
    class Input:
        name = graphene.String()
        monthly_amount = graphene.Int()

    viewer = graphene.Field('Viewer')
    goal_edge = graphene.Field(GoalEdge)

    @classmethod
    def mutate_and_get_payload(cls, input, info):
        from spendwell.schema import Viewer

        monthly_amount = Decimal(input['monthly_amount']) / Decimal('100')
        if monthly_amount > 0:
            monthly_amount = -monthly_amount

        return CreateGoalMutation(
            viewer=Viewer(),
            goal_edge=GoalEdge(
                cursor='none',
                node=Goal.objects.create(
                    owner=info.request_context.user,
                    name=input['name'],
                    monthly_amount=monthly_amount,
                ),
            ),
        )


class GoalsMutations(graphene.ObjectType):
    create_goal = graphene.Field(CreateGoalMutation)

    class Meta:
        abstract = True