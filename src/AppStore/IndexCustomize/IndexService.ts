import HttpService from '@/common/HttpService';
import { IndexCustomizeInfo, InformationInfo } from './statement';

export default class IndexService {
  static getData (preview: boolean = false) {
    let params: {versionId?: string} = {}
    if (preview) {
      params.versionId = '00000000000000000000'
    }
    return HttpService.executeController<IndexCustomizeInfo[]>({
      id: 'getData',
      pageAddress: {"pageMode":0,"pageId":"Preview","moduleId":"Main","systemId":"IndexBuilder"},
      params: params
    })
  }

  static getInformation (id: string) {
    return HttpService.executeController<{success: boolean, data: InformationInfo}>({
      id: 'detail',
      pageAddress: {"pageMode":0,"pageId":"Main","moduleId":"Information","systemId":"IndexBuilder"},
      params: {id: id}
    })
  }
}

