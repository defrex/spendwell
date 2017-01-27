
import Relay from 'react-relay'

export class CreateInstitutionMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
      }
    `,
  };

  getMutation () {
    return Relay.QL`mutation { createInstitution }`
  }

  getVariables () {
    return {
      name: this.props.name,
    }
  }

  getFatQuery () {
    return Relay.QL`
      fragment on CreateInstitutionMutationPayload {
        viewer { dummy }
      }
    `
  }

  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        viewer: this.props.viewer.id,
      },
    }]
  }
}
