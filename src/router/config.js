const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: () => import('../views/home/HomeIndex.vue')
  },
  {
    path: '/center',
    component: () => import('../views/center/CenterIndex.vue')
  },
  {
    path: '/user-manage/useradd',
    component: () => import('../views/user-manage/UserAdd.vue'),
    requireAdmin: true
  },
  {
    path: '/user-manage/userlist',
    component: () => import('../views/user-manage/UserList.vue'),
    requireAdmin: true
  },
  {
    path: '/news-manage/newskinds',
    component: () => import('../views/news-manage/NewsKinds.vue')
  },
  {
    path: '/news-manage/newsadd',
    component: () => import('../views/news-manage/NewsAdd.vue')
  },
  {
    path: '/news-manage/newslist',
    component: () => import('../views/news-manage/NewsList.vue')
  },
  {
    path: '/news-manage/newsedit/:id',
    component: () => import('../views/news-manage/NewsEdit.vue')
  },
  {
    path: '/product-manage/productadd',
    component: () => import('../views/product-manage/ProductAdd.vue')
  },
  {
    path: '/product-manage/productlist',
    component: () => import('../views/product-manage/ProductList.vue')
  },
  {
    path: '/product-manage/productedit/:id',
    component: () => import('../views/product-manage/ProductEdit.vue')
  },
  {
    path: '/banner-manage/banneradd',
    component: () => import('../views/banner-manage/BannerAdd.vue')
  },
  {
    path: '/banner-manage/bannerlist',
    component: () => import('../views/banner-manage/BannerList.vue')
  },
  {
    path: '/banner-manage/banneredit/:id',
    component: () => import('../views/banner-manage/BannerEdit.vue')
  },
  {
    path: '/links-manage/linksadd',
    component: () => import('../views/links-manage/LinksAdd.vue')
  },
  {
    path: '/links-manage/linkslist',
    component: () => import('../views/links-manage/LinksList.vue')
  },
  {
    path: '/links-manage/linksedit/:id',
    component: () => import('../views/links-manage/LinksEdit.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/notfound/NotFound.vue')
  }
]

export default routes
