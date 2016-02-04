
from graphql_relay.node.node import from_global_id


def instance_for_node_id(node_id, info):
    from spendwell.schema import schema

    resolved_id = from_global_id(node_id)
    object_type = schema.get_type(resolved_id.type)
    node = object_type.get_node(resolved_id.id, info)

    return node.instance