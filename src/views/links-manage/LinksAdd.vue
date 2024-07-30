<template>
  <div>
    <el-page-header :icon="null" content="创建友情链接" title="链接管理" />

    <el-form
      ref="ruleFormRef"
      style="max-width: 800px; margin-top: 50px"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      status-icon
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model.trim="ruleForm.title" />
      </el-form-item>
      <el-form-item label="Logo" prop="cover">
        <SingleUpload :cover="ruleForm.cover" @onchange="handleChange" />
      </el-form-item>
      <el-form-item label="链接" prop="link">
        <el-input v-model.trim="ruleForm.link" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model.number="ruleForm.sort" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import SingleUpload from '@/components/upload/SingleUpload.vue'
import { useRouter } from 'vue-router'
import { ApiFormData } from '@/api/user'

const router = useRouter()

const handleChange = (file) => {
  ruleForm.cover = URL.createObjectURL(file)
  ruleForm.file = file
}

const handleSubmit = () => {
  ruleFormRef.value.validate(async (value) => {
    if (value) {
      ApiFormData({
        path: '/links',
        ruleForm
      }).then(() => {
        ElMessage({
          message: '添加成功',
          type: 'success'
        })

        router.push({
          path: '/links-manage/linkslist'
        })
      })
    }
  })
}

const ruleFormRef = ref()
const ruleForm = reactive({
  title: '',
  cover: '',
  file: null,
  isPublish: '0', //0未发布，1已发布
  link: '',
  sort: 1
})
const rules = reactive({
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 2, max: 50, message: '标题长度应在2到50个字符', trigger: 'blur' }
  ],
  cover: [{ required: true, message: '请上传logo', trigger: 'blur' }],
  link: [
    { required: true, message: '请输入链接', trigger: 'blur' },
    { min: 0, max: 100, message: '链接不应超过100个字符', trigger: 'blur' }
  ]
})
</script>
