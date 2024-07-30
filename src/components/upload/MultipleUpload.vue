<template>
  <!-- 批量上传 -->
  <el-upload
    action=""
    :accept="accept"
    v-model:file-list="fileList"
    :auto-upload="false"
    :multiple="true"
    list-type="picture-card"
    :limit="limit"
    :on-change="handleChange"
    :on-remove="handleRemove"
    :on-preview="handlePreview"
    :on-exceed="handleExceed"
  >
    <el-icon>
      <Plus />
    </el-icon>
    <template #tip>
      <div class="el-upload__tip">最多上传{{ limit }}张图片，大小不超过5MB</div>
    </template>
  </el-upload>

  <!-- 提示：设置了 :auto-upload="false" 后，文件上传事件不被再次调用，所以 before-upload 不生效，所以，限制图片大小和格式的时候，需在 :on-change 里面处理 -->

  <el-dialog v-model="dialogVisible">
    <img :src="dialogImageUrl" style="max-width: 100%" />
  </el-dialog>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import { ref, defineEmits, defineProps, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import validate from './validate'

// eslint-disable-next-line no-undef
const serveUrl = process.env.VUE_APP_SERVE
const accept = '.png,.jpg,.jpeg,.gif,.svg'

const props = defineProps({
  imgs: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['onchange', 'onremove'])
const limit = ref(10)
const fileList = ref([])

watch(
  () => props.imgs,
  (newVal) => {
    fileList.value = newVal.map((item) =>
      item.includes('blob')
        ? {
            url: item
          }
        : {
            url: serveUrl + item
          }
    )
  },
  {
    deep: true
  }
)

// 上传图片
const handleChange = (file) => {
  let result = validate(file, () => {
    nextTick(() => {
      fileList.value.pop()
    })
  })

  if (!result) {
    emit('onchange', file)
  }
}

// 移除图片
const handleRemove = (uploadFile) => {
  emit('onremove', uploadFile.url)
}

// 图片预览
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const handlePreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}

// 图片超出个数限制
const handleExceed = () => {
  ElMessage.error(`最多只能上传${limit.value}张图片`)
}
</script>
