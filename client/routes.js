
import { Route, IndexRedirect, browserHistory } from 'react-router';
import Relay from 'react-relay';
import { RelayRouter } from 'react-router-relay';

import Dashboard from 'views/dashboard';
import Accounts from 'views/accounts';
import AddAccount from 'views/add-account';
import CreateGoal from 'views/create-goal';
import CreateBucket from 'views/create-bucket';
import CreateExternalAccount from 'views/create-external-account';
import UpdateBucket from 'views/update-bucket';
import UpdateGoal from 'views/update-goal';
import Bucket from 'views/bucket';
import Goal from 'views/goal';
import Transactions from 'views/transactions';
import OnboardingAddAccount from 'views/onboarding/add-account';
import OnboardingAccounts from 'views/onboarding/accounts';
import OnboardingWalkthrough from 'views/onboarding/walkthrough';
import OnboardingIncomeEstimate from 'views/onboarding/income-estimate';


const rootQuery = { viewer: ()=> Relay.QL`query { viewer }` };

export default (
  <RelayRouter
    history={browserHistory}
    renderFetched={()=> setTimeout(window.scrollTo.bind(window, 0, 0), 10)}
    forceFetch={true}
  >
    <Route path='onboarding'>
      <IndexRedirect to='connect'/>

      <Route path='connect' component={OnboardingAddAccount} queries={rootQuery}/>
      <Route path='accounts' component={OnboardingAccounts} queries={rootQuery}/>
      <Route path='walkthrough' component={OnboardingWalkthrough} queries={rootQuery}/>
      <Route path='income' component={OnboardingIncomeEstimate} queries={rootQuery}/>
    </Route>

    <Route path='app'>
      <IndexRedirect to='dashboard'/>

      <Route path='dashboard' component={Dashboard} queries={rootQuery}/>
      <Route path='dashboard/:year/:month' component={Dashboard} queries={rootQuery}/>

      <Route path='goals/new' component={CreateGoal} queries={rootQuery}/>
      <Route path='goals/:id' component={Goal} queries={rootQuery}/>
      <Route path='goals/:id/edit' component={UpdateGoal} queries={rootQuery}/>

      <Route path='labels/new/:type' component={CreateBucket} queries={rootQuery}/>
      <Route path='labels/new' component={CreateBucket} queries={rootQuery}/>
      <Route path='labels/:id' component={Bucket} queries={rootQuery}/>
      <Route path='labels/:id/edit' component={UpdateBucket} queries={rootQuery}/>

      <Route path='accounts' component={Accounts} queries={rootQuery}/>
      <Route path='accounts/new' component={AddAccount} queries={rootQuery}/>
      <Route path='accounts/new/external' component={CreateExternalAccount} queries={rootQuery}/>
      <Route path='accounts/:accountId' component={Accounts} queries={rootQuery}/>

      <Route path='transactions' component={Transactions} queries={rootQuery}/>
    </Route>
  </RelayRouter>
);
