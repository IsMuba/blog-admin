<template>
  <el-aside :width="$store.state.isCollapsed ? '64px' : '240px'">
    <el-menu
      :collapse="$store.state.isCollapsed"
      :collapse-transition="false"
      :router="true"
      :default-active="route.fullPath"
      class="el-menu-vertical-demo"
    >
      <el-menu-item index="/home">
        <el-icon>
          <HomeFilled />
        </el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-sub-menu index="/user-manage" v-admin>
        <template #title>
          <el-icon>
            <UserFilled />
          </el-icon>
          <span>用户管理</span>
        </template>
        <el-menu-item index="/user-manage/useradd">添加用户</el-menu-item>
        <el-menu-item index="/user-manage/userlist">用户列表</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="/news-manage">
        <template #title>
          <el-icon>
            <Reading />
          </el-icon>
          <span>资讯管理</span>
        </template>
        <el-menu-item index="/news-manage/newskinds">资讯类别</el-menu-item>
        <el-menu-item index="/news-manage/newsadd">创建资讯</el-menu-item>
        <el-menu-item index="/news-manage/newslist">资讯列表</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="/product-manage">
        <template #title>
          <el-icon>
            <Goods />
          </el-icon>
          <span>产品管理</span>
        </template>
        <el-menu-item index="/product-manage/productadd">添加产品</el-menu-item>
        <el-menu-item index="/product-manage/productlist">
          产品列表
        </el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="/banner-manage">
        <template #title>
          <el-icon>
            <Goods />
          </el-icon>
          <span>广告位管理</span>
        </template>
        <el-menu-item index="/banner-manage/banneradd">添加广告位</el-menu-item>
        <el-menu-item index="/banner-manage/bannerlist">
          广告位列表
        </el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="/links-manage">
        <template #title>
          <el-icon>
            <Reading />
          </el-icon>
          <span>友情链接管理</span>
        </template>
        <el-menu-item index="/links-manage/linksadd">创建链接</el-menu-item>
        <el-menu-item index="/links-manage/linkslist">链接列表</el-menu-item>
      </el-sub-menu>
      <el-menu-item index="/center">
        <el-icon>
          <Avatar />
        </el-icon>
        <span>个人中心</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import {
  HomeFilled,
  Avatar,
  UserFilled,
  Reading,
  Goods
} from '@element-plus/icons-vue'
import { useStore } from 'vuex'

const route = useRoute()
const store = useStore()
const vAdmin = {
  mounted(el) {
    if (store.state.userInfo.role !== 1) {
      el.parentNode.removeChild(el)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-aside {
  height: 100vh;

  .el-menu {
    height: 100vh;
  }
}
</style>
