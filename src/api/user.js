import ajax from './ajax'

// 注册
export const ApiReg = (data) => ajax.post('/user/reg', data)

// 登录
export const ApiLogin = (data) => ajax.post('/user/login', data)

// 验证码
export const ApiCaptcha = () => ajax.get('/user/captcha')

// 用户列表
export const ApiUserList = () => ajax.get('/user')

// 用户详情
export const ApiUserDetail = (id) => ajax.get(`/user/${id}`)

// 删除用户
export const ApiDeleteUser = (id) => ajax.delete(`/user/${id}`)

// 修改用户
export const ApiUpdateUser = (id, data) => ajax.put(`/user/${id}`, data)

// 表单提交通用接口
/**
 * path  接口地址
 * ruleForm  表单数据
 * method  请求方式
 * multipleKey  多文件上传字段的key
 */
export const ApiFormData = ({
  path,
  ruleForm,
  method = 'post',
  multipleKey = []
} = {}) => {
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
  return ajax[method](path, params, {
    headers: {
      'Content-type': 'multipart/form-data'
    }
  })
}
