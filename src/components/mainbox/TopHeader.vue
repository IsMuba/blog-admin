<template>
  <el-header>
    <div class="left">
      <el-icon @click="handleToggle">
        <HeadMenu />
      </el-icon>
      <span class="system">我的博客管理系统</span>
    </div>
    <div class="right">
      <span>欢迎 {{ store.state.userInfo.username }} 回来</span>
      <el-dropdown>
        <span>
          <el-icon :size="30" color="#fff">
            <UserFilled />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleCenter">个人中心</el-dropdown-item>
            <el-dropdown-item @click="handleLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup>
import { Menu as HeadMenu, UserFilled } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const handleToggle = () => {
  store.commit('changeCollapsed')
}

const handleCenter = () => {
  router.push('/center')
}
const handleLogout = () => {
  localStorage.removeItem('token')
  store.commit('clearUserInfo')
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 64px;
  color: #fff;
  background-color: #409eff;

  .left,
  .right {
    display: flex;
    align-items: center;

    .el-icon {
      cursor: pointer;
    }
  }

  .left {
    .system {
      margin-left: 10px;
    }
  }
}
</style>
