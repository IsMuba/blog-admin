<template>
  <div>
    <el-page-header :icon="null" content="资讯列表" title="资讯管理" />

    <CommonTable ref="tableRef" v-bind="tableConfig" @click-row="clickRow">
      <template #search>
        <el-form :inline="true" :model="formInline" ref="formRef">
          <el-form-item label="标题" prop="title">
            <el-input
              v-model.trim="formInline.title"
              placeholder=""
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="类别" prop="code">
            <el-select
              v-model="formInline.code"
              placeholder=""
              clearable
              style="width: 200px"
            >
              <el-option
                :label="item.name"
                :value="item.code"
                v-for="item in categoryList"
                :key="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset(formRef)">重置</el-button>
            <el-button type="success" @click="handleAdd">新增</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template #cover="scope">
        <el-image
          style="width: 100px; height: 100px"
          :src="scope.row.cover"
          :zoom-rate="1.2"
          :max-scale="7"
          :min-scale="0.2"
          :preview-src-list="[scope.row.cover]"
          :initial-index="4"
          :preview-teleported="true"
          fit="cover"
        />
      </template>
      <template #category="scope">
        {{ categoryFormat(scope.row.category) }}
      </template>
      <template #isPublish="scope">
        <el-switch
          v-model="scope.row.isPublish"
          active-value="1"
          inactive-value="0"
          @change="handleSwitch(scope.row)"
        />
      </template>
    </CommonTable>
  </div>

  <el-dialog
    v-model="dialogVisible"
    title="资讯预览"
    width="800"
    :fullscreen="true"
  >
    <h2>{{ currentRow.title }}</h2>
    <div style="margin-top: 10px">{{ currentRow.updateTime }}</div>
    <el-divider>
      <el-icon>
        <StarFilled />
      </el-icon>
    </el-divider>
    <div class="preview-dialog" v-html="currentRow.content"></div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { StarFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import CommonTable from '@/components/CommonTable.vue'
import { ApiNewsStatus, ApiNewsCategoryList } from '@/api/news'

const dialogVisible = ref(false)
const currentRow = ref({})
const router = useRouter()
const tableRef = ref()
const formInline = reactive({
  title: '',
  code: null
})
const formRef = ref()
// eslint-disable-next-line no-undef
const serveUrl = process.env.VUE_APP_SERVE

// 表格设置
const tableConfig = {
  api: {
    list: '/news',
    delete: '/news/' // 删除接口类型要是delete，路径拼接id
  },
  columns: [
    {
      prop: 'title',
      label: '标题'
    },
    {
      prop: 'cover',
      label: '封面'
    },
    {
      prop: 'category',
      label: '类别'
    },
    {
      prop: 'isPublish',
      label: '是否发布'
    },
    {
      prop: 'publishTime',
      label: '发布时间'
    },
    {
      prop: 'updateTime',
      label: '更新时间',
      sortable: true
    }
  ],
  formatData(data) {
    let result = data.map((item) => {
      return {
        ...item,
        cover: item.cover ? serveUrl + item.cover : '',
        updateTime: dayjs(item.updateTime).format('YYYY-MM-DD'),
        publishTime: item.publishTime
          ? dayjs(item.publishTime).format('YYYY-MM-DD')
          : '--'
      }
    })
    return result
  },
  rowKey: 'title',
  selectable: true,
  footer: {
    operations: [
      {
        text: '批量删除',
        click: (selectedRows) => {
          let ids = selectedRows.map((t) => t.id)
          ids = ids.join()
          tableRef.value.handleDeleteMany(ids)
        }
      }
    ]
  }
}

const categoryList = ref([])

const categoryFormat = (value) => {
  let arr = categoryList.value.filter((t) => t.code === value)
  return arr.length > 0 ? arr[0].name : '--'
}

onMounted(() => {
  ApiNewsCategoryList().then((data) => {
    categoryList.value = data
  })
})

// 查询
const handleSearch = () => {
  tableRef.value.currentPage = 1
  tableRef.value.getData({
    title: formInline.title,
    category: formInline.code
  })
}

// 重置
const handleReset = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
  tableRef.value.getData()
}

// 新增
const handleAdd = () => {
  router.push('/news-manage/newsadd')
}

// 预览、编辑
const clickRow = async ({ row, type }) => {
  if (type === 'preview') {
    dialogVisible.value = true
    currentRow.value = row
    return
  }

  if (type === 'edit') {
    router.push(`/news-manage/newsedit/${row.id}`)
    return
  }
}

// 上下架
const handleSwitch = async (row) => {
  if (!row.id) {
    return
  }

  ApiNewsStatus({
    id: row.id,
    isPublish: row.isPublish
  }).then(() => {
    ElMessage({
      message: Number(row.isPublish) ? '已发布' : '已下架',
      type: 'success'
    })

    tableRef.value.getData()
  })
}
</script>

<style lang="scss" scoped>
.btns {
  margin-top: 25px;
}

/* stylelint-disable-next-line */
.preview-dialog ::v-deep img {
  max-width: 100%;
}
</style>
