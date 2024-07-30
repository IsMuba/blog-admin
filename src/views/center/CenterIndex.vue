<template>
  <div>
    <el-page-header :icon="null" content="个人中心" title="我的博客" />
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="avatar-card">
          <el-avatar :size="100" :src="avatarUrl" />
          <h3 class="username">{{ store.state.userInfo.username }}</h3>
          <h5 class="role">
            {{ store.state.userInfo.role === 1 ? '管理员' : '普通用户' }}
          </h5>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>个人信息</span>
            </div>
          </template>
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
              <el-button type="primary" @click="handleSubmit">更新</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import SingleUpload from '@/components/upload/SingleUpload.vue'
import { ApiFormData } from '@/api/user'
import defaultAvatar from '@/assets/defaultAvatar.png'

const store = useStore()

// eslint-disable-next-line no-undef
const serveUrl = process.env.VUE_APP_SERVE
const avatarUrl = computed(() =>
  store.state.userInfo.avatar
    ? serveUrl + store.state.userInfo.avatar
    : defaultAvatar
)

const handleChange = (file) => {
  ruleForm.avatar = URL.createObjectURL(file)
  ruleForm.file = file
}

const handleSubmit = () => {
  ruleFormRef.value.validate(async (value) => {
    if (value) {
      ApiFormData({
        path: '/user/upload',
        ruleForm
      }).then((data) => {
        store.commit('changeUserInfo', data)
        ElMessage({
          message: '更新成功',
          type: 'success'
        })
      })
    }
  })
}

const { id, username, gender, introduction, avatar } = store.state.userInfo
const ruleFormRef = ref()
const ruleForm = reactive({
  id,
  username,
  gender,
  introduction,
  avatar,
  file: null
})
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 10, message: '用户名长度应在4到10个字符', trigger: 'blur' }
  ],
  introduction: [
    { min: 0, max: 100, message: '简介不能超过100个字符', trigger: 'blur' }
  ]
})
</script>

<style lang="scss" scoped>
.el-row {
  margin-top: 50px;

  .avatar-card {
    text-align: center;
  }
}
</style>
