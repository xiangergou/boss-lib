<!--  富文本编辑器   Author:Titans@2396757591@qq.com -->
<template>
  <div class="quill-edit-container">
    <quill-editor
      ref="myQuillEditor"
      v-model="content"
      :options="editorOption"
      @blur="onEditorBlur"
      @focus="onEditorFocus"
      @change="onEditorChange"
    />
  </div>
</template>

<script>
export default {
  name: 'BsRichTextEditor',
  props: {
    defaultContent: {
      type: String,
      default: '<p>hello world</p>'
    }
  },
  data() {
    return {
      content: this.defaultContent,
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
            ['blockquote', 'code-block'], // 引用，代码块

            [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
            [{ list: 'ordered' }, { list: 'bullet' }], // 列表
            [{ script: 'sub' }, { script: 'super' }], // 上下标
            [{ indent: '-1' }, { indent: '+1' }], // 缩进
            [{ direction: 'rtl' }], // 文本方向

            [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
            [{ header: [1, 2, 3, 4, 5, 6, false] }], // 几级标题

            [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
            [{ font: [] }], // 字体
            [{ align: [] }], // 对齐方式

            ['clean'], // 清除字体样式
            ['image', 'video'] // 上传图片、上传视频
          ]
        },
        theme: 'snow',
        imageResize: {}
      }
    }
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  methods: {
    onEditorBlur(quill) {
      console.log('editor blur!', quill)
    },
    onEditorFocus(quill) {
      console.log('editor focus!', quill)
    },
    onEditorReady(quill) {
      console.log('editor ready!', quill)
    },
    onEditorChange() {
      this.$emit('onChange', this.content)
    } // 内容改变事件
  },
  watch: {
    defaultContent: {
      handler(newValue) {
        this.content = newValue
      }
    }
  }
}
</script>

<style lang="scss">
.quill-edit-container {
  height: 100px;
  .ql-editor {
    min-height: 200px;
  }
}
</style>
