<template>
  <div>
    <el-page-header :icon="null" content="首页" title="我的博客" />

    <el-card>
      <el-row>
        <el-col :span="4">
          <el-avatar :size="100" :src="avatarUrl" />
        </el-col>
        <el-col :span="20">
          <h3 style="line-height: 100px">
            欢迎 {{ store.state.userInfo.username }} 回来
          </h3>
        </el-col>
      </el-row>
    </el-card>

    <el-card>
      <template #header>
        <div class="card-header">
          <span>产品列表</span>
        </div>
      </template>
      <el-carousel
        v-if="productList.length > 0"
        :interval="4000"
        type="card"
        height="300px"
      >
        <el-carousel-item v-for="item in productList" :key="item.id">
          <img :src="item.cover" style="width: 100%" />
        </el-carousel-item>
      </el-carousel>
      <el-empty v-else description="暂无数据" />
    </el-card>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { ref, computed, onMounted } from 'vue'
import defaultAvatar from '@/assets/defaultAvatar.png'
import { ApiProductList } from '@/api/product'

const store = useStore()
const productList = ref([])

// eslint-disable-next-line no-undef
const serveUrl = process.env.VUE_APP_SERVE
const avatarUrl = computed(() => {
  return store.state.userInfo.avatar
    ? serveUrl + store.state.userInfo.avatar
    : defaultAvatar
})

onMounted(() => {
  ApiProductList().then((data = []) => {
    productList.value = data.map((item) => {
      return {
        ...item,
        cover: serveUrl + item.cover
      }
    })
  })
})
</script>

<style lang="scss" scoped>
.el-card {
  margin-top: 50px;
}

/* stylelint-disable-next-line */
.el-carousel__item h3 {
  margin: 0;
  line-height: 200px;
  color: #475669;
  text-align: center;
  opacity: 0.75;
}

/* stylelint-disable-next-line */
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

/* stylelint-disable-next-line */
.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
