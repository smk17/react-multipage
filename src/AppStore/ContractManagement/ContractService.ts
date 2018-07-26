import HttpService from '@/common/HttpService';
import { ContractReceivablesListParams, ContractReceivablesListResult, ContractReceivablesInfo, ContractListParams, ContractListResult, ContractCollectionListResult } from './statement';

export default class ContractService {
  /** 获取合同负责人列表 */
  static getPrincipalList () {
    return HttpService.getPageData<{username: string, id: string}[]>({
      id: '负责人',
      pageAddress: { pageMode: 0, pageId: 'Main', moduleId: 'OwnedAnalysis', systemId: 'ContractManage' },
      mode: 1,
    })
  }

  /** 获取签署公司列表 */
  static getCompanyList () {
    return HttpService.getPageData<{companyName: string, id: string}[]>({
      id: '签署公司',
      pageAddress: { pageMode: 0, pageId: 'Main', moduleId: 'Contract', systemId: 'ContractManage' },
      mode: 1,
    })
  }

  /** 获取合同列表 */
  static getContractList (params: ContractListParams) {
    let filter: any[] = []
    if (params.CompanyId) {
      filter.push({ dataType: 6, left: 'c.signingCompanyId', op: 1, title: '签署公司', type: 'scope', right: params.CompanyId})
    }
    return HttpService.getPageData<ContractListResult>({
      id: '合同列表',
      pageAddress: { pageMode: 0, pageId: 'Main', moduleId: 'Contract', systemId: 'ContractManage' },
      mode: 1,
      attachParams: {
        pageSize: 10,
        pageIndex: params.pageIndex,
        orderby: { name: 'date', sortType: 2 },
        filter: {
          type: 1,
          expressions: filter
        }
      }
    })
  }

  /** 获取合同回款列表 */
  static getContractCollectionList (pageIndex: number) {
    return HttpService.getPageData<ContractCollectionListResult>({
      id: '回款列表',
      pageAddress: { pageMode: 0, pageId: 'Main', moduleId: 'Collection', systemId: 'ContractManage' },
      mode: 2,
      attachParams: {
        pageSize: 10,
        pageIndex: pageIndex,
        orderby: { name: 'date', sortType: 2 },
      }
    })
  }

  /** 获取合同应收款列表和相关信息 */
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

  /**
   * 获取合同应收款详情
   * @param id 合同应收款Id
   */
  static getContractReceivablesDetails (id: string) {
    return HttpService.getPageData<ContractReceivablesInfo>({
      id: '回款表单',
      pageAddress: { pageMode: 0, pageId: 'Owned', moduleId: 'OwnedAnalysis', systemId: 'ContractManage' },
      mode: 0,
      attachParams: { _param_0: id }
    })
  }

  /**
   * 更新合同应收款
   * @param params 需要更新的数据
   * @param isUpdateDccountsDueDate 应收日期是否需要更新，如果需要更新则会更新**`应收日期修改次数`**
   */
  static async saveContractReceivables (params: ContractReceivablesInfo, isUpdateDccountsDueDate) {
    let get = await HttpService.getController<{id?: string, type?: string, params?: object, hasRights?: boolean}>({
      id: 'save',
      pageAddress: { pageMode: 2, pageId: 'Edit', moduleId: 'AccountsDue', systemId: 'ContractManage' }
    })
    console.log(get);
    if (get) {
      params['_dataState'] = 2
      let ids: string[] = []
      let _param_1: {id: string[], editDate: string, _dataState: number}[] = []
      if (isUpdateDccountsDueDate) {
        ids = await HttpService.GetIds()
        _param_1.push({ id: ids, _dataState: 1,editDate: params.predictDccountsDueDate })
      }
      let save = await HttpService.executeController<{id: string}>({
        id: 'save',
        pageAddress: { pageMode: 2, pageId: 'Edit', moduleId: 'AccountsDue', systemId: 'ContractManage' },
        params: {
          _param_0: params,
          _param_1
        }
      })
      console.log(save);
      return save;
    }
    return;
  }
}