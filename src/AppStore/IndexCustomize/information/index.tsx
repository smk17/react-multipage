import React from 'react';
import axios from 'axios';
import 'es6-set/implement';
import 'es6-map/implement';
import ReactDOM from 'react-dom';
import 'lib-flexible';
// import './index.less';
import App from './App';
import { Service } from "@/common/Service";
import BetterJs from "@/common/BetterJs";
import YdyScrollView from "@/components/YdyScrollView";
import registerServiceWorker from '@/registerServiceWorker';

window.baseConfig = {
  "host": "http://fly3c.wicp.net:20000",
  "development": false
}
axios.get<BaseConfig>('/config.json').then(res => {
  window.baseConfig = res.data;
  if (!window.baseConfig.development) {
    BetterJs.init({
      sendError: (error) => {
        Service.writeLog(error)
      }
    })
  }
  ReactDOM.render((<YdyScrollView><App /></YdyScrollView>), document.getElementById('root'));
})
registerServiceWorker();
