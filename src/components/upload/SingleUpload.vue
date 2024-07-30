<template>
  <!-- 单个上传 -->
  <el-upload
    action=""
    :accept="accept"
    :auto-upload="false"
    :show-file-list="false"
    :on-change="handleChange"
  >
    <img v-if="props.cover" :src="formatCover" class="cover" />
    <el-icon v-else class="cover-uploader-icon">
      <Plus />
    </el-icon>
    <template #tip>
      <div class="el-upload__tip">只能上传1张图片，大小不超过5MB</div>
    </template>
  </el-upload>

  <!-- 提示：设置了 :auto-upload="false" 后，文件上传事件不被再次调用，所以 before-upload 不生效，所以，限制图片大小和格式的时候，需在 :on-change 里面处理 -->
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import { defineEmits, defineProps, computed } from 'vue'
import validate from './validate'

const accept = '.png,.jpg,.jpeg,.gif,.svg'
const props = defineProps({
  cover: String
})
const emit = defineEmits(['onchange'])

// eslint-disable-next-line no-undef
const serveUrl = process.env.VUE_APP_SERVE
const formatCover = computed(() =>
  props.cover.includes('blob') ? props.cover : serveUrl + props.cover
)

const handleChange = (file) => {
  if (!validate(file)) {
    emit('onchange', file.raw)
  }
}
</script>

<style lang="scss" scoped>
.cover {
  display: block;
  width: 148px;
  height: 148px;
}

/* stylelint-disable-next-line */
::v-deep .el-upload {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  transition: var(--el-transition-duration-fast);
}

/* stylelint-disable-next-line */
::v-deep .el-upload:hover {
  border-color: var(--el-color-primary);
}

/* stylelint-disable-next-line */
::v-deep .el-icon.cover-uploader-icon {
  width: 148px;
  height: 148px;
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
</style>
