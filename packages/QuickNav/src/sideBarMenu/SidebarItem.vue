<template>
  <div>
    <template v-if="!hasChildren(item)">
      <el-menu-item :index="item.nestedId">
        <el-tooltip v-if="item.name.length > 8" effect="dark" :content="item.name" placement="right">
          <div :class="'nev-level-' + getLevelInfo(item.nestedId)">
            <i class="basic-font ico fn-inline" :class="item.fontIcoClass"></i>
            <span class="fn-inline olh">
              {{ item.name }}
            </span>
          </div>
        </el-tooltip>
        <div v-else :class="'nev-level-' + getLevelInfo(item.nestedId)">
          <i class="basic-font ico fn-inline" :class="item.fontIcoClass"></i>
          <span class="fn-inline olh">
            {{ item.name }}
          </span>
        </div>
      </el-menu-item>
    </template>
    <el-submenu v-if="hasChildren(item)" :index="item.nestedId">
      <template slot="title">
        <el-tooltip v-if="item.name.length > 8" effect="dark" :content="item.name" placement="right">
          <div :class="'nav-level-title-' + getLevelInfo(item.nestedId)">
            <i class="basic-font ico fn-inline" :class="item.fontIcoClass"></i>
            <span class="fn-inline olh">
              {{ item.name }}
            </span>
          </div>
        </el-tooltip>
        <div v-else :class="'nav-level-title-' + getLevelInfo(item.nestedId)">
          <i class="basic-font ico fn-inline" :class="item.fontIcoClass"></i>
          <span class="fn-inline olh">
            {{ item.name }}
          </span>
        </div>
      </template>
      <template v-for="child in getChildren(item)">
        <sidebar-item
          v-if="hasChildren(child)"
          :key="child.nestedId"
          :item="child"
        />
        <el-menu-item v-else :key="child.nestedId" :index="child.nestedId">
          <el-tooltip v-if="child.name.length > 8" effect="dark" :content="child.name" placement="right">
            <div :class="'nav-level-' + getLevelInfo(child.nestedId)">
              <i class="basic-font ico fn-inline" :class="item.fontIcoClass"></i>
              <span class="fn-inline olh">
                {{ child.name }}
              </span>
            </div>
          </el-tooltip>
          <div v-else :class="'nav-level-' + getLevelInfo(child.nestedId)">
            <i class="basic-font ico fn-inline" :class="item.fontIcoClass"></i>
            <span class="fn-inline olh">
              {{ child.name }}
            </span>
          </div>
        </el-menu-item>
      </template>
    </el-submenu>
  </div>
</template>

<script>
export default {
  name: 'SidebarItem',
  props: {
    maxLevel: {
      type: Number,
      default: 2
    },
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    getLevelInfo(nestedId) {
      return (nestedId + '').split('-').length
    },
    hasChildren(item) {
      // console.log(item, item.nestedId, item.nestedId.split('_').length <= this.maxLevel)
      return (Array.isArray(item.children) && item.children.length) && item.nestedId.split('_').length <= this.maxLevel
    },
    getChildren(item) {
      return Array.isArray(item.children) ? item.children : []
    }
  }
}
</script>
