<template>
  <div>
    <div class="search-area" v-if="$slots.search">
      <slot name="search"></slot>
      <el-divider />
    </div>
    <!-- 表格配置 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      :max-height="props.maxHeight"
      :default-sort="props.defaultSort"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @row-click="goDetail"
      :row-style="{ cursor: 'pointer' }"
      table-layout="auto"
      ref="tableRef"
      :class="{ 'has-search': $slots.search }"
    >
      <!-- 列配置 -->
      <!-- 可选择 -->
      <el-table-column
        fixed
        :selectable="setSelectable"
        type="selection"
        v-if="showSelectBox"
      />
      <el-table-column
        v-for="item in props.columns"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :sortable="item.sortable ? 'custom' : false"
        :width="item.width"
      >
        <!-- 表头配置 -->
        <template #header>
          <slot :name="item.prop + 'Header'">
            <div class="inline-flex" :style="item.labelStyle">
              <span>{{ item.label }}</span>
              <el-tooltip
                popper-class="table-tooltip"
                effect="dark"
                placement="top-start"
                :content="item.tooltip"
                v-if="item.tooltip"
              >
                <el-icon>
                  <Warning />
                </el-icon>
              </el-tooltip>
            </div>
          </slot>
        </template>
        <!-- 单元格配置 -->
        <template #default="scope">
          <slot :name="item.prop" :row="scope.row">
            <div :style="item.style">
              <span v-if="item.formatter">{{ item.formatter(scope.row) }}</span>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </div>
          </slot>
        </template>
      </el-table-column>
      <!-- 操作列配置 -->
      <el-table-column prop="operation" label="操作">
        <template #default="scope">
          <el-button
            circle
            type="success"
            size="small"
            @click="handleClick(scope.row, 'preview')"
            v-if="operation.view"
          >
            <el-icon>
              <View />
            </el-icon>
          </el-button>
          <el-button
            circle
            size="small"
            @click="handleClick(scope.row, 'edit')"
            v-if="operation.edit"
          >
            <el-icon>
              <Edit />
            </el-icon>
          </el-button>
          <el-popconfirm
            :icon="Delete"
            title="确定要删除吗?"
            confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="handleClick(scope.row, 'delete')"
            v-if="operation.delete"
          >
            <template #reference>
              <el-button circle size="small" type="danger">
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="showSelectBox" class="p-14">
      <el-checkbox
        v-model="isSelected"
        @click="tableRef?.toggleAllSelection()"
        :indeterminate="indeterminate"
        label="全选"
        style="margin-right: 10px; vertical-align: middle"
      />
      <slot name="footer" :rows="selectionRows">
        <span
          v-for="item in props.footer?.operations"
          :key="item.text || item.icon"
        >
          <el-button
            v-if="item.visible ? item.visible() : true"
            :type="item.type || 'primary'"
            :link="item.link"
            :plain="item.plain"
            :disabled="!selectionRows.length"
            @click="item.click(selectionRows)"
            style="margin-left: 10px"
          >
            <el-icon v-if="item.icon" :class="item.icon"></el-icon>
            {{ item.text }}
          </el-button>
        </span>
      </slot>
    </div>

    <!-- 分页配置 -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 20, 30, 40]"
      background
      :layout="layout"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { View, Edit, Delete, Warning } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import ajax from '@/api/ajax'

const props = defineProps({
  api: {
    // api接口
    type: Object,
    required: true,
    default() {
      return {
        list: '', // 获取列表
        delete: '' // 删除
      }
    }
  },
  rowKey: {
    // 行数据的 Key
    type: String
  },
  selectable: {
    type: Boolean,
    default: false
  },
  operation: {
    // 展示操作的按钮
    type: Object,
    default() {
      return {
        view: true,
        edit: true,
        delete: true
      }
    }
  },
  footer: {
    type: Object
    // operations: OperationInterface[]
  },
  defaultSort: {
    type: Object
    // // 默认排序
    // prop: string // 默认排序的列
    // order?: string // ['ascending'| 'descending'], 没有指定 order, 则默认顺序是 ascending
  },
  columns: {
    // 列字段
    type: Array,
    required: true
    // {
    //     // 显示列
    //     prop: string // 键名
    //     label?: string // 表头显示名称
    //     formatter?: (row: unknown) => string // 自定义单元格格式化方法，参数为当前行数据
    //     tooltip?: string // 表头 tooltip
    //     sortable?: boolean // 是否可以排序
    //     width?: number | string // 宽度
    //     style?: string // 单元格样式
    //     labelStyle?: string // 表头样式
    // }
  },
  formatData: {
    // data数据格式化
    type: Function
  },
  layout: {
    // 分页展示的内容
    type: String,
    default: 'total, prev, pager, next, sizes'
  },
  maxHeight: {
    // 表格最大高度
    type: [Number, String]
  }
})
const emit = defineEmits(['click-row', 'go-detail'])

const loading = ref(false)
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)
const pages = ref(1)
const tableRef = ref()

// 多选框逻辑
const isSelected = ref(false) // 是否有选中数据
const selectionRows = ref([]) // 当前选中的数据
const handleSelectionChange = (rows) => {
  selectionRows.value = rows
  isSelected.value = rows.length > 0
}
const disabledList = reactive([]) // 禁止勾选的数据
const setSelectable = (row) => {
  const selectable =
    typeof props.selectable === 'boolean'
      ? props.selectable
      : props.selectable?.(row)
  if (!selectable && !disabledList.includes(row?.[props.rowKey])) {
    disabledList.push(row?.[props.rowKey])
  }
  return selectable
}
const indeterminate = computed(
  () =>
    selectionRows.value.length > 0 &&
    selectionRows.value.length < tableData.value.length - disabledList.length
)
const showSelectBox = computed(
  () => props.selectable && disabledList.length < tableData.value.length
)

const handleClick = (row, type) => {
  if (type === 'delete' && props.api.delete) {
    handleDelete(row)
  } else {
    emit('click-row', {
      row,
      type
    })
  }
}

// 单个删除
const handleDelete = async (row) => {
  ajax({
    url: `${props.api.delete}${row.id}`,
    method: 'delete'
  }).then(() => {
    ElMessage({
      message: '已删除',
      type: 'success'
    })
    if (pages.value > 1 && tableData.value.length === 1) {
      currentPage.value -= 1
    }
    getData()
  })
}

// 批量删除
const handleDeleteMany = async (ids) => {
  ajax({
    url: `${props.api.delete}${ids}`,
    method: 'delete'
  }).then(() => {
    ElMessage({
      message: '已删除',
      type: 'success'
    })
    const len = ids.split(',').length
    if (pages.value > 1 && tableData.value.length === len) {
      currentPage.value -= 1
    }
    getData()
  })
}

// 排序
const handleSortChange = (data) => {
  const { prop, order } = data
  console.log(prop, order)
  // getTableData
}

// 跳转详情页
const goDetail = (row) => {
  emit('go-detail', row.id)
}

onMounted(() => {
  getData()
})

const getData = async (params = {}) => {
  loading.value = true
  ajax({
    url: props.api.list,
    method: 'get',
    params: {
      ...params,
      currentPage: currentPage.value,
      pageSize: pageSize.value
    }
  }).then((data) => {
    total.value = data.total
    pages.value = data.pages
    tableData.value = props.formatData
      ? props.formatData(data.records)
      : data.records
    loading.value = false
  })
}

const handleSizeChange = () => {
  getData()
}
const handleCurrentChange = () => {
  getData()
}

defineExpose({
  getData,
  currentPage,
  handleDeleteMany
})
</script>

<style lang="scss" scoped>
.search-area {
  margin-top: 40px;
}

.el-table {
  width: 100%;
  margin-top: 50px;

  &.has-search {
    margin-top: 0;
  }
}

.el-pagination {
  justify-content: center;
  margin-top: 15px;
}

.table-wrapper {
  border-top: 1px solid #eaeaea;
  border-right: 1px solid #eaeaea;
  border-left: 1px solid #eaeaea;
}

.inline-flex {
  display: inline-flex;
  align-items: center;
}

.p-14 {
  padding: 14px;
  border-bottom: 1px solid #eaeaea;
}

.p-y-20 {
  justify-content: center;
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>

<style lang="scss">
.table-tooltip {
  max-width: 220px;
}
</style>
