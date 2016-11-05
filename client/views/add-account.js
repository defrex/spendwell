
import { Component, PropTypes } from 'react'
import Relay from 'react-relay'

import CreateAccount from 'components/connect-account'
import App from 'components/app'

class AddAccountView extends Component {
  static propTypes = {
    viewer: PropTypes.object,
  }

  render () {
    const { viewer } = this.props

    return (
      <App
        viewer={viewer}
        className='container skinny'
        title='Create Account'
      >
        <CreateAccount viewer={viewer}/>
      </App>
    )
  }
}

AddAccountView = Relay.createContainer(AddAccountView, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        ${App.getFragment('viewer')}
        ${CreateAccount.getFragment('viewer')}
      }
    `,
  },
})

export default AddAccountView
