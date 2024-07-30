<template>
  <div>
    <el-page-header :icon="null" content="产品列表" title="产品管理" />

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="title" label="产品名称" />
      <el-table-column prop="cover" label="封面">
        <template #default="scope">
          <el-avatar :size="50" :src="scope.row.cover" />
        </template>
      </el-table-column>
      <el-table-column prop="introduction" label="产品简介" />
      <el-table-column prop="isPublish" label="是否发布">
        <template #default="scope">
          <el-switch
            v-model="scope.row.isPublish"
            active-value="1"
            inactive-value="0"
            @change="handleSwitch(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间"></el-table-column>
      <el-table-column prop="operation" label="操作">
        <template #default="scope">
          <el-button circle size="small" @click="handleEdit(scope.row)">
            <el-icon>
              <Edit />
            </el-icon>
          </el-button>
          <el-popconfirm
            :icon="Delete"
            title="确定要删除吗?"
            confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="handleDelete(scope.row)"
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import {
  ApiProductList,
  ApiProductDelete,
  ApiProductStatus
} from '@/api/product'

const tableData = ref([])
const router = useRouter()

onMounted(() => {
  getList()
})

// eslint-disable-next-line no-undef
const serveUrl = process.env.VUE_APP_SERVE
const getList = async () => {
  ApiProductList().then((data) => {
    tableData.value = data.map((item) => {
      return {
        ...item,
        cover: item.cover ? serveUrl + item.cover : '',
        updateTime: dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
      }
    })
  })
}

const handleEdit = async (row) => {
  router.push(`/product-manage/productedit/${row.id}`)
}

const handleSwitch = async (row) => {
  ApiProductStatus({
    id: row.id,
    isPublish: row.isPublish
  }).then(() => {
    ElMessage({
      message: Number(row.isPublish) ? '已发布' : '已下架',
      type: 'success'
    })

    getList()
  })
}

const handleDelete = async (row) => {
  ApiProductDelete(row.id).then(() => {
    ElMessage({
      message: '已删除',
      type: 'success'
    })

    getList()
  })
}
</script>

<style lang="scss" scoped>
.el-table {
  margin-top: 50px;
}
</style>
