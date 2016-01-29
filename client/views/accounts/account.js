
import { Component } from 'react';
import { browserHistory } from 'react-router';
import reactMixin from 'react-mixin';
import moment from 'moment';
import Relay from 'react-relay';
import relayContainer from 'relay-decorator';

import Card from 'components/card';
import Button from 'components/button';
import Money from 'components/money'


@relayContainer({
  initialVariables: {
    open: false,
  },
  fragments: {
    account: ()=> Relay.QL`
      fragment on AccountNode {
        id
        name
        transactions(first: 100) @include(if: $open) {
          edges {
            node {
              id
              name
              date
              amount
              category {
                name
              }
            }
          }
        }
      }
    `,
  }
})
export default class Account extends Component {
  toggleOpen() {
    const { open } = this.props.relay.variables;
    this.props.relay.setVariables({ open: !this.props.relay.variables.open });
  }

  render() {
    const { open } = this.props.relay.variables;
    const { selected, account } = this.props;

    return (
      <Card expanded={open} className='account'>
        <div className='summary' onClick={::this.toggleOpen}>
          <div>
            {account.name}
          </div>
          <div>
            {/*${account.balance.current ? account.balance.current : account.balance}*/}
          </div>
        </div>

        {open ? (
          <div>
            <table className='mui-table'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {account.transactions.edges.map((edge)=> (
                  <tr key={edge.node.id}>
                    <td>{edge.node.name}</td>
                    <td>{edge.node.category.name}</td>
                    <td>{moment(edge.node.date).format('LL')}</td>
                    <td><Money amount={edge.node.amount}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Card>
    );
  }
}
