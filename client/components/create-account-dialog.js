
import { Component, PropTypes } from 'react'
import Relay from 'react-relay'

import Button from 'components/button'
import TextInput from 'components/text-input'
import Dialog from 'components/dialog'
import DialogActions from 'components/dialog-actions'
import { CreateAccountMutation } from 'mutations/accounts'
import { handleMutationError } from 'utils/network-layer'

class CreateAccountDialog extends Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
    institution: PropTypes.object.isRequired,
    relay: PropTypes.object.isRequired,
    onRequestClose: PropTypes.func.isRequired,
  };

  state = { results: [] };

  handleSearch (name) {
    this.setState({ name })
  }

  submit () {
    const { viewer, institution, onRequestClose } = this.props
    const { name } = this.state

    Relay.Store.commitUpdate(new CreateAccountMutation({ viewer, institution, name }), {
      onFailure: (response) => {
        this.setState({ loading: false })
        handleMutationError(response)
      },
      onSuccess: () => {
        this.setState({ loading: false })
        onRequestClose()
      },
    })
  }

  render () {
    const { onRequestClose, institution } = this.props
    const { loading } = this.state

    return (
      <Dialog size='sm' onRequestClose={onRequestClose}>
        <div className='body'>
          <h3>Add a new account to {institution.name}</h3>
          <TextInput
            label='Account Name'
            onChange={(name) => this.setState({ name })}
          />
        </div>
        <DialogActions>
          <Button onClick={onRequestClose}>Cancel</Button>
          <Button onClick={::this.submit} loading={loading}>Add</Button>
        </DialogActions>
      </Dialog>
    )
  }
}

CreateAccountDialog = Relay.createContainer(CreateAccountDialog, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        ${CreateAccountMutation.getFragment('viewer')}
      }
    `,
    institution: () => Relay.QL`
      fragment on InstitutionNode {
        ${CreateAccountMutation.getFragment('institution')}

        name
      }
    `,
  },
})

export default CreateAccountDialog
