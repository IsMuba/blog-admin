<template>
  <div>
    <el-page-header :icon="null" content="友情链接列表" title="链接管理" />

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
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import CommonTable from '@/components/CommonTable.vue'
import { ApiLinksStatus } from '@/api/links'

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
    list: '/links',
    delete: '/links/' // 删除接口类型要是delete，路径拼接id
  },
  columns: [
    {
      prop: 'title',
      label: '标题'
    },
    {
      prop: 'cover',
      label: 'Logo'
    },
    {
      prop: 'isPublish',
      label: '是否发布'
    },
    {
      prop: 'sort',
      label: '排序'
    }
  ],
  formatData(data) {
    let result = data.map((item) => {
      return {
        ...item,
        cover: item.cover ? serveUrl + item.cover : ''
      }
    })
    return result
  },
  rowKey: 'title',
  operation: {
    edit: true,
    delete: true
  }
}

// 查询
const handleSearch = () => {
  tableRef.value.currentPage = 1
  tableRef.value.getData({
    title: formInline.title
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
  router.push('/links-manage/linksadd')
}

// 编辑
const clickRow = async ({ row, type }) => {
  if (type === 'edit') {
    router.push(`/links-manage/linksedit/${row.id}`)
    return
  }
}

// 上下架
const handleSwitch = async (row) => {
  if (!row.id) {
    return
  }

  ApiLinksStatus({
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
</style>
