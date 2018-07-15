import React from 'react';
import { DingTalk } from '@/common/dingtalk';
import { Button, WhiteSpace, WingBlank } from 'antd-mobile';
import YdyScrollView from "@/components/YdyScrollView";
import loading from '@/assets/img/load.gif';
import './App.less';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      longitude: 116.38833,
      latitude: 39.92889,
      geolocation: '',
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  componentDidMount () {
    DingTalk.init()
    this.setState({
      load: true,
    })
    DingTalk.setTitle('地图演示');
  }

  getGeoLocation = () => {
    if (!(window.dd.version === null)) {
      window.dd.device.geolocation.get({
        // targetAccuracy : 200, // 期望定位精度半径
        // coordinate : 1, // 1：获取高德坐标， 0：获取标准坐标；
        // withReGeocode : false, // 是否需要带有逆地理编码信息；
        // useCache:true, //默认是true，如果需要频繁获取地理位置，请设置false
        onSuccess : (result) => {
          // alert(JSON.stringify(result));
          if (result.location) {
            this.setState({
              longitude: result.location.longitude,
              latitude: result.location.latitude,
              geolocation: JSON.stringify({ longitude: result.location.longitude,latitude: result.location.latitude })
            })
          } else {
            this.setState({
              longitude: result.longitude,
              latitude: result.latitude,
              geolocation: JSON.stringify({ longitude: result.longitude,latitude: result.latitude })
            })
          }
        },
        onFail : (err) => {
          alert(JSON.stringify(err));
        }
      });
    } else {
      // window.location = url
    }
  }

  startGeoLocation = () => {
    if (!(window.dd.version === null)) {
      window.dd.device.geolocation.start({
        targetAccuracy : 200, // 期望精确度
        iOSDistanceFilter: 200, // 变更感知精度(iOS端参数)
        useCache: false, // 是否使用缓存(Android端参数)
        withRegeocode : false, // 是否返回逆地理信息,默认否
        callBackInterval : 600, //回传时间间隔，ms
        sceneId: 'startGeoLocation', // 定位场景id,
        onSuccess : (result) => {
          // alert(JSON.stringify(result));
          if (result.location) {
            this.setState({
              longitude: result.location.longitude,
              latitude: result.location.latitude,
              geolocation: this.state.geolocation + JSON.stringify({ longitude: result.location.longitude,latitude: result.location.latitude })
            })
          } else {
            this.setState({
              longitude: result.longitude,
              latitude: result.latitude,
              geolocation: this.state.geolocation + JSON.stringify({ longitude: result.longitude,latitude: result.latitude })
            })
          }
        },
        onFail : (err) => {
          alert(JSON.stringify(err));
        }
      });
    } else {
      // window.location = url
    }
  }

  stopGeoLocation = () => {
    if (!(window.dd.version === null)) {
      window.dd.device.geolocation.stop({
        sceneId: 'startGeoLocation', // 需要停止定位场景id
        onSuccess : (result) => {
          alert(JSON.stringify(result));
        },
        onFail : (err) => {
          alert(JSON.stringify(err));
        }
      });
    } else {
      // window.location = url
    }
  }

  statusGeoLocation = () => {
    if (!(window.dd.version === null)) {
      window.dd.device.geolocation.status({
        sceneIds: ['startGeoLocation'], // 需要查询定位场景id列表
        onSuccess : (result) => {
          alert(JSON.stringify(result));
        },
        onFail : (err) => {
          alert(JSON.stringify(err));
        }
      });
    } else {
      // window.location = url
    }
  }

  locate = () => {
    if (!(window.dd.version === null)) {
      window.biz.map.locate({
        latitude: this.state.latitude, // 纬度
        longitude: this.state.longitude, // 经度
        onSuccess : (result) => {
          alert(JSON.stringify(result));
        },
        onFail : (err) => {
          alert(JSON.stringify(err));
        }
      });
    } else {
      // window.location = url
    }
  }

  search = () => {
    if (!(window.dd.version === null)) {
      window.dd.biz.map.search({
        latitude: this.state.latitude, // 纬度
        longitude: this.state.longitude, // 经度
        scope: 500, // 限制搜索POI的范围；设备位置为中心，scope为搜索半径
        onSuccess : (result) => {
          alert(JSON.stringify(result));
        },
        onFail : (err) => {
          alert(JSON.stringify(err));
        }
      });
    } else {
      // window.location = url
    }
  }

  view = () => {
    if (!(window.dd.version === null)) {
      window.dd.biz.map.view({
        latitude: 39.903578, // 纬度
        longitude: 116.473565, // 经度
        title: "北京国家广告产业园" // 地址/POI名称
      });
    } else {
      // window.location = url
    }
  }

  renderContent () {
    return (
      <YdyScrollView>
        <WhiteSpace />
        <span>{ this.state.geolocation }</span><WhiteSpace />
        <WingBlank>
          <Button type="primary" onClick={this.getGeoLocation}>获取当前地理位置</Button><WhiteSpace />
          <Button onClick={this.startGeoLocation}>连续获取当前地理位置信息</Button><WhiteSpace />
          <Button onClick={this.stopGeoLocation}>停止连续定位</Button><WhiteSpace />
          <Button onClick={this.statusGeoLocation}>连续定位状态</Button><WhiteSpace />
          <Button onClick={this.locate}>地图定位</Button><WhiteSpace />
          <Button onClick={this.search}>POI搜索</Button><WhiteSpace />
          <Button onClick={this.view}>展示位置</Button><WhiteSpace />
        </WingBlank>
      </YdyScrollView>
    );
  }
  
  render() {
    const LoadView = (
      <img className="App-loading" src={loading} alt="" />
    );
    return (
      <div className="App" style={{ width: this.state.width + 'px', height: this.state.height + 'px' }}>
        {
          this.state.load ? this.renderContent() : LoadView
        }
      </div>
    );
  }
}

export default App;
