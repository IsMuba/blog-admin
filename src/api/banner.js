import ajax from './ajax'

// 产品列表
export const ApiBannerList = () => ajax.get('/banner')

// 产品详情
export const ApiBannerDetail = (id) => ajax.get(`/banner/${id}`)

// 产品添加
export const ApiBannerAdd = (data) => ajax.post('/banner', data)

// 产品修改
export const ApiBannerUpdate = (id, data) => ajax.put(`/banner/${id}`, data)

// 产品删除
export const ApiBannerDelete = (id) => ajax.delete(`/banner/${id}`)

// 产品状态修改
export const ApiBannerStatus = (data) => ajax.post('/banner/publish', data)
