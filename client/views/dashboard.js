
import { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import moment from 'moment';

import Card from 'components/card';
import CardList from 'components/card-list';
import Button from 'components/button';
import Money from 'components/money';
import GoalMonth from 'components/goal-month';
import BucketMonth from 'components/bucket-month';
import SpentFromSavings from 'components/spent-from-savings';
import TransactionList from 'components/transaction-list';
import ScrollTrigger from 'components/scroll-trigger';

import { AssignTransactionsMutation } from 'mutations/buckets';

import styles from 'sass/views/dashboard.scss';


class Dashboard extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
  };

  constructor() {
    super();
    this.state = {};
  }

  syncBuckets(month) {
    const { viewer } = this.props;
    Relay.Store.commitUpdate(new AssignTransactionsMutation({ viewer, month }), {
      onSuccess: ()=> console.log('AssignTransactionsMutation Success'),
      onFailure: ()=> console.log('AssignTransactionsMutation Failure'),
    });
  }

  select(id) {
    const { selected } = this.state;

    if (selected === id)
      this.setState({ selected: null });
    else
      this.setState({ selected: id });
  }

  loadTransactions() {
    const { relay } = this.props;
    const { transactionCount } = relay.variables;

    relay.setVariables({ transactionCount: transactionCount + 20 });
  }

  render() {
    if (!this.props.viewer.summary) {
      console.log('fuck this shit', this.props);
      return <div className='container'>No Summary</div>;
    }

    const { params: { year, month }, viewer: { summary } } = this.props;
    const {
      income,
      allocated,
      spent,
      net,
      goalMonths,
      bucketMonths,
      transactions,
    } = summary;

    const { selected } = this.state;

    const now = moment().startOf('month');
    const current = year && month ? moment(`${year}-${month}-0`) : now;
    const periods = {
      now,
      current,
      previous: current.clone().subtract(1, 'month'),
      next: current.clone().add(1, 'month'),
    };

    return (
      <ScrollTrigger
        className={`container ${styles.root}`}
        onTrigger={::this.loadTransactions}
      >
        <Card className='month'>
          <Button to={`/app/dashboard/${periods.previous.format('YYYY/MM')}`}>
            <i className='fa fa-backward'/>
          </Button>

          <div className='current'>{periods.current.format('MMMM YYYY')}</div>

          <Button
            to={`/app/dashboard/${periods.next.format('YYYY/MM')}`}
            disabled={periods.next.isAfter(periods.now)}
          >
            <i className='fa fa-forward'/>
          </Button>
        </Card>

        <Card className='status'>
          <div className='number'>
            In
            <div className='amount'><Money amount={income}/></div>
          </div>
          <div className='number'>
            Out
            <div className='amount'><Money amount={spent + allocated} abs={true}/></div>
          </div>
          <div className='number'>
            Net
            <div className='amount'><Money amount={net}/></div>
          </div>
        </Card>

        <div className='heading'>
          <h2>Goals</h2>
          <div>
            <Button to='/app/goals/new' raised>
              <i className='fa fa-plus'/>
              {' New'}
            </Button>
          </div>
        </div>

        <CardList>
          <Card className='card-list-headings'>
            <div></div>
            <div className='amount'>Target</div>
            <div className='amount'>Saved</div>
          </Card>

          {goalMonths.edges.map(({ node })=>
            <GoalMonth
              key={node.id}
              goalMonth={node}
              month={periods.current}
              selected={selected === node.id}
              onClick={this.select.bind(this, node.id)}
            >
              <Button to={`/app/goals/${node.id}`}>Edit</Button>
            </GoalMonth>
          )}
        </CardList>

        <CardList>
          <SpentFromSavings
            summary={summary}
            month={periods.current}
            selected={selected === 'spentFromSavings'}
            onClick={this.select.bind(this, 'spentFromSavings')}
          />
        </CardList>

        <div className='heading'>
          <h2>Bills</h2>
          <div>
            <Button to='/app/bills/new' raised>
              <i className='fa fa-plus'/>
              {' New'}
            </Button>
          </div>
        </div>

        <div className='heading'>
          <h2>Expenses</h2>
          <div>
            <Button raised onClick={this.syncBuckets.bind(this, periods.current)}>
              <i className='fa fa-refresh'/>
            </Button>
            <Button to='/app/buckets/new' raised>
              <i className='fa fa-plus'/>
              {' New'}
            </Button>
          </div>
        </div>

        <CardList>
          <Card className='card-list-headings'>
            <div></div>
            <div className='amount'>Average</div>
            <div className='amount'>Spent</div>
          </Card>
          {bucketMonths.edges.map(({ node })=>
            <BucketMonth
              key={node.id}
              bucketMonth={node}
              month={periods.current}
              selected={selected === node.id}
              onClick={this.select.bind(this, node.id)}
            >
              <Button to={`/app/buckets/${node.bucket.id}`}>Edit</Button>
            </BucketMonth>
          )}
        </CardList>
        <CardList>
          {spent !== 0 ?
            <Card className='card-list-headings'>
              <div>All Expenses</div>
              <div className='amount'>
                <Money amount={spent} abs/>
              </div>
            </Card>
          : null}

          <TransactionList transactions={transactions} monthHeaders={false}/>

          {transactions && transactions.pageInfo.hasNextPage ?
            <div className='bottom-load-button'>
              <Button onClick={::this.loadTransactions}>Load More</Button>
            </div>
          : null}
        </CardList>
      </ScrollTrigger>
    );
  }
}

const now = moment();

Dashboard = Relay.createContainer(Dashboard, {
  initialVariables: {
    month: now.format('MM'),
    year: now.format('YYYY'),
    transactionCount: 20,
  },
  prepareVariables: (variables)=> {
    if (variables.year && variables.month)
      return { ...variables, date: `${variables.year}/${variables.month}` };
    else
      return variables;
  },
  fragments: {
    viewer: ()=> Relay.QL`
      fragment on Viewer {
        ${AssignTransactionsMutation.getFragment('viewer')}
        summary(month: $date) {
          ${SpentFromSavings.getFragment('summary')}
          income
          allocated
          spent
          net
          goalMonths(first: 1000) {
            edges {
              node {
                ${GoalMonth.getFragment('goalMonth')}
                id
              }
            }
          }
          bucketMonths(first: 1000) {
            edges {
              node {
                ${BucketMonth.getFragment('bucketMonth')}
                id
                bucket {
                  id
                }
              }
            }
          }
          transactions(first: $transactionCount, amountLt: 0) {
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
