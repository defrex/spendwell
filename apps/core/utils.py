
import graphene
from graphql_relay.node.node import from_global_id
from graphql_relay.connection.arrayconnection import cursor_for_object_in_connection


STUB_SCHEMA = graphene.Schema()


def instance_for_node_id(node_id, info, owner=True):
    from spendwell.schema import schema

    resolved_id = from_global_id(node_id)
    object_type = schema.get_type(resolved_id.type)
    node = object_type.get_node(resolved_id.id, info)

    if not node.instance.owner == info.request_context.user:
        return None

    return node.instance


def get_cursor(instance):
    # WARNING: this will scale like shit.
    # See https://github.com/graphql-python/graphene/issues/59
    return cursor_for_object_in_connection(
        list(type(instance).objects.owned_by(instance.owner).values_list('id', flat=True)),
        instance.id
    )


def get_core_type(graphene_type):
    "converts a Graphene scalar type into a graphel-core scalar type"
    return STUB_SCHEMA.T(graphene_type)
