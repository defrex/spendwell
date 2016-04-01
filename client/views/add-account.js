
import { Component } from 'react';
import Relay from 'react-relay';

import ConnectAccount from 'components/connect-account';
import App from 'components/app';

import styles from 'sass/views/add-plaid.scss';


class AddAccountView extends Component {
  render() {
    const { viewer } = this.props;

    return (
      <App viewer={viewer}>
        <div className={`container skinny ${styles.root}`}>
          <h1>Connect Accounts</h1>

          <ConnectAccount viewer={viewer}/>
        </div>
      </App>
    );
  }
}


AddAccountView = Relay.createContainer(AddAccountView, {
  fragments: {
    viewer: ()=> Relay.QL`
      fragment on Viewer {
        ${App.getFragment('viewer')}
        ${ConnectAccount.getFragment('viewer')}
      }
    `,
  },
});

export default AddAccountView;
