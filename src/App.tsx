import * as React from 'react';
import * as ReactDOM from 'react-dom';
import SSO from './SSO';
import './App.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <SSO name="test" />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
