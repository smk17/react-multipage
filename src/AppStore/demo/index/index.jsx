import React from 'react';
import axios from 'axios';
import 'es6-set/implement'; import 'es6-map/implement'; import ReactDOM from 'react-dom';
import './index.less';
import App from './App';
import { Service } from "@/common/Service";
import BetterJs from "@/common/BetterJs";
import YdyScrollView from "@/components/YdyScrollView";
import registerServiceWorker from '@/registerServiceWorker';

window.baseConfig = {
  "host": "http://fly3c.wicp.net:20000",
  "development": false
}
BetterJs.init({
  sendError: function(error) {
    Service.writeLog(error)
  }
})
axios.get('/config.json').then(res => {
  window.baseConfig = res.data;
  ReactDOM.render((<YdyScrollView><App /></YdyScrollView>), document.getElementById('root'));
})
registerServiceWorker();
