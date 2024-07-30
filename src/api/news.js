import ajax from './ajax'

// 资讯列表
export const ApiNewsList = () => ajax.get('/news/list')

// 资讯详情
export const ApiNewsDetail = (id) => ajax.get(`/news/${id}`)

// 上下架
export const ApiNewsStatus = (data) => ajax.post('/news/publish', data)

// 资讯分类列表
export const ApiNewsCategoryList = () => ajax.get('/newskinds')

// 资讯分类详情
export const ApiNewsCategoryDetail = (id) => ajax.get(`/newskinds/${id}`)

// 资讯分类新增
export const ApiNewsCategoryAdd = (data) => ajax.post('/newskinds', data)

// 资讯分类编辑
export const ApiNewsCategoryEdit = (id, data) =>
  ajax.put(`/newskinds/${id}`, data)

// 资讯分类删除
export const ApiNewsCategoryDelete = (id) => ajax.delete(`/newskinds/${id}`)
