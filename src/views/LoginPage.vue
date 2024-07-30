<template>
  <div class="login-container">
    <el-form
      class="login-form"
      :model="loginForm"
      :rules="rules"
      ref="loginForms"
    >
      <h1>欢迎{{ $route.name === 'login' ? '登录' : '注册' }}</h1>
      <el-form-item prop="username">
        <el-input
          :prefix-icon="User"
          v-model.trim="loginForm.username"
          placeholder="账号"
          @keyup.enter="handleClick"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          :prefix-icon="Lock"
          v-model.trim="loginForm.password"
          placeholder="密码"
          show-password
          @keyup.enter="handleClick"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loading"
          class="login-btn"
          type="primary"
          size="default"
          @click="handleClick"
        >
          {{ $route.name === 'login' ? '登录' : '注册' }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/time'
import { useStore } from 'vuex'
import md5 from 'md5'
import { ApiLogin, ApiReg } from '@/api/user'

let loginForms = ref()
let $router = useRouter()
let $route = useRoute()
let loading = ref(false)
let loginForm = reactive({ username: '', password: '', captcha: '' })
const store = useStore()

const handleClick = async () => {
  await loginForms.value.validate()
  loading.value = true
  if ($route.name === 'login') {
    ApiLogin({
      ...loginForm,
      password: md5(loginForm.password)
    })
      .then((data) => {
        store.commit('changeUserInfo', data)
        store.commit('changeGetterRouter', false)
        let redirect = $route.query.redirect
        $router.push({ path: redirect || '/' })
        ElNotification({
          type: 'success',
          message: '欢迎回来',
          title: `HI,${getTime()}好`
        })
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    ApiReg({
      ...loginForm,
      password: md5(loginForm.password)
    })
      .then(() => {
        $router.push({ path: '/login' })
        ElNotification({
          type: 'success',
          message: '注册成功'
        })
      })
      .finally(() => {
        loading.value = false
      })
  }
}

const validatorPassword = (rule, value, callback) => {
  if (value.length > 0) {
    callback()
  } else {
    callback(new Error('密码不能为空'))
  }
}

const rules = computed(() => {
  let obj = {
    username: [{ required: true, message: '账号不能为空', trigger: 'change' }],
    password: [{ trigger: 'change', validator: validatorPassword }]
  }
  if ($route.name === 'login') {
    obj = {
      ...obj,
      captcha: [
        { required: true, message: '验证码不能为空', trigger: 'change' }
      ]
    }
  }
  return obj
})
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 100vh;
  background: url('@/assets/loginBg.jpg') no-repeat;
  background-size: cover;

  .login-form {
    box-sizing: border-box;
    width: 400px;
    padding: 30px;
    margin-right: 100px;

    h1 {
      margin-bottom: 30px;
      font-size: 40px;
      color: white;
      white-space: nowrap;
    }

    .captcha-img {
      position: absolute;
      top: 1px;
      right: 1px;
      height: 30px;
      background: bisque;
    }

    .login-btn {
      width: 100%;
    }
  }
}
</style>
