<template>
  <div>
    <el-page-header :icon="null" content="添加用户" title="用户管理" />

    <el-card style="margin-top: 50px">
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
        <el-form-item label="头像" prop="avatar">
          <SingleUpload :cover="ruleForm.avatar" @onchange="handleChange" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">添加用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import SingleUpload from '@/components/upload/SingleUpload.vue'
import { useRouter } from 'vue-router'
import { ApiFormData } from '@/api/user'
import md5 from 'md5'

const router = useRouter()
const handleChange = (file) => {
  ruleForm.avatar = URL.createObjectURL(file)
  ruleForm.file = file
}
const handleSubmit = () => {
  ruleFormRef.value.validate(async (value) => {
    if (value) {
      ApiFormData({
        path: '/user',
        ruleForm: {
          ...ruleForm,
          password: md5(ruleForm.password)
        }
      }).then(() => {
        ElMessage({
          message: '添加成功',
          type: 'success'
        })

        router.push({
          path: '/user-manage/userlist'
        })
      })
    }
  })
}

const ruleFormRef = ref()
const ruleForm = reactive({
  username: '',
  password: '',
  role: 2, // 1管理员，2普通用户
  gender: '2',
  introduction: '',
  avatar: '',
  file: null
})
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 10, message: '用户名长度应在4到10个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 4, max: 20, message: '密码长度应在4到20个字符', trigger: 'blur' }
  ],
  introduction: [
    { min: 0, max: 100, message: '简介不能超过100个字符', trigger: 'blur' }
  ]
})
</script>
