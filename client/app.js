
import 'sass/app';
import 'utils/moment-as-utc';

import { render } from 'react-dom';
import Relay from 'react-relay';
import { Provider } from 'react-redux';

import store from 'store';
import networkLayer from 'utils/network-layer';
import routes from 'app-routes';


Relay.injectNetworkLayer(networkLayer);


window.onload = ()=> render(
  <Provider store={store}>{routes}</Provider>,
  document.getElementById('root'),
);
