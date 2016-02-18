
import { Component } from 'react';
import Relay from 'react-relay';

import Card from 'components/card';
import CardList from 'components/card-list';
import Button from 'components/button';
import TransactionList from 'components/transaction-list';
import ScrollTrigger from 'components/scroll-trigger';
import Checkbox from 'components/checkbox';

import styles from 'sass/views/bucket.scss';


class AllTransactions extends Component {
  handleScroll() {
    this.props.relay.setVariables({ count: this.props.relay.variables.count + 50 });
  }

  handleOutgoingChange(checked) {
    this.props.relay.setVariables({
      amountGt: checked ? null : 0,
    });
  }

  handleIncomingChange(checked) {
    this.props.relay.setVariables({
      amountLt: checked ? null : 0,
    });
  }

  handleFromSavingsChange(checked) {
    this.props.relay.setVariables({
      fromSavings: checked ? null : false,
    });
  }

  handleTransfersChange(checked) {
    this.props.relay.setVariables({
      isTransfer: checked ? null : false,
    });
  }


  render() {
    const { viewer } = this.props;
    const { amountGt, amountLt, fromSavings, isTransfer } = this.props.relay.variables;
    return (
      <ScrollTrigger
        className={`container ${styles.root}`}
        onTrigger={::this.handleScroll}
      >
        <div className='heading'>
          <Button to='/app/' className='back'>
            <i className='fa fa-long-arrow-left'/>
          </Button>

          <h1>All Transactions</h1>
        </div>

        <CardList>
          <Card>
            <Checkbox
              label='Outgoing'
              checked={amountGt === null}
              onChange={::this.handleOutgoingChange}
            />
            <Checkbox
              label='Incoming'
              checked={amountLt === null}
              onChange={::this.handleIncomingChange}
            />
            <Checkbox
              label='From Savings'
              checked={fromSavings === null}
              onChange={::this.handleFromSavingsChange}
            />
            <Checkbox
              label='Transfers'
              checked={isTransfer === null}
              onChange={::this.handleTransfersChange}
            />
          </Card>
        </CardList>

        <TransactionList transactions={viewer.transactions} abs={false}/>
      </ScrollTrigger>
    );
  }
}

AllTransactions = Relay.createContainer(AllTransactions, {
  initialVariables: {
    count: 50,
    amountGt: null,
    amountLt: null,
    fromSavings: null,
    isTransfer: null,
  },
  fragments: {
    viewer: ()=> Relay.QL`
      fragment on Viewer {
        transactions(
          first: $count,
          amountGt: $amountGt,
          amountLt: $amountLt,
          fromSavings: $fromSavings,
          isTransfer: $isTransfer,
        ) {
          ${TransactionList.getFragment('transactions')}
        }
      }
    `,
  },
});

export default AllTransactions;
