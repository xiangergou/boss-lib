export const defaultServerUri = {
  upload: {
    serverUri: 'fileservice/v2/upload',
    ajaxType: 'post'
  },
  uploads: {
    serverUri: 'fileservice/v2/uploads',
    ajaxType: 'post'
  },
  delete: {
    serverUri: 'fileservice/v2/files',
    ajaxType: 'del'
  },
  download: {
    serverUri: 'fileservice/v2/stream/download',
    ajaxType: 'downLoad'
  },
  downloa2: {
    serverUri: 'fileservice/v2/resource/download',
    ajaxType: 'downLoad'
  },
  fileExist: {
    serverUri: 'fileservice/v2/find/fileExists',
    ajaxType: 'get'
  },
  list: {
    serverUri: 'fileservice/v2/files',
    ajaxType: 'get'
  }
}
