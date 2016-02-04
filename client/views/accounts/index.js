
import { Component } from 'react';
import Relay from 'react-relay';
import relayContainer from 'relay-decorator';

import Button from 'components/button';
import AccountList from './account-list';
import styles from './styles';


@relayContainer({ fragments: {
  viewer: ()=> Relay.QL`
    fragment on Viewer {
      institutions(first: 10) {
        edges {
          node {
            id
            name
            ${AccountList.getFragment('institution')}
          }
        }
      }
    }
  `,
} })
export default class InstitutionsView extends Component {
  render() {
    const { viewer: { institutions } } = this.props;

    return (
      <div className={`container ${styles.root}`}>
        <div className='heading'>
          <h1>Institutions</h1>
          <Button to='/app/accounts/add/plaid'>
            <i className='fa fa-plus'/>
            Add w/ Plaid
          </Button>
          <Button to='/app/accounts/add/upload'>
            <i className='fa fa-plus'/>
            Add w/ CSV
          </Button>
        </div>

        {institutions.edges.map((edge)=> (
          <div key={edge.node.id}>
            <div className='heading'>
              <h3>{edge.node.name}</h3>
            </div>
            <AccountList institution={edge.node}/>
          </div>
        ))}
      </div>
    );
  }
}