
import _ from 'lodash';
import { Component, PropTypes } from 'react';
import moment from 'moment';
import Relay from 'react-relay';

import Card from 'components/card';
import CardList from 'components/card-list';
import ListTransaction from 'components/list-transaction';

import styles from 'sass/components/transaction-list';


class TransactionList extends Component {
  static propTypes = {
    monthHeaders: PropTypes.bool,
    expand: PropTypes.bool,
  };

  static defaultProps = {
    monthHeaders: true,
    expand: false,
  };

  constructor() {
    super();
    this.state = {};
  }

  toggleSelect(transaction) {
    const { expanded } = this.state;
    if (expanded === transaction.id)
      this.setState({ expanded: null });
    else
      this.setState({ expanded: transaction.id });
  }

  renderTransaction(transaction) {
    const { expand } = this.props;
    const { expanded } = this.state;

    return <ListTransaction
      key={transaction.id}
      transaction={transaction}
      onClick={this.toggleSelect.bind(this, transaction)}
      expanded={expand && expanded === transaction.id}
    />;
  }

  render() {
    const { transactions, monthHeaders } = this.props;

    if (!monthHeaders)
      return (
        <div>
          {transactions.edges.map(({ node })=> this.renderTransaction(node))}
        </div>
      );

    const monthlyTransactions = transactions.edges.reduce((monthly, { node })=> {
      const monthKey = moment(node.date).format('YYYY/MM');
      if (_.isUndefined(monthly[monthKey]))
        monthly[monthKey] = [];
      monthly[monthKey].push(node);
      return monthly;
    }, {});

    const months = [];

    Object.keys(monthlyTransactions).sort().reverse().forEach((month)=> {
      const transactions = monthlyTransactions[month];
      if (!transactions || transactions.length === 0) return;
      months.push(
        <CardList key={month}>
          <Card className='card-list-headings'>
            {moment(month, 'YYYY/MM').format('MMMM YYYY')}
          </Card>
          {_.sortBy(transactions, (t)=> t.date).reverse().map(::this.renderTransaction)}
        </CardList>
      );
    });

    return (
      <div className={styles.root}>{months}</div>
    );
  }
}

TransactionList = Relay.createContainer(TransactionList, {
  fragments: {
    transactions: ()=> Relay.QL`
      fragment on TransactionNodeDefaultConnection {
        edges {
          node {
            ${ListTransaction.getFragment('transaction')}
            id
            date
          }
        }
      }
    `,
  },
});

export default TransactionList;
