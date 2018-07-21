import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import './index.less';
import App from '@/pages/index/Components/DataEntry/Picker/App';
import YdyScrollView from "@/components/YdyScrollView";
import registerServiceWorker from '@/registerServiceWorker';

window.baseConfig = {
  "host": "http://192.168.0.188:8003",
  "development": false
}
axios.get('/config.json').then(res => {
  window.baseConfig = res.data;
  ReactDOM.render((<YdyScrollView><App /></YdyScrollView>), document.getElementById('root'));
})
registerServiceWorker();
