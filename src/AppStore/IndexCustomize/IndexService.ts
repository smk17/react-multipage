import HttpService from '@/common/HttpService';
import { IndexCustomizeInfo } from './statement';

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
}

