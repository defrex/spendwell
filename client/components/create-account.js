
import _ from 'lodash'
import { Component, PropTypes } from 'react'
import Relay from 'react-relay'
import { browserHistory } from 'react-router'

import TextInput from 'components/text-input'
import Card from 'components/card'
import CardList from 'components/card-list'

import { parseUrl } from 'utils'

import styles from 'sass/views/add-plaid.scss'

class CreateAccount extends Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
    relay: PropTypes.object.isRequired,
  };

  state = { results: [] };

  constructor () {
    super()
    this.handleSearch = _.debounce(this.handleSearch.bind(this), 300)
  }

  handleSearch (query) {
    const { relay } = this.props

    relay.setVariables({ query })
  }

  handleConnected () {
    if (document.location.pathname.indexOf('onboarding') !== -1) {
      browserHistory.push('/onboarding/accounts')
    } else {
      browserHistory.push('/app/accounts')
    }
  }

  handleTemplateClick (institutionTemplate) {
    const { relay } = this.props

    if (institutionTemplate.finicityId) {
      relay.setVariables({ finicitySelectedId: institutionTemplate.id })
    } else if (institutionTemplate.plaidId) {
      this.selectPlaidInstitution(institutionTemplate.plaidId)
    }
  }

  render () {
    const { viewer } = this.props

    return (
      <CardList className={styles.root}>
        <Card>
          <TextInput label='Bank Name' onChange={this.handleSearch}/>
        </Card>

        {viewer.institutionTemplates ? viewer.institutionTemplates.edges.map(({ node }) =>
          <Card
            key={node.id}
            className={`fi ${node.image ? 'has-logo' : ''}`}
            onClick={this.handleTemplateClick.bind(this, node)}
            style={{ borderLeftColor: node.color }}
          >
            {node.image ? <img src={node.image} alt={node.name}/> : null}
            <div className='fi-name'><strong>{node.name}</strong></div>
            <div className='fi-domain'>{parseUrl(node.url).hostname}</div>
          </Card>
        ) : null}
      </CardList>
    )
  }
}

CreateAccount = Relay.createContainer(CreateAccount, {
  initialVariables: {
    query: null,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        institutionTemplates(query: $query, first: 10) {
          edges {
            node {
              id
              name
              url
              image
              color
            }
          }
        }
      }
    `,
  },
})

export default CreateAccount
