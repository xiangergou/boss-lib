<!--文件上传组件-->
<template>
  <div v-show="isShow" class="bs-file__upload">
    <el-upload
      ref="uploadFile"
      :show-file-list="false"
      :multiple="multiple"
      :limit="limit"
      :accept="accept"
      action=""
      :data="uploadparams"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :on-progress="onProgress"
      :before-upload="onbeforeUpload"
      :on-exceed="onExceed"
      style="display: inline-block;"
    >
      <el-button size="small" type="primary" :class="className">上传</el-button>
    </el-upload>

  </div>
</template>

<script>

import { defaultServerUri } from './config'

export default {
  name: 'BsUpload',
  props: {
    isShow: {
      type: Boolean
    },
    limit: {
      type: Number,
      default: 1
    },
    // store里面的userInfo
    userInfo: {
      type: Object,
      default: () => {}
    },
    size: {
      // 输入框尺寸 medium/small/mini
      type: String,
      default: ''
    },
    editActived: {
      type: Boolean
    },
    openLoading: {
      type: Boolean,
      default() {
        return true
      }
    },
    uniqeName: {
      type: String,
      default: 'bs-upload__input'
    },
    queryparams: {
      // 查询参数
      type: Object,
      default() {
        return {}
      }
    },
    deleteparams: {
      // 删除参数
      type: Object,
      default() {
        return {}
      }
    },
    downloadparams: {
      // 下载参数
      type: Object,
      default() {
        return {}
      }
    },
    minServer: {
      // 获取数据访问uri，可自定义
      type: Object,
      default() {
        return defaultServerUri
      }
    },
    afterUpload: {
      // 上传后回调
      type: Function,
      default: function(datas) {}
    },
    afterDelete: {
      // 删除后回调
      type: Function,
      default: function(datas) {}
    },
    queryConfig: {
      type: Object,
      default() {
        return {}
      }
    },
    accept: {
      type: String,
      default: '*/*'
    }

  },
  data() {
    return {
      serverUri: {},
      className: this.uniqeName,
      uploadparams: this.queryparams,
      delparams: this.deleteparams,
      downparams: this.downloadparams,
      queryConfigFn: this.queryConfig

    }
  },
  computed: {
    multiple() {
      return this.limit > 1
    },
    appid() {
      return this.$store.state.curNavModule.appid
    }
  },
  components: {

  },

  methods: {
    upload() {
      const mm = document.getElementsByClassName(`${this.className}`)[0].parentNode.children[1]
      mm.click()
    },
    // 获取参数
    getParams(file) {
      let param = new FormData() // 创建form对象
      param.append('file', file)
      param.append('filename', file.name)
      param.append('appid', this.uploadparams.appid || this.appid)
      param.append('billguid', this.uploadparams.billguid || '')
      param.append('doctype', this.uploadparams.doctype || '')
      param.append('year', this.uploadparams.year || this.userInfo.year)
      param.append('province', this.uploadparams.province || this.userInfo.province)
      param.append('userguid', this.userInfo.guid)
      let queryConfigFnKeys = Object.keys(this.queryConfigFn)
      if (queryConfigFnKeys.length) {
        queryConfigFnKeys.forEach((key) => {
          param.append(key, this.queryConfigFn[key])
        })
      }
      return param
    },

    onbeforeUpload(file) {
      //  校验处理
      if (!this.checkAccept(file)) {
        return
      }
      this.openLoading && this.$LoadingMark.showLoadingMark('', '上传中......')
      const formData = this.getParams(file)
      let self = this
      let param = {
        year: this.uploadparams.year,
        province: this.uploadparams.province,
        billguid: this.uploadparams.billguid
      }
      this.$http.get('mp-t-file-service/v2/files', param).then(res => {
        let allDatas = JSON.parse(res.data)
        if (res.rscode === '100000') {
          if (res.data && res.data.length) {
            for (let i = 0; i < allDatas.length; i++) {
              if (allDatas[i].filename === file.name) {
                self.$message.warning('上传失败，已存在相同文件')
                return
              }
            }
          }
          var xhr = new XMLHttpRequest()
          xhr.open('post', 'http://10.207.100.2:8100/fileservice/v2/upload', true)
          // xhr.setRequestHeader('Content-type', 'multipart/form-data;boundary=----WebKitFormBoundarymBds69Dzo0ts0F8w')
          xhr.send(formData)
          xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
              var datas = JSON.parse(xhr.response)// 把数据转为JavaScript对象；
              if (datas.rscode === '100000') {
                self.$message.success('上传成功!')
                self.afterUpload(file, res.data)
              } else {
                self.$message.error('上传失败!')
              }
            }
          }
        } else {
          self.$message.console.error('上传失败，已存在相同文件')
        }
      })

      // this.$http[this.serverUri.upload.ajaxType](this.serverUri.upload.serverUri, formData, false, 'multipart/form-data;boundary=----WebKitFormBoundarymBds69Dzo0ts0F8w').then(res => {
      //   if (res.rscode === '100000') {
      //     this.$message({ showClose: true, message: '上传成功!', type: 'success' })
      //     this.afterUpload(file, res.data)
      //   } else {
      //     this.$message({ showClose: true, message: '上传失败!', type: 'error' })
      //   }
      //   this.openLoading && this.$LoadingMark.removeLoadingMark()
      // }).catch(err => {
      //   console.log(err)
      //   this.openLoading && this.$LoadingMark.removeLoadingMark()
      // })
    },

    checkAccept(file) {
      var fileSuffix = file.name.substring(file.name.lastIndexOf('.'))
      if (this.accept === '*/*') {
        return true
      }

      let acceptArr = this.accept.split(',')
      let aceepts = acceptArr.map((item, i) => { return item.toLowerCase() })
      if (!aceepts.includes(fileSuffix.toLowerCase())) {
        this.$message({
          message: `上传文件只能是${this.accept}格式!`,
          type: 'warning'
        })
        return false
      } else {
        return true
      }
    },

    // 上传文件
    uploadFiles(files) {
      console.log(33, files)
    },

    // 删除单个或多个文件
    deleteFile() {
      const params = {
        appid: this.appid,
        ...this.deleteparams
      }

      this.$http[this.serverUri.delete.ajaxType](this.serverUri.delete.serverUri, params, '', '', 'params').then(res => {
        if (res.rscode === '100000') {
          this.$message({ showClose: true, message: '删除成功!', type: 'success' })
          this.afterDelete()
        } else {
          this.$message({ showClose: true, message: '删除失败!', type: 'error' })
        }
      }).catch(err => {
        console.log(err)
      })

    },

    downloadFile() {
      const params = {
        appid: this.appid,
        ...this.downparams
      }
      this.$http[this.serverUri.fileExist.ajaxType](this.serverUri.fileExist.serverUri, params).then(res => {
        if (res.rscode === '100000') {
          const urlObj = this.$http.httpGlobalGatewayAgent(this.serverUri.download.serverUri)
          const downLoadUrl = `${urlObj.baseURL}/${urlObj.url}?appid=${this.appid}&fileguid=${this.downparams.fileguid}`

          // 通过JS打开新窗口会被拦截，换一种实现方式: 先打开页面, 后更改页面地址
          let tempwindow = window.open('_blank')
          tempwindow.location = downLoadUrl
          // window.open(downLoadUrl)
        } else {
          this.$message({ showClose: true, message: '文件不存在!', type: 'error' })
        }
      }).catch(err => {
        console.log(err)
      })
    },

    // 下载问题
    downloadFileBak() {
      const params = {
        appid: this.appid,
        ...this.downparams
      }
      this.$http[this.serverUri.download.ajaxType](this.serverUri.download.serverUri, params).then(res => {
        const code = res.headers.rscode
        const filename = res.headers.filename
        if (Number(code) === 100000) {
          const fileName = decodeURI(filename)
          const fileContent = res.data

          let blob = new Blob([fileContent], { type: 'application/octet-stream' })

          // const blob = new Blob([fileContent])
          if ('download' in document.createElement('a')) { // 非IE下载
            const a = document.createElement('a')
            a.download = fileName
            a.style.display = 'none'
            let url = URL.createObjectURL(blob)
            a.href = url
            document.body.appendChild(a)
            a.click()
            URL.revokeObjectURL(url) // 释放URL 对象
            document.body.removeChild(a)
          } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        } else {
          this.$message({ showClose: true, message: '下载异常!', type: 'error' })
        }
      }).catch(err => {
        this.$message({ showClose: true, message: '下载异常!', type: 'error' })
        console.log(err)
      })
    },

    // 获取文件列表
    getFileList() {
      return new Promise((resolve, reject) => {
        this.$http['get']('fileservice/v2/files', this.queryparams).then(res => {
          if (res.rscode === '100000') {
            resolve(res.data)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 服务参数合并
    mixinsServerUri() {
      this.serverUri = Object.assign({}, defaultServerUri, this.minServer)
    },

    // 上传成功钩子
    uploadSuccess(res, file, fileList) {
      console.log('success', res, file, fileList)
    },

    // 上传失败钩子
    uploadError(err, file, fileList) {
      console.log('error', err, file, fileList)
    },

    // 上传进度钩子
    onProgress(e, file, fileList) {
      console.log('progress', e, file, fileList)
    },

    // 选则文件超出最大限制个数
    onExceed(files, fileList) {
      this.$message({ showClose: true, message: `选择的文件超过最大设置数${this.limit}了!`, type: 'error' })
    }
  },
  mounted() {
    this.mixinsServerUri()
  },
  watch: {
    className(val) {
      this.className = val
    },
    minServer: {
      handler(newValue, oldValue) {
        this.mixinsServerUri()
      },
      deep: true,
      immediate: true
    },
    queryparams: {
      handler(newValue, oldValue) {
        this.uploadparams = this.queryparams
      },
      deep: true,
      immediate: true
    },
    deleteparams: {
      handler(newValue, oldValue) {
        this.delparams = this.deleteparams
      },
      deep: true,
      immediate: true
    },
    downloadparams: {
      handler(newValue, oldValue) {
        this.downparams = this.downloadparams
      },
      deep: true,
      immediate: true
    },
    queryConfig: {
      handler(newValue, oldValue) {
        this.queryConfigFn = newValue
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
