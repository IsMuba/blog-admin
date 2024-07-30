<template>
  <div>
    <el-page-header :icon="null" content="用户列表" title="用户管理" />

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="avatar" label="头像">
        <template #default="scope">
          <el-avatar :size="50" :src="scope.row.avatar" />
        </template>
      </el-table-column>
      <el-table-column prop="role" label="角色">
        <template #default="scope">
          <el-tag type="danger" v-if="scope.row.role === 1">管理员</el-tag>
          <el-tag type="success" v-else>普通用户</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作">
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
    title="编辑用户"
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
      <el-form-item label="用户名" prop="username">
        <el-input v-model.trim="ruleForm.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model.trim="ruleForm.password"
          :show-password="true"
        />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="ruleForm.role">
          <el-option label="管理员" :value="1" />
          <el-option label="普通用户" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="ruleForm.gender">
          <el-option label="男" value="1" />
          <el-option label="女" value="0" />
          <el-option label="保密" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="个人简介" prop="introduction">
        <el-input v-model.trim="ruleForm.introduction" type="textarea" />
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
  ApiUserList,
  ApiUserDetail,
  ApiUpdateUser,
  ApiDeleteUser
} from '@/api/user'
import defaultAvatar from '@/assets/defaultAvatar.png'
import md5 from 'md5'

const tableData = ref([])
const dialogVisible = ref(false)

const ruleFormRef = ref()
const ruleForm = ref({
  username: '',
  password: '',
  role: 2, // 1管理员，2普通用户
  gender: '2',
  introduction: ''
})
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 10, message: '用户名长度应在4到10个字符', trigger: 'blur' }
  ],
  password: [
    { min: 4, max: 20, message: '密码长度应在4到20个字符', trigger: 'blur' }
  ],
  introduction: [
    { min: 0, max: 100, message: '简介不能超过100个字符', trigger: 'blur' }
  ]
})

const handleEditConfirm = () => {
  ruleFormRef.value.validate(async (value) => {
    if (value) {
      ApiUpdateUser(ruleForm.value.id, {
        ...ruleForm.value,
        password: ruleForm.value.password ? md5(ruleForm.value.password) : ''
      }).then(() => {
        ElMessage({
          message: '更新成功',
          type: 'success'
        })

        dialogVisible.value = false

        getData()
      })
    }
  })
}

onMounted(() => {
  getData()
})

// eslint-disable-next-line no-undef
const serveUrl = process.env.VUE_APP_SERVE
const getData = async () => {
  ApiUserList().then((data) => {
    tableData.value = data.map((item) => {
      return {
        ...item,
        avatar: item.avatar ? serveUrl + item.avatar : defaultAvatar
      }
    })
  })
}

const handleEdit = async (index, row) => {
  dialogVisible.value = true
  ApiUserDetail(row.id).then((data) => {
    ruleForm.value = data
  })
}

const handleDelete = async (index, row) => {
  ApiDeleteUser(row.id).then(() => {
    ElMessage({
      message: '删除成功',
      type: 'success'
    })

    getData()
  })
}

const handleClose = () => {
  dialogVisible.value = false
  ruleForm.value = {
    username: '',
    password: '',
    role: 2, // 1管理员，2普通用户
    gender: '2',
    introduction: ''
  }
}
</script>

<style lang="scss" scoped>
.el-table {
  margin-top: 50px;
}
</style>
