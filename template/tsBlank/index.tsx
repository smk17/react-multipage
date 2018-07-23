import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
// import './index.less';
import App from './App';
import { Service } from "@/common/Service";
import BetterJs from "@/common/BetterJs";
import YdyScrollView from "@/components/YdyScrollView";
import registerServiceWorker from '@/registerServiceWorker';

window.baseConfig = {
  "host": "http://192.168.0.188:8003",
  "development": false
}
axios.get('/config.json').then(res => {
  window.baseConfig = res.data;
  if (!window.baseConfig.development) {
    BetterJs.init({
      sendError: (error) => {
        Service.writeLog(JSON.stringify(error))
      }
    })
  }
  ReactDOM.render((<YdyScrollView><App /></YdyScrollView>), document.getElementById('root'));
})
registerServiceWorker();
