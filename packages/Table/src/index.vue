<!--  Table   Author:Titans@2396757591@qq.com -->
<!--  Table   keep-source -->
<template>
  <div class="Titans-table">
    <vxe-grid
      v-if="ifRenderTable"
      :id="id"
      ref="xGrid"
      border
      import-config
      sync-resize
      auto-resize
      stripe
      keep-source
      header-align="center"
      highlight-hover-row
      :print-config="printConfigIn"
      :show-overflow="tableGlobalConfigIn.showOverflow"
      :show-header-overflow="tableGlobalConfigIn.showHeaderOverflow"
      :show-footer-overflow="tableGlobalConfigIn.showFooterOverflow"
      :height="height"
      :row-style="rowStyle"
      :cell-style="cellStyle"
      :checkbox-config="checkboxConfig"
      :sort-config="sortConfigIn"
      :loading="loading"
      :pager-config="pagerConfigIn"
      :columns="tableColumnsConfigIn"
      :form-config="tableFormConfigIn"
      :toolbar="toolbarConfigIn"
      :data="tableDataIn"
      :mouse-config="{ selected: true }"
      :keyboard-config="keyboardConfig"
      :empty-render="{ name: 'NotData' }"
      :custom-config="{ storage: false }"
      :edit-config="editConfigIn"
      :valid-config="validConfig"
      :edit-rules="editRulesIn"
      :highlight-current-row="tableGlobalConfigIn.highlightCurrentRow"
      :resizable="tableGlobalConfigIn.resizable"
      :align="tableGlobalConfigIn.align"
      :footer-align="tableGlobalConfigIn.footerAlign"
      :highlight-cell="tableGlobalConfigIn.highlightCell"
      :export-config="tableGlobalConfigIn.exportConfig"
      :tooltip-config="tableGlobalConfigIn.tooltipConfig"
      :expand-config="expandConfigIn"
      :tree-config="treeConfigIn"
      :show-footer="footerConfigIn.showFooter"
      :footer-method="footerConfigIn.footerMethod"
      :footer-span-method="footerConfigIn.footerSpanMethod"
      :context-menu="contextMenuConfigIn"
      :seq-config="seqConfig"

      @radio-change="radioChange"
      @edit-closed="editClosed"
      @edit-actived="editActived"
      @keydown="keydown"
      @current-change="currentChange"
      @cell-click="cellClick"
      @cell-dblclick="cellDblclick"
      @form-submit="formSearchSubmit"
      @checkbox-change="handleCheckboxChange"
      @checkbox-all="handleCheckboxAllChange"
      @page-change="handlePageChange"
      @toolbar-button-click="toolbarButtonClickEvent"
      @context-menu-click="onContextMenuClick"
    >
      <template v-slot:pagerLeftSlots>
        <slot name="pagerLeftSlots">
        </slot>
      </template>
      <template v-slot:toolbarSlots>
        <slot name="toolbarSlots"> </slot>
      </template>

      <template v-slot:toolbarTools>
        <div class="fn-inline custom-slot">
          <slot name="toolbar-custom-slot"> </slot>
          <!-- <slot name="custom-slot"></slot> -->
        </div>
        <div class="fn-inline">
          <vxe-button
            v-if="toolbarConfigInCopy.reverseCheck"
            status="primary"
            title="反选"
            name="reverseCheckbtn"
            @click="onToolbarOperrateClick('reverseCheck')"
          />
        </div>
        <div v-if="toolbarConfigIn.batchModify" class="batch-modify-slot fn-inline">
          <BatchModify :table-columns="tableColumnsConfigIn" @onSureClick="omBatchModifySureClick" />
        </div>
        <div class="fn-inline toolbarTools-select">
          <div
            v-if="toolbarConfigInCopy.moneyConversion"
            class="fn-inline select select-money-unit"
          >
            <!-- <div class="fn-inline text">单位:</div> -->
            <vxe-select
              v-model="moneyUnit"
              prefix-icon="单位:"
              placeholder="金额单位"
              :disabled="toolbarConfigInCopy.disabledMoneyConversion"
            >
              <vxe-option :key="1" :value="1" label="元" />
              <vxe-option :key="10000" :value="10000" label="万元" />
              <!-- <vxe-option :key="1000000" :value="1000000" label="百万元" />
              <vxe-option :key="10000000" :value="10000000" label="千万元" />
              <vxe-option :key="100000000" :value="100000000" label="亿元" /> -->
            </vxe-select>
          </div>
          <div
            v-if="
              toolbarConfigInCopy.yearlist &&
                toolbarConfigInCopy.yearlist.length
            "
            class="fn-inline select"
          >
            <vxe-select v-model="formSearchData.year" placeholder="年份">
              <vxe-option
                v-for="(item, index) in toolbarConfigInCopy.yearlist"
                :key="index"
                :value="item"
                :label="item"
              />
            </vxe-select>
          </div>
        </div>
        <div v-if="toolbarConfigInCopy.search" class="fn-inline">
          <div class="fn-inline filter-input">
            <vxe-input
              v-model="formSearchData.filterValue"
              placeholder="关键字过滤"
              clearable
              @input="formSearchSubmit"
            />
          </div>
          <div class="fn-inline tool-btn-group">
            <!-- <vxe-button
              status="primary"
              code="search"
              @click="formSearchSubmit"
            >搜索</vxe-button> -->
            <!-- <vxe-button code="reset">重置</vxe-button> -->
            <!-- <vxe-button
              v-if="toolbarConfigInCopy.advancedSearch"
              status="primary"
              code="search"
              @click="onAdvancedSearchBtnClick"
            >高级搜索</vxe-button> -->
          </div>
        </div>
        <div class="vxe-tools-custom--operate fn-inline">
          <!-- <el-tooltip class="item" effect="dark" content="导入" placement="top"> -->
          <vxe-button
            v-if="toolbarConfigInCopy.import"
            title="导入"
            name="importbtn"
            @click="onToolbarOperrateClick('import')"
          >
            <i class="vxe-button--icon custom-ico import"></i>
          </vxe-button>
          <!-- </el-tooltip> -->
          <vxe-button
            v-if="toolbarConfigInCopy.refresh"
            name="refreshbtn"
            title="刷新"
            @click="onToolbarOperrateClick('refresh')"
          >
            <i class="vxe-button--icon custom-ico refresh"></i>
          </vxe-button>
          <vxe-button
            v-if="toolbarConfigInCopy.calculator"
            title="计算"
            name="calculatorbtn"
            @click="onToolbarOperrateClick('calculator')"
          >
            <i class="vxe-button--icon custom-ico calculator"></i>
          </vxe-button>
          <vxe-button
            v-if="toolbarConfigInCopy.zoom"
            name="zoombigbtn"
            title="缩放"
            @click="onToolbarOperrateClick('zoom')"
          >
            <i class="vxe-button--icon custom-ico zoombig"></i>
          </vxe-button>
          <vxe-button
            v-if="toolbarConfigInCopy.export"
            name="exportbtn"
            title="导出"
            @click="onToolbarOperrateClick('export')"
          >
            <i class="vxe-button--icon custom-ico export"></i>
          </vxe-button>
          <!-- <vxe-button v-if="toolbarConfigInCopy.custom" name="custombtn" @click="onToolbarOperrateClick('custom')">
            <i class="vxe-button--icon custom-ico custom"></i>
          </vxe-button> -->
        </div>
      </template>
      <template v-slot:empty>
        <div style="opcity:0.65;"><img :src="require('./assets/img/empty.svg')"> </div>
        <div>亲，没有更多数据了！</div>
      </template>
    </vxe-grid>
    <ExportModel
      :export-modal-data="exportModalData"
      :export-modal-visible.sync="exportModalVisible"
      @onExportClick="onExportClick"
    />
    <ImportModel
      :file-config="fileConfig"
      :import-modal-visible.sync="importModalVisible"
      @onDownloadTemplateClick="onDownloadTemplateClick"
      @onImportClick="onImportClick"
      @onImportFileClick="onImportFileClick"
    />
  </div>
</template>
<script>
import data from './util/data.js'
import methods from './util/methods.js'
import props from './util/props.js'
import watch from './util/watch.js'
import mixin from './config/mixin.js'
import { Import } from './import/import/import.js'
import { Export } from './export/export/export.js'
import ExportModel from './export/Export.vue'
import ImportModel from './import/import.vue'
import BatchModify from './batchModify/BatchModify.vue'
export default {
  name: 'BsTable',
  components: {
    ExportModel,
    ImportModel,
    BatchModify
  },
  props: {
    ...props
  },
  mixin: [mixin],
  data: data,
  methods: {
    ...methods
  },
  created() {
    this.initCreated()
  },
  computed: {
  },
  mounted() {
    this.$Import = new Import()
    this.$Export = new Export()
    this.initMounted()
  },
  watch: {
    ...watch
  }
}
</script>
<style lang="scss">
.Titans-table {
  .table-toolbar-left {
    .table-toolbar-contro-leftvisible {
      float: left;
      margin-right: 16px;
      height: 32px;
      width: 32px;
      cursor: pointer;
      background: url(./assets/img/tree-hide-ico.svg);
      background-size: 100% 100%;
    }
    .table-toolbar-left-title {
      float: left;
      font-size: 0;
      span {
        line-height: 32px;
        height: 32px;
        padding: 0 16px;
        min-width: 140px;
        background: #e3f2fe;
        font-size: 14px;
        color: #2e3133;
        text-align: left;
        position: relative;
      }
      i {
        border-width: 15px;
        border-style: solid;
        border-color: transparent;
        width: 1px;
        height: 1px;
        border-left-width: 20px;
        border-left-color: #e3f2fe;
      }
    }
  }
  .fgx {
    height: 28px;
    width: 1px;
    background: #e7ebf0;
    margin: 0 16px 0 4px;
  }
  .select-money-unit {
    width: 100px !important;
    .vxe-input--inner {
      padding-left: 45px;
      position: relative;
      background: transparent;
    }
    .vxe-input--prefix {
      left: 0.2em;
      width: 40px;
      i {
        font-style: normal;
      }
      i::before {
        content: '单位:';
        font-size: 14px;
        color: #666;
      }
    }
  }
  .vxe-tools-custom--operate {
    // <vxe-button name="refreshbtn" />
    //     <vxe-button name="calculatorbtn" />
    //     <vxe-button name="zoombigbtn" />
    //     <vxe-button name="exportbtn" />
    margin-right: 8px;
    .vxe-button {
      padding: 0;
      background: #e3f2fe;
      border: none;
    }
    i.custom-ico:before {
      content: '';
      height: 14px;
      width: 14px;
      display: inline-block;
    }
    i.import:before {
      background: url(./assets/img/import-ico.svg);
      background-size: 100% 100%;
    }
    i.refresh:before {
      background: url(./assets/img/refresh.svg);
      background-size: 100% 100%;
    }
    i.calculator:before {
      background: url(./assets/img/calc-ico.svg);
      background-size: 100% 100%;
    }

    i.zoombig:before {
      background: url(./assets/img/fullScreen-ico.svg);
      background-size: 100% 100%;
    }
    i.export:before {
      background: url(./assets/img/download-ico.svg);
      background-size: 100% 100%;
    }
    i.custom:before {
      background: url(./assets/img/rowContro-ico.svg);
      background-size: 100% 100%;
    }
  }
  .vxe-tools--operate > .vxe-button {
    display: none;
  }
  .gloableOptionRow {
    font-size: 0;
    .gloable-option-row {
      font-size: 0;
      height: 20px;
      width: 30px;
      cursor: pointer;
    }
    // .gloable-option-row:hover {
    //   filter: brightness(80%) contrast(150%) hue-rotate(-5deg);
    // }
    .gloable-option-row-edit {
      background: url(./assets/img/edit.svg) no-repeat center;
      background-size: 100% 100%;
    }
    .gloable-option-row-edit-disable {
      background: url(./assets/img/edit-gray.svg) no-repeat center;
      background-size: 100% 100%;
    }
    .gloable-option-row-add {
      margin: 0 5px;
      background: url(./assets/img/add.svg) no-repeat center;
      background-size: 100% 100%;
    }
    .gloable-option-row-attachment {
      margin: 0 5px;
      background: url(./assets/img/attachment.svg) no-repeat center;
      background-size: 100% 100%;
    }
    .gloable-option-row-optionlog {
      background: url(./assets/img/optionlog.svg) no-repeat center;
      background-size: 100% 80%;
    }
    .gloable-option-row-audit {
      margin: 0 5px;
      background: url(./assets/img/icon-audit.png) no-repeat center;
      background-size: 100% 80%;
      width: 20px
    }
  }
}
</style>
