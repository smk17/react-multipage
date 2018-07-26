import React from 'react';
import ReactDOM from "react-dom";
import { ListView, PullToRefresh } from 'antd-mobile';
import './index.less'

interface YdyListViewPropTypes {
  renderHeader: JSX.Element
  ListRow: (rowData, sectionID, rowID, highlightRow) => JSX.Element,
  /** 数据是否全部加载 */
  hasMore: boolean,
  height: number,
  onScroll: (lv: Element) => void,
  data: any[]
  initList: (pageIndex: number) => Promise<{pageIndex: number}>
}

interface YdyListViewStateTypes {
  /** 数据加载是否完成 */
  isLoading: boolean,
  /** 下拉刷新是否完成 */
  refreshing: boolean,
  /** 数据源 */
  dataSource: any,
}

class YdyListView extends React.Component<YdyListViewPropTypes, YdyListViewStateTypes> {
  /** 列表实例 */
  private _lv: ListView | null = null
  private _pageIndex: number = 0

  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      refreshing: false,
      isLoading: false,
      dataSource
    };
  }

  componentWillReceiveProps (props: YdyListViewPropTypes) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(props.data)
    });
  }

  initList (pageIndex: number) {
    this.props.initList(pageIndex).then(res => {
      this._pageIndex = res.pageIndex
      this.setState({
        refreshing: false,
        isLoading: false,
      });
    });
  }

  /** 下拉刷新 */
  onRefresh = () => {
    this.setState({ refreshing: true, isLoading: true });
    this.initList(0)
  };

  /** 上拉加载更多 */
  onEndReached(event) {
    if (this.state.isLoading && !this.props.hasMore) {
      return;
    }
    this.setState({ isLoading: true });
    this._pageIndex++
    this.initList(this._pageIndex)
  }

  onScroll = (event) => {
    if (this._lv) {
      let lv: Element = ReactDOM.findDOMNode(this._lv) as Element;
      this.props.onScroll(lv)
    }
  }

  render () {
    return (
      <ListView ref={ el => this._lv = el }
          dataSource={this.state.dataSource}
          renderHeader={() => { return this.props.renderHeader }}
          renderFooter={() => (<div style={{ padding: 10, textAlign: 'center' }}>
            {this.state.isLoading ? '加载中...' : ( this.props.hasMore ? '加载完成' : '没有更多数据了' )}
          </div>)}
          renderRow={this.props.ListRow}
          style={{
            height: this.props.height,
            overflow: 'auto',
          }}
          pageSize={4}
          scrollRenderAheadDistance={500}
          onScroll={this.onScroll.bind(this)}
          pullToRefresh={
            <PullToRefresh
              indicator={{
                // activate: <div>activate</div>,
                // deactivate: <div>deactivate</div>,
                release: <div>加载中...</div>,
                // finish: <div>finish</div>,
              }}
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
          onEndReached={this.onEndReached.bind(this)}
          onEndReachedThreshold={10}
        />
    );
  }
}

export default YdyListView;