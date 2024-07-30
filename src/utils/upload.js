import axios from 'axios'

/**
 * path  接口地址
 * ruleForm  表单数据
 * method  请求方式
 * multipleKey  多文件上传字段的key
 */
function upload({ path, ruleForm, method = 'post', multipleKey = [] } = {}) {
  const params = new FormData()
  for (let i in ruleForm) {
    if (multipleKey.includes(i)) {
      ruleForm[i].forEach((item) => {
        params.append([i], item)
      })
    } else {
      params.append(i, ruleForm[i])
    }
  }
  return axios[method](path, params, {
    headers: {
      'Content-type': 'multipart/form-data'
    }
  })
}

export default upload
