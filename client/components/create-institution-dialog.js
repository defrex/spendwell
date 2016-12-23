
import { Component, PropTypes } from 'react'
import Relay from 'react-relay'

import Button from 'components/button'
import TextInput from 'components/text-input'
import Dialog from 'components/dialog'
import DialogActions from 'components/dialog-actions'
import { CreateInstitutionMutation } from 'mutations/institutions'
import { handleMutationError } from 'utils/network-layer'

class CreateInstitutionDialog extends Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
    relay: PropTypes.object.isRequired,
    onRequestClose: PropTypes.func.isRequired,
  };

  state = { results: [] };

  handleSearch (name) {
    this.setState({ name })
  }

  submit () {
    const { viewer, onRequestClose } = this.props
    const { name } = this.state

    Relay.Store.commitUpdate(new CreateInstitutionMutation({ viewer, name }), {
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
    const { onRequestClose } = this.props
    const { loading } = this.state

    return (
      <Dialog size='sm' onRequestClose={onRequestClose}>
        <div className='body'>
          <h3>Add a new Bank</h3>
          <TextInput
            label='Bank Name'
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

CreateInstitutionDialog = Relay.createContainer(CreateInstitutionDialog, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        ${CreateInstitutionMutation.getFragment('viewer')}
      }
    `,
  },
})

export default CreateInstitutionDialog
