
import { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import moment from 'moment';

import CardList from 'components/card-list';
import Button from 'components/button';
import TransactionList from 'components/transaction-list';
import ScrollTrigger from 'components/scroll-trigger';
import App from 'components/app';
import MonthSelector from 'components/month-selector';

import styles from 'sass/views/dashboard.scss';


class Dashboard extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
  };

  loadTransactions() {
    const { relay } = this.props;
    const { transactionCount } = relay.variables;

    relay.setVariables({ transactionCount: transactionCount + 20 });
  }

  render() {
    const { viewer, relay } = this.props;

    return (
      <App viewer={viewer}>
        <ScrollTrigger
          className={`container ${styles.root}`}
          onTrigger={::this.loadTransactions}
        >
          <MonthSelector
            month={relay.variables.month}
            first={moment(viewer.firstMonth, 'YYYY/MM')}
            onChange={(m)=> relay.setVariables({ month: m })}
          />

          <div className='heading'>
            <h2>All Transactions</h2>
          </div>

          <CardList>
            <TransactionList
              viewer={viewer}
              transactions={viewer.summary.transactions}
              abs={true}
            />

            {viewer.summary.transactions && viewer.summary.transactions.pageInfo.hasNextPage ?
              <div className='bottom-buttons'>
                <Button onClick={::this.loadTransactions} flat>Load More</Button>
              </div>
            : null}
          </CardList>
        </ScrollTrigger>
      </App>
    );
  }
}

Dashboard = Relay.createContainer(Dashboard, {
  initialVariables: {
    month: moment().startOf('month'),
    transactionCount: 20,
  },
  prepareVariables: (variables)=> {
    return {
      ...variables,
      date: variables.month.format('YYYY/MM'),
    };
  },
  fragments: {
    viewer: ()=> Relay.QL`
      fragment on Viewer {
        ${App.getFragment('viewer')}
        ${TransactionList.getFragment('viewer')}

        firstMonth

        summary(month: $date) {
          transactions: transactions(first: $transactionCount, amountLt: 0) {
            ${TransactionList.getFragment('transactions')}

            pageInfo {
              hasNextPage
            }
          }
        }
      }
    `,
  },
});

export default Dashboard;
