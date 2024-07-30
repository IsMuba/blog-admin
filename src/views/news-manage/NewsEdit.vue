<template>
  <div>
    <el-page-header content="编辑资讯" title="资讯管理" @back="handleBack" />

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
      <el-form-item label="内容" prop="content">
        <Editor
          @onchange="editorChange"
          :content="ruleForm.content"
          v-if="ruleForm.content"
        />
      </el-form-item>
      <el-form-item label="类别" prop="category">
        <el-select v-model="ruleForm.category">
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="链接" prop="link">
        <el-input v-model.trim="ruleForm.link" />
      </el-form-item>
      <el-form-item label="发布日期" prop="publishTime">
        <el-date-picker
          v-model="ruleForm.publishTime"
          type="date"
          style="width: 100%"
        />
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
import Editor from '@/components/editor/CommonEditor.vue'
import { ApiFormData } from '@/api/user'
import { ApiNewsDetail, ApiNewsCategoryList } from '@/api/news'

const router = useRouter()
const route = useRoute()
const categoryList = ref([])

onMounted(async () => {
  const id = route.params.id
  ApiNewsDetail(id).then((data) => {
    Object.assign(ruleForm, data)
  })

  ApiNewsCategoryList().then((data) => {
    categoryList.value = data
  })
})

const handleBack = () => {
  router.back()
}

const editorChange = (value) => {
  ruleForm.content = value
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
        path: `/news/${ruleForm.id}`,
        ruleForm: {
          ...ruleForm,
          albumFiles,
          publishTime: ruleForm.publishTime || ''
        },
        method: 'put',
        multipleKey: ['albumFiles']
      }).then(() => {
        ElMessage({
          message: '更新成功',
          type: 'success'
        })

        router.back()
      })
    }
  })
}

const ruleFormRef = ref()
let ruleForm = reactive({
  title: '',
  content: '',
  category: '',
  cover: '',
  album: [],
  albumFiles: [],
  file: null,
  isPublish: '0', //0未发布，1已发布
  link: '',
  publishTime: ''
})
const rules = reactive({
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 2, max: 50, message: '标题长度应在2到50个字符', trigger: 'blur' }
  ],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
  category: [{ required: true, message: '请选择类别', trigger: 'change' }],
  link: [
    { min: 0, max: 100, message: '链接不应超过100个字符', trigger: 'blur' }
  ]
})
</script>
