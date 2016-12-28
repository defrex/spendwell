
import { Component, PropTypes } from 'react'
import Relay from 'react-relay'

import App from 'components/app'
import Card from 'components/card'
import CardList from 'components/card-list'
import Select from 'components/select'
import A from 'components/a'
import TextActions from 'components/text-actions'

import sendToast from 'utils/send-toast'
import { handleMutationError } from 'utils/network-layer'
import { UploadCsvMutation } from 'mutations/transactions'

class UploadCSV extends Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
    relay: PropTypes.object.isRequired,
  }

  state = {
    loading: false,
    institution: null,
    account: null,
  }

  handleFileUpload (event) {
    const { account } = this.state

    this.setState({ loading: true })

    const fileReader = new FileReader()
    fileReader.addEventListener('load', (event) => {
      Relay.Store.commitUpdate(new UploadCsvMutation({ account, csv: event.target.result }), {
        onFailure: (response) => {
          this.setState({ loading: false })
          handleMutationError(response)
        },
        onSuccess: () => {
          this.setState({ loading: false })
          sendToast('CSV uploaded successfully')
        },
      })
    })
    fileReader.readAsText(event.currentTarget.files[0])
  }

  render () {
    const { viewer, relay } = this.props
    const { loading, institution, account } = this.state

    return (
      <App
        viewer={viewer}
        title='Upload CSV'
        onForceFetch={relay.forceFetch}
      >
        <CardList>
          <Card>
            <Select
              label='Institution'
              initialValue={viewer.institutions.edges[0]}
              options={viewer.institutions.edges.map(({ node }) => ({
                value: node,
                label: node.name,
              }))}
              onChange={(institution) => this.setState({ institution })}
            />
          </Card>
          {institution ? (
            <Card>
              <Select
                label='Account'
                initialValue={institution.accounts.edges[0]}
                options={institution.accounts.edges.map(({ node }) => ({
                  value: node,
                  label: node.name,
                }))}
                onChange={(account) => this.setState({ account })}
              />
            </Card>
          ) : null}
          {account ? (
            <Card loading={loading}>
              <TextActions>
                <A onClick={() => this.refs.fileInput.click()}>Upload CSV</A>
              </TextActions>
              <input
                type='file'
                ref='fileInput'
                onChange={::this.handleFileUpload}
                style={{ display: 'none' }}
              />
            </Card>
          ) : null}
        </CardList>
      </App>
    )
  }
}

UploadCSV = Relay.createContainer(UploadCSV, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        ${App.getFragment('viewer')}

        institutions(first: 100)  {
          edges {
            node {
              name
              id

              accounts(first: 100) {
                edges {
                  node {
                    ${UploadCsvMutation.getFragment('account')}

                    name
                    id
                  }
                }
              }
            }
          }
        }
      }
    `,
  },
})

export default UploadCSV

