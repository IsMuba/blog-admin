<template>
  <div>
    <el-page-header :icon="null" content="资讯类别" title="资讯管理" />

    <div class="btns">
      <el-button type="primary" @click="handleAdd">新增</el-button>
      <el-divider />
    </div>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="100" />
      <el-table-column prop="name" label="类别名称" />
      <el-table-column prop="operation" label="操作" width="200">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
            编辑
          </el-button>
          <el-popconfirm
            :icon="Delete"
            title="确定要删除吗?"
            confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="handleDelete(scope.$index, scope.row)"
          >
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog
    v-model="dialogVisible"
    :title="ruleForm.id ? '编辑类别' : '新增类别'"
    width="500"
    :before-close="handleClose"
  >
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      status-icon
    >
      <el-form-item label="类别名称" prop="name">
        <el-input v-model.trim="ruleForm.name" :minlength="2" :maxlength="10" />
      </el-form-item>
      <el-form-item label="类别code" prop="code">
        <el-input v-model.trim="ruleForm.code" :disabled="!!ruleForm.id" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleEditConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import {
  ApiNewsCategoryList,
  ApiNewsCategoryDetail,
  ApiNewsCategoryAdd,
  ApiNewsCategoryEdit,
  ApiNewsCategoryDelete
} from '@/api/news'

const tableData = ref([])
const dialogVisible = ref(false)

const ruleFormRef = ref()
const ruleForm = ref({
  id: null,
  name: '',
  code: ''
})
const rules = reactive({
  name: [{ required: true, message: '请输入类别名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入类别code', trigger: 'blur' }]
})

const handleEditConfirm = () => {
  ruleFormRef.value.validate(async (value) => {
    if (value) {
      if (ruleForm.value.id) {
        await ApiNewsCategoryEdit(ruleForm.value.id, ruleForm.value)
      } else {
        await ApiNewsCategoryAdd(ruleForm.value)
      }

      ElMessage({
        message: ruleForm.value.id ? '更新成功' : '新增成功',
        type: 'success'
      })
      dialogVisible.value = false
      getData()
    }
  })
}

onMounted(() => {
  getData()
})

const getData = async () => {
  ApiNewsCategoryList().then((data) => {
    tableData.value = data
  })
}

const handleAdd = async () => {
  dialogVisible.value = true
  ruleForm.value.id = null
  ruleFormRef.value && ruleFormRef.value.resetFields()
}

const handleEdit = async (index, row) => {
  dialogVisible.value = true

  ApiNewsCategoryDetail(row.id).then((data) => {
    ruleForm.value = data
  })
}

const handleDelete = async (index, row) => {
  ApiNewsCategoryDelete(row.id).then(() => {
    ElMessage({
      message: '删除成功',
      type: 'success'
    })

    getData()
  })
}

const handleClose = () => {
  dialogVisible.value = false
  ruleFormRef.value.resetFields()
}
</script>

<style lang="scss" scoped>
.btns {
  margin-top: 25px;
  text-align: right;
}
</style>
