import axios from 'axios';

export class DingTalk {
  /** 初始化钉钉容器，配置jsApiList方可有权限使用其中的API */
  static init () {
    if (!(window.dd.version === null) && window.location.search.length > 0 ) {
      let corpid =  window.location.search;
      corpid = corpid.substring(1).split('&', 1)[0];
      corpid = corpid.split('=')[1];
      let url = 'http://dd.smk17.cn/getConfig.php?corpid=' + corpid;
      url += '&url=' + encodeURIComponent(window.location.href.split('#')[0]);
      axios.get(url).then(res => {
        res.data['jsApiList'] = [ 'runtime.info', 'biz.contact.choose', 'biz.util.uploadImage',
            'device.notification.confirm', 'device.notification.alert',
            'device.notification.prompt', 'biz.ding.post', 'biz.util.scanCard',
            'biz.util.openLink' ]
        window.dd.config(res.data);
        window.dd.error(error => {
          // this.development && console.log(error);
          window.baseConfig.development && alert('dd error: ' + JSON.stringify(error));
        });
      })
    }
  }
  /**
   * 打开一个外部链接
   * @param {string} url 外部链接
   */
  static openLink (url) {
    if (!(window.dd.version === null)) {
      window.dd.ready(() => {
        window.dd.biz.util.openLink({
            url: url,//要打开链接的地址
            onSuccess : result => {
              this.development && console.log(result)
              
            },
            onFail : err => {
              // window.location = url
              this.development &&  console.log(err)
            }
        });
      });
    } else {
      window.location = url
    }
  }
  /**
   * 打开应用内页面
   * @param {string} url 内部页面名称
   * @param {string} params 需要传递的参数，格式：&id=1&userid=10000
   */
  static open (url, params = '') {
    DingTalk.openLink(`${window.location.origin}/${url}.html${window.location.search}${params}`)
  }
  /**
   * 设置当前页面的标题
   * @param {string} title 
   */
  static setTitle (title) {
    if (!(window.dd.version === null)) {
      window.dd.ready(() => {
        window.dd.biz.navigation.setTitle({
          title : title, 
          onSuccess : function(result) {
          },
          onFail : function(err) {}
        });
      })
    } else {
      document.title = title
      var iframe = document.createElement('iframe');
      iframe.style.visibility = 'hidden';
      iframe.style.width = '1px';
      iframe.style.height = '1px';
      iframe.onload = function () {
          setTimeout(function () {
              document.body.removeChild(iframe);
          }, 0);
      };
      document.body.appendChild(iframe);
    }
  }
}