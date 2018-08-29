import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SSO } from './ui/containers/SSO';
import registerServiceWorker from './registerServiceWorker';

import { createStore } from 'redux';
import { rootReducer } from './reducers/index';
import { StoreState } from './types/index';
import { Provider } from 'react-redux'
// import { SSOActions } from './actions';

const initialState: StoreState = {
  qrCode: '',
  errorMsg: '',
  status: '',
  open: false,
  isFetching: false,
  responseToken: '',
  clientId: '',
  userData: []
}

const store = createStore(
  rootReducer, 
  initialState
);

ReactDOM.render(
  <Provider store={store}>
    <SSO/>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
