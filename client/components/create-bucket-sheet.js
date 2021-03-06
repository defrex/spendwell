
import Relay from 'react-relay'
import { Component, PropTypes } from 'react'

import BucketForm from 'components/bucket-form'
import Card from 'components/card'
import CardList from 'components/card-list'
import TextActions from 'components/text-actions'
import BottomSheet from 'components/bottom-sheet'
import A from 'components/a'
import Button from 'components/button'
import Spinner from 'components/spinner'

import track from 'utils/track'
import { handleMutationError } from 'utils/network-layer'
import { CreateBucketMutation } from 'mutations/buckets'
import { SettingsMutation } from 'mutations/users'

import styles from 'sass/components/create-bucket-sheet'


class CreateBucketSheet extends Component {
  static propTypes = {
    relay: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    onComplete: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    type: PropTypes.oneOf(['bill', 'expense', 'goal']).isRequired,
    initialFilters: PropTypes.arrayOf(PropTypes.object),
    initialName: PropTypes.string,
  };

  state = {
    loading: false,
  };

  componentWillReceiveProps (nextProps) {
    if (nextProps.visible !== this.props.visible) {
      this.props.relay.setVariables({ open: nextProps.visible })
    }
  }

  handleSubmit () {
    const { viewer, type, onRequestClose, onComplete } = this.props
    const { loading } = this.state
    const bucketForm = this.refs.bucketForm.refs.component

    if (!bucketForm.isValid() || loading) return

    this.setState({ loading: true })
    Relay.Store.commitUpdate(new CreateBucketMutation({ viewer, type, ...bucketForm.getData() }), {
      onFailure: (response) => {
        this.setState({ loading: false })
        handleMutationError(response)
      },
      onSuccess: () => {
        console.log('Success: CreateBucketMutation')

        this.setState({ loading: false })
        bucketForm.reset()

        onComplete()
        onRequestClose()

        track(
          type === 'expense' ? 'create-label' :
          type === 'bill' ? 'create-bill' :
          type === 'account' ? 'create-external-account' :
          'create-bucket'
        )
      },
    })
  }

  dismissHelp () {
    const { viewer, type } = this.props

    Relay.Store.commitUpdate(new SettingsMutation({
      viewer,
      [`create${type.charAt(0).toUpperCase()}${type.slice(1)}Help`]: false,
    }), { onFailure: handleMutationError })
  }

  render () {
    const { viewer, type, onRequestClose, initialFilters, initialName, relay } = this.props
    const { open } = relay.variables
    const { loading } = this.state

    return (
      <BottomSheet
        className={`${styles.root} ${type}`}
        visible={open}
        onRequestClose={onRequestClose}
        title={
            type === 'expense' ? 'New Label' :
            type === 'bill' ? 'New Bill' :
            type === 'goal' ? 'New Goal' :
            null
        }
        actions={loading ?
          <div className='spinner-container'><Spinner/></div>
        :
          <Button className='action' onClick={::this.handleSubmit} plain color='light'>Save</Button>
        }
      >
        {open && (
          (type === 'expense' && viewer.settings.createLabelHelp) ||
          (type === 'bill' && viewer.settings.createBillHelp) ||
          (type === 'goal' && viewer.settings.createGoalHelp)
        ) ?
          <CardList>
            <Card>
              {type === 'expense' ? `
                Labels are for tracking spending. We'll show you a 3-month average,
                and if you're on track to be over or under for the current month.
              ` : type === 'bill' ? `
                Bills are for monthly recurring expenses. We'll track if the bill has been
                paid and take unpaid bills out of safe-to-spend.
              ` : type === 'goal' ? `
                Goals are for saving. They come out of safe-to-spend at the
                beginning of the month so you're paying yourself first.
              ` : null}
              <TextActions>
                <A onClick={::this.dismissHelp}>Dismiss</A>
              </TextActions>
            </Card>
          </CardList>
        : null}

        {open ?
          <BucketForm
            ref='bucketForm'
            viewer={viewer}
            bucket={null}
            loading={loading}
            type={type}
            initialName={initialName}
            initialFilters={initialFilters}
          />
        : null}
      </BottomSheet>
    )
  }
}

CreateBucketSheet = Relay.createContainer(CreateBucketSheet, {
  initialVariables: {
    open: false,
    count: 50,
  },
  fragments: {
    viewer: (variables) => Relay.QL`
      fragment on Viewer {
        ${BucketForm.getFragment('viewer').if(variables.open)}
        ${CreateBucketMutation.getFragment('viewer').if(variables.open)}
        ${SettingsMutation.getFragment('viewer').if(variables.open)}

        settings @include(if: $open) {
          createLabelHelp
          createBillHelp
          createGoalHelp
        }
      }
    `,
  },
})

export default CreateBucketSheet
