import React from 'react';
import { Map, Marker, Polyline } from 'react-amap';
import { DingTalk } from '@/common/dingtalk';
import { Button, WhiteSpace, WingBlank } from 'antd-mobile';
import YdyScrollView from "@/components/YdyScrollView";
import loading from '@/assets/img/load.gif';
import './App.less';

interface MapUtilsStateTypes extends AppStateTypes {
  longitude: number,
  latitude: number,
  geolocation: { longitude: number, latitude: number }[]
}

class App extends React.Component<any, MapUtilsStateTypes> {
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      longitude: 116.38833,
      latitude: 39.92889,
      geolocation: [],
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  componentDidMount () {
    DingTalk.init().then(() => {
      this.setState({
        load: true,
      })
      DingTalk.setTitle('地图演示');
    })
  }

  getGeoLocation () {
    DingTalk.getGeolocation({
      targetAccuracy : 200,
      coordinate : 1,
      withReGeocode : false,
      useCache: true,
    }).then( result => {
      if (result.location) {
        this.setState({
          longitude: result.location.longitude,
          latitude: result.location.latitude,
          geolocation: [{ longitude: result.location.longitude,latitude: result.location.latitude }]
        })
      } else {
        this.setState({
          longitude: result.longitude,
          latitude: result.latitude,
          geolocation: [{ longitude: result.longitude,latitude: result.latitude }]
        })
      }
    })
  }

  startGeoLocation () {
    DingTalk.startGeolocation({
      targetAccuracy : 200, 
      iOSDistanceFilter: 1,
      useCache: false,
      withReGeocode: false,
      callBackInterval: 600,
      sceneId: 'startGeoLocation',
    }).then( result => {
      const { geolocation } = this.state;
      if (result.location) {
        geolocation.push({ longitude: result.location.longitude,latitude: result.location.latitude })
        this.setState({
          longitude: result.location.longitude,
          latitude: result.location.latitude,
          geolocation: geolocation
        })
      } else {
        geolocation.push({ longitude: result.longitude,latitude: result.latitude })
        this.setState({
          longitude: result.longitude,
          latitude: result.latitude,
          geolocation: geolocation
        })
      }
      DingTalk.setStorageItem({
        name: 'startGeoLocation',
        value: JSON.stringify(geolocation),
      })
    })
  }

  stopGeoLocation () {
    DingTalk.stopGeolocation('startGeoLocation')
  }

  statusGeoLocation () {
    DingTalk.statusGeolocation(['startGeoLocation']).then(result => {
      DingTalk.alert(JSON.stringify(result));
    })
  }

  locate () {
    const { longitude , latitude } = this.state;
    DingTalk.locateMap({ latitude, longitude })
  }

  search () {
    const { longitude , latitude } = this.state;
    DingTalk.searchMap({ latitude, longitude, scope: 500 })
  }

  view () {
    DingTalk.viewMap({
      latitude: 39.903578,
      longitude: 116.473565,
      title: "北京国家广告产业园"
    })
  }

  getItem () {
    if (!(window.dd.version === null)) {
      window.dd.util.domainStorage.getItem({
        name: 'startGeoLocation', // 存储信息的key值
        onSuccess : (info) => {
          DingTalk.alert(JSON.stringify(info));
          const geolocation = JSON.parse(info.value)
          this.setState({
            longitude: geolocation[0].longitude,
            latitude: geolocation[0].latitude,
            geolocation: geolocation
          })
        },
        onFail : function(err) {
          DingTalk.alert(JSON.stringify(err));
        }
      });
    } else {
      // window.location = url
    }
  }

  removeItem () {
    if (!(window.dd.version === null)) {
      window.dd.util.domainStorage.removeItem({
        name: 'startGeoLocation' , // 存储信息的key值
        onSuccess : function(info) {
          DingTalk.alert(JSON.stringify(info));
        },
        onFail : function(err) {
          DingTalk.alert(JSON.stringify(err));
        }
      });
    } else {
      // window.location = url
    }
  }

  renderContent () {
    const { longitude , latitude, geolocation } = this.state;
    return (
      <YdyScrollView>
        <WhiteSpace />
        <div style={ {height: '50%', width: '100%'} }>
          <Map amapkey={'6243b3c2bb174171ca175b10b6f7588f'} center={ { longitude , latitude } }>
          <Polyline path={geolocation} />
          <Marker position={{ longitude , latitude }} />
          { // 地图显示
            // geolocation.map((Item, index) => {
            //   return <Marker key={index} position={Item} />
            // })
          }
          </Map>
        </div>
        <div style={ {height: '30%', width: '100%', display: 'block', overflow: 'scroll'} }>
          <ul >
          { // 数据打印
            this.state.geolocation.map((Item, index) => {
              return (
                <li key={index}>
                  <ul>
                    <li>longitude: {Item.longitude}</li>
                    <li>latitude: {Item.latitude}</li>
                  </ul>
                </li>
              );
            })
          }
          </ul>
        </div>
        <WhiteSpace />
        <WingBlank>
          <Button onClick={this.getItem.bind(this)}>获取上次地理位数据</Button><WhiteSpace />
          <Button type="warning" onClick={this.removeItem.bind(this)}>清理数据</Button><WhiteSpace />
          <Button type="primary" onClick={this.getGeoLocation.bind(this)}>获取当前地理位置</Button><WhiteSpace />
          <Button onClick={this.startGeoLocation.bind(this)}>连续获取当前地理位置信息</Button><WhiteSpace />
          <Button onClick={this.stopGeoLocation.bind(this)}>停止连续定位</Button><WhiteSpace />
          <Button onClick={this.statusGeoLocation.bind(this)}>连续定位状态</Button><WhiteSpace />
          <Button onClick={this.locate.bind(this)}>地图定位</Button><WhiteSpace />
          <Button onClick={this.search.bind(this)}>POI搜索</Button><WhiteSpace />
          <Button onClick={this.view.bind(this)}>展示位置</Button><WhiteSpace />
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
