
import Relay from 'react-relay'


export class DisableAccountMutation extends Relay.Mutation {
  static fragments = {
    account: () => Relay.QL`
      fragment on AccountNode {
        id
      }
    `,
  };

  getMutation () {
    return Relay.QL`mutation { disableAccount }`
  }

  getVariables () {
    return {
      accountId: this.props.account.id,
      detectTransfers: this.props.detectTransfers,
    }
  }

  getFatQuery () {
    return Relay.QL`
      fragment on DisableAccountMutationPayload {
        account {
          disabled
        }
      }
    `
  }

  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        account: this.props.account.id,
      },
    }]
  }

  getOptimisticResponse () {
    return {
      account: {
        id: this.props.account.id,
        disabled: true,
      },
    }
  }
}

export class EnableAccountMutation extends Relay.Mutation {
  static fragments = {
    account: () => Relay.QL`
      fragment on AccountNode {
        id
      }
    `,
  };

  getMutation () {
    return Relay.QL`mutation { enableAccount }`
  }

  getVariables () {
    return {
      accountId: this.props.account.id,
      sync: this.props.sync,
    }
  }

  getFatQuery () {
    return Relay.QL`
      fragment on EnableAccountMutationPayload {
        account {
          disabled
        }
      }
    `
  }

  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        account: this.props.account.id,
      },
    }]
  }

  getOptimisticResponse () {
    return {
      account: {
        id: this.props.account.id,
        disabled: false,
      },
    }
  }
}

export class CreateAccountMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
      }
    `,
  };

  getMutation () {
    return Relay.QL`mutation { createAccount }`
  }

  getVariables () {
    return {
      institutionId: this.props.institution.id,
      name: this.props.name,
    }
  }

  getFatQuery () {
    return Relay.QL`
      fragment on CreateAccountMutationPayload {
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
