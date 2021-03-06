
import Relay from 'react-relay'


export class SetIncomeEstimateMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id,
      }
    `,
  };

  getMutation () {
    return Relay.QL`mutation { setIncomeEstimate }`
  }

  getVariables () {
    return { amount: this.props.amount }
  }

  getFatQuery () {
    return Relay.QL`
      fragment on SetIncomeEstimateMutationPayload {
        viewer {
          settings {
            estimatedIncomeConfirmed
          }

          summary {
            income
            incomeEstimated
            estimatedIncome
            net
          }
        }
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


export class SettingsMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id,
      }
    `,
  };

  getMutation () {
    return Relay.QL`mutation { settings }`
  }

  getVariables () {
    return {
      dashboardHelp: this.props.dashboardHelp,
      createLabelHelp: this.props.createLabelHelp,
      createBillHelp: this.props.createBillHelp,
      createGoalHelp: this.props.createGoalHelp,
    }
  }

  getFatQuery () {
    return Relay.QL`
      fragment on SettingsMutationPayload {
        viewer {
          settings
        }
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

  getOptimisticResponse () {
    return {
      settings: {
        dashboardHelp: this.props.dashboardHelp,
      },
    }
  }
}
