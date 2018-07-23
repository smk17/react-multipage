import HttpService from '@/common/HttpService';
import { ContractReceivablesListParams, ContractReceivablesListResult, ContractReceivablesInfo } from './statement';

export default class ContractService {
  /** 获取合同负责人列表 */
  static getPrincipalList () {
    return HttpService.getPageData<{username: string, id: string}[]>({
      id: '负责人',
      pageAddress: { pageMode: 0, pageId: 'Main', moduleId: 'OwnedAnalysis', systemId: 'ContractManage' },
      mode: 1,
    })
  }

  /** 获取合同回款列表和相关信息 */
  static async getContractReceivablesList (params: ContractReceivablesListParams) {
    let filter: any[] = []
    if (params.beginDate || params.endDate) {
      filter.push({ dataType: 3, left: 'date', op: 0, title: '应收日期', type: 'scope', right: `${params.beginDate}|${params.endDate}`})
    }
    params.userId && filter.push({ dataType: 6, left: 'userId', op: 1, title: '款项负责人', right: params.userId })
    let totalData = await HttpService.getPageData<{total: number}>({
      id: '回款总数',
      pageAddress: { pageMode: 0, pageId: 'Main', moduleId: 'OwnedAnalysis', systemId: 'ContractManage' },
      mode: 0,
      attachParams: {
        filter: {
          type: 1,
          expressions: filter
        }
      }
    })
    let uncollectedData = await HttpService.getPageData<{uncollected: number}>({
      id: '回款全额',
      pageAddress: { pageMode: 0, pageId: 'Main', moduleId: 'OwnedAnalysis', systemId: 'ContractManage' },
      mode: 0,
      attachParams: {
        filter: {
          type: 1,
          expressions: filter
        }
      }
    })
    let listData = await HttpService.getPageData<ContractReceivablesListResult>({
      id: '回款列表',
      pageAddress: { pageMode: 0, pageId: 'Main', moduleId: 'OwnedAnalysis', systemId: 'ContractManage' },
      mode: 2,
      attachParams: {
        pageSize: 10,
        pageIndex: params.pageIndex,
        orderby: { name: 'agingd', sortType: 2 },
        filter: {
          type: 1,
          expressions: filter
        }
      }
    })
    return {
      /** 超过60天账龄款项数 */
      total: totalData.total,
      /** 本期应收未收金额 */
      uncollected: uncollectedData.uncollected,
      /** 合同回款列表 */
      list: listData.data
    }
  }

  static getContractReceivablesDetails (id: string) {
    return HttpService.getPageData<ContractReceivablesInfo>({
      id: '回款表单',
      pageAddress: { pageMode: 0, pageId: 'Owned', moduleId: 'OwnedAnalysis', systemId: 'ContractManage' },
      mode: 0,
      attachParams: { _param_0: id }
    })
  }

  static saveContractReceivables (params) {
    return HttpService.getPageData<ContractReceivablesInfo>({
      id: '回款表单',
      pageAddress: { pageMode: 0, pageId: 'Owned', moduleId: 'OwnedAnalysis', systemId: 'ContractManage' },
      mode: 0,
    })
  }
}