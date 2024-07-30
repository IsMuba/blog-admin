import { ElMessage } from 'element-plus'

// 文件类型和大小限制
const validate = (file, callback) => {
  // 检查文件大小
  const isLessLimit = file.size / 1024 / 1024 <= 5
  if (!isLessLimit) {
    callback && callback()
    return ElMessage.error('图片大小不能超过 5MB!')
  }

  // 检查文件类型
  if (!/\.(png|jpg|jpeg|gif|svg)$/i.test(file.name)) {
    callback && callback()
    return ElMessage.error(
      '图片格式必须是.png, .jpg, .jpeg, .gif, .svg中的一种'
    )
  }
}

export default validate
