<template>
  <div>
    <el-page-header
      content="编辑广告位"
      title="广告位管理"
      @back="handleBack"
    />

    <el-form
      ref="ruleFormRef"
      style="max-width: 600px; margin-top: 50px"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      status-icon
    >
      <el-form-item label="广告位名称" prop="title">
        <el-input v-model.trim="ruleForm.title" />
      </el-form-item>
      <el-form-item label="广告位详情" prop="detail">
        <el-input v-model.trim="ruleForm.detail" type="textarea" />
      </el-form-item>
      <el-form-item label="广告位code" prop="code">
        <el-input v-model.trim="ruleForm.code" />
      </el-form-item>
      <el-form-item label="封面" prop="cover">
        <SingleUpload :cover="ruleForm.cover" @onchange="handleChange" />
      </el-form-item>
      <el-form-item label="相册" prop="album">
        <MultipleUpload
          :imgs="ruleForm.album"
          @onchange="handleMultipleChange"
          @onremove="handleRemove"
        />
      </el-form-item>
      <el-form-item label="链接" prop="link">
        <el-input v-model.trim="ruleForm.link" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">更新</el-button>
        <el-button @click="handleBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import SingleUpload from '@/components/upload/SingleUpload.vue'
import MultipleUpload from '@/components/upload/MultipleUpload.vue'
import { useRouter, useRoute } from 'vue-router'
import { ApiFormData } from '@/api/user'
import { ApiBannerDetail } from '@/api/banner'

const router = useRouter()
const route = useRoute()

onMounted(async () => {
  const id = route.params.id
  ApiBannerDetail(id).then((data) => {
    Object.assign(ruleForm, data)
  })
})

const handleBack = () => {
  router.back()
}

const handleChange = (file) => {
  ruleForm.cover = URL.createObjectURL(file)
  ruleForm.file = file
}

const handleMultipleChange = (file) => {
  // let url = URL.createObjectURL(file.raw)
  ruleForm.album.push(file.url)
  ruleForm.albumFiles.push(file)
}

const handleRemove = (url) => {
  ruleForm.album = ruleForm.album.filter((item) => !url.includes(item))
  ruleForm.albumFiles = ruleForm.albumFiles.filter(
    (item) => !item.url.includes(url)
  )
}

const handleSubmit = () => {
  ruleFormRef.value.validate(async (value) => {
    if (value) {
      let albumFiles = ruleForm.albumFiles.map((item) => item.raw)
      ApiFormData({
        path: `/banner/${ruleForm.id}`,
        ruleForm: {
          ...ruleForm,
          albumFiles
        },
        method: 'put',
        multipleKey: ['albumFiles']
      }).then(() => {
        ElMessage({
          message: '更新成功',
          type: 'success'
        })

        router.push({
          path: '/banner-manage/bannerlist'
        })
      })
    }
  })
}

const ruleFormRef = ref()
const ruleForm = reactive({
  title: '',
  detail: '',
  code: '',
  cover: '',
  file: null,
  album: [],
  albumFiles: [],
  link: '',
  isPublish: '0' // 0未发布，1已发布
})
const rules = reactive({
  title: [
    { required: true, message: '请输入广告位名称', trigger: 'blur' },
    {
      min: 2,
      max: 20,
      message: '广告位名称长度应在2到20个字符',
      trigger: 'blur'
    }
  ],
  detail: [
    { required: true, message: '请输入详情', trigger: 'blur' },
    { min: 10, max: 500, message: '详情应在10到1000个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入广告位code', trigger: 'blur' },
    {
      min: 2,
      max: 20,
      message: '广告位code长度应在2到20个字符',
      trigger: 'blur'
    }
  ],
  cover: [{ required: true, message: '请选择封面', trigger: 'blur' }],
  link: [
    { min: 0, max: 100, message: '链接不应超过100个字符', trigger: 'blur' }
  ]
})
</script>
