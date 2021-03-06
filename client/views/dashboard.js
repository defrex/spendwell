import _ from 'lodash'
import { Component, PropTypes } from 'react'
import Relay from 'react-relay'
import moment from 'moment'

import Card from 'components/card'
import CardList from 'components/card-list'
import Money from 'components/money'
import GoalMonth from 'components/goal-month'
import LabelMonth from 'components/label-month'
import BillMonth from 'components/bill-month'
import SpentFromSavings from 'components/spent-from-savings'
import TransactionList from 'components/transaction-list'
import App from 'components/app'
import DashboardSummary from 'components/dashboard-summary'
import ListHeading from 'components/list-heading'
import PrimaryFab from 'components/primary-fab'
import Icon from 'components/icon'
import CreateBucketSheet from 'components/create-bucket-sheet'
import Button from 'components/button'

import { SettingsMutation } from 'mutations/users'

import styles from 'sass/views/dashboard.scss'


class Dashboard extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    relay: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired,
  };

  state = {
    selected: null,
    createLabel: false,
    createBill: false,
    createGoal: false,
  };

  select (id) {
    const { selected } = this.state

    if (selected === id) {
      this.setState({ selected: null })
    } else {
      this.setState({ selected: id })
    }
  }

  loadTransactions () {
    const { relay } = this.props
    const { transactionCount } = relay.variables

    relay.setVariables({ transactionCount: transactionCount + 20 })
  }

  render () {
    const { params: { year, month }, viewer, relay } = this.props
    const { selected, createLabel, createBill, createGoal } = this.state

    const now = moment().startOf('month')
    const current = year && month ? moment(`${year}-${month}-01`, 'YYYY-MM-DD') : now
    const first = moment(viewer.firstMonth, 'YYYY/MM')
    const periods = {
      first,
      now,
      current,
      previous: current.clone().subtract(1, 'month'),
      next: current.clone().add(1, 'month'),
    }

    const goalMonths = _.sortBy(
      viewer.summary.bucketMonths.edges
        .map(({ node }) => node)
        .filter(({ bucket }) => bucket.type === 'goal'),
      (bm) => bm.bucket.name.toLowerCase()
    )
    const billMonths = _.sortBy(
      viewer.summary.bucketMonths.edges
        .map(({ node }) => node)
        .filter(({ bucket }) => bucket.type === 'bill'),
      (bm) => bm.bucket.name.toLowerCase()
    )
    const labelMonths = _.sortBy(
      viewer.summary.bucketMonths.edges
        .map(({ node }) => node)
        .filter(({ bucket }) => bucket.type === 'expense'),
      (bm) => bm.bucket.name.toLowerCase()
    )

    const goalTargetTotal = _.sum(goalMonths, 'targetAmount')

    const billAvgTotal = _.sum(billMonths, 'avgAmount')
    const billTotal = _.sum(billMonths, 'amount')

    const bucketAvgTotal = _.sum(labelMonths, 'avgAmount')
    const bucketTotal = _.sum(labelMonths, 'amount')

    return (
      <App
        viewer={viewer}
        title='Dashboard'
        className={styles.root}
        onForceFetch={relay.forceFetch}
      >
        <DashboardSummary
          viewer={viewer}
          summary={viewer.summary}
          periods={periods}
        />

        <CardList className='month-list'>
          <ListHeading>
            Goals <small> for long and short term savings</small>
          </ListHeading>

          {goalMonths.length > 0 ? goalMonths.map((node) =>
            <GoalMonth
              key={node.id}
              viewer={viewer}
              bucketMonth={node}
              expanded={selected === node.id}
              onClick={this.select.bind(this, node.id)}
              onForceFetch={() => relay.forceFetch()}
              className='month'
            />
          ) : null}

          {goalMonths.length > 0 ?
            <Card className='card-list-heading'>
              <div><strong>Total</strong></div>
              <div className='amount'>
                <Money amount={goalTargetTotal} abs={true}/>
              </div>
            </Card>
          : null}

          {goalMonths.length === 0 ?
            <div className='month-placeholder'>
              <div className='placeholder-icon goal'>
                <Icon type='show chart' color='light'/>
              </div>
              <div className='placeholder-copy'>
                No goals set up yet
              </div>
              <div className='placeholder-cta'>
                <Button onClick={() => this.setState({ createGoal: true })} color='goal'>
                  New Goal
                </Button>
              </div>
            </div>
          : null}
        </CardList>

        <CardList className='month-list'>
          <ListHeading>
            Bills <small> for monthly recurring expenses</small>
          </ListHeading>

          {billMonths.length > 0 ?
            <Card className='card-list-heading'>
              <div></div>
              <div className='amount'>Average</div>
              <div className='amount'>Spent</div>
            </Card>
          : null}

          {billMonths.length > 0 ? billMonths.map((node) =>
            <BillMonth
              key={node.id}
              viewer={viewer}
              bucketMonth={node}
              month={periods.current}
              expanded={selected === node.id}
              onClick={this.select.bind(this, node.id)}
              className='month'
              onForceFetch={() => relay.forceFetch()}
            />
          ) : null}

          {billMonths.length > 0 ?
            <Card className='card-list-heading'>
              <div><strong>Total</strong></div>
              <div className='amount avg'>
                <Money amount={billAvgTotal} abs={true}/>
              </div>
              <div className='amount'>
                <Money amount={billTotal} abs={true}/>
              </div>
            </Card>
          : null}

          {billMonths.length === 0 ?
            <div className='month-placeholder'>
              <div className='placeholder-icon bill'>
                <Icon type='receipt' color='light'/>
              </div>
              <div className='placeholder-copy'>
                No bills set up yet
              </div>
              <div className='placeholder-cta'>
                <Button onClick={() => this.setState({ createBill: true })} color='bill'>
                  New Bill
                </Button>
              </div>
            </div>
          : null}
        </CardList>

        <CardList className='month-list'>
          <ListHeading>
            Labels <small> for tracking spending</small>
          </ListHeading>

          {labelMonths.length > 0 ?
            <Card className='card-list-heading'>
              <div></div>
              <div className='amount'>Average</div>
              <div className='amount'>Spent</div>
            </Card>
          : null}

          {labelMonths.length > 0 ? labelMonths.map((node) =>
            <LabelMonth
              key={node.id}
              viewer={viewer}
              bucketMonth={node}
              month={periods.current}
              expanded={selected === node.id}
              onClick={this.select.bind(this, node.id)}
              className='month'
              onForceFetch={() => relay.forceFetch()}
            />
          ) : null}

          {labelMonths.length > 0 ?
            <Card className='card-list-heading'>
              <div><strong>Total</strong></div>
              <div className='amount avg'>
                <Money amount={bucketAvgTotal} abs={true}/>
              </div>
              <div className='amount'>
                <Money amount={bucketTotal} abs={true}/>
              </div>
            </Card>
          : null}

          {labelMonths.length === 0 ?
            <div className='month-placeholder'>
              <div className='placeholder-icon label'>
                <Icon type='local offer' color='light'/>
              </div>
              <div className='placeholder-copy'>
                No labels set up yet
              </div>
              <div className='placeholder-cta'>
                <Button onClick={() => this.setState({ createLabel: true })} color='label'>
                  New Label
                </Button>
              </div>
            </div>
          : null}
        </CardList>

        <PrimaryFab actions={[
          {
            label: 'New Goal',
            className: 'goal-fab',
            icon: <Icon type='show chart' color='light'/>,
            onClick: () => this.setState({ createGoal: true }),
          },
          {
            label: 'New Bill',
            className: 'bill-fab',
            icon: <Icon type='receipt' color='light'/>,
            onClick: () => this.setState({ createBill: true }),
          },
          {
            default: true,
            label: 'New Label',
            className: 'label-fab',
            icon: <Icon type='local offer' color='light'/>,
            onClick: () => this.setState({ createLabel: true }),
          },
        ]}/>

        <CreateBucketSheet
          visible={createLabel}
          onRequestClose={() => this.setState({ createLabel: false })}
          onComplete={() => relay.forceFetch()}
          type='expense'
          viewer={viewer}
        />

        <CreateBucketSheet
          visible={createBill}
          onRequestClose={() => this.setState({ createBill: false })}
          onComplete={() => relay.forceFetch()}
          type='bill'
          viewer={viewer}
        />

        <CreateBucketSheet
          visible={createGoal}
          onRequestClose={() => this.setState({ createGoal: false })}
          onComplete={() => relay.forceFetch()}
          type='goal'
          viewer={viewer}
        />
      </App>
    )
  }
}

const now = moment()

Dashboard = Relay.createContainer(Dashboard, {
  initialVariables: {
    month: now.format('MM'),
    year: now.format('YYYY'),
    date: now.format('MM/YYYY'),
  },
  prepareVariables: (variables) => {
    if (variables.year && variables.month) {
      return { ...variables, date: `${variables.year}/${variables.month}` }
    } else {
      return variables
    }
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        ${App.getFragment('viewer')}
        ${DashboardSummary.getFragment('viewer')}
        ${TransactionList.getFragment('viewer')}
        ${SpentFromSavings.getFragment('viewer')}
        ${GoalMonth.getFragment('viewer')}
        ${LabelMonth.getFragment('viewer')}
        ${BillMonth.getFragment('viewer')}
        ${SettingsMutation.getFragment('viewer')}
        ${CreateBucketSheet.getFragment('viewer')}

        firstMonth

        summary(month: $date) {
          ${SpentFromSavings.getFragment('summary')}
          ${DashboardSummary.getFragment('summary')}

          bucketMonths(first: 1000) {
            edges {
              node {
                ${LabelMonth.getFragment('bucketMonth')}
                ${BillMonth.getFragment('bucketMonth')}
                ${GoalMonth.getFragment('bucketMonth')}

                id
                amount
                avgAmount
                targetAmount

                bucket {
                  id
                  name
                  type
                }
              }
            }
          }

          incomeTransactions: transactions(first: 100, amountGt: 0) {
            ${TransactionList.getFragment('transactions')}
          }
        }
      }
    `,
  },
})

export default Dashboard
