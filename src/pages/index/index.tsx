import * as React from 'react';
import axios from 'axios';
import * as ReactDOM from 'react-dom';
import './index.less';
import App from './App';
import registerServiceWorker from '@/registerServiceWorker';

window.baseConfig = {
  "host": "http://192.168.0.188:8003",
  "development": false
}
axios.get('/config.json').then(res => {
  window.baseConfig = res.data;
  ReactDOM.render((<App />), document.getElementById('root'));
})
registerServiceWorker();
