import ajax from './ajax'

// 产品列表
export const ApiProductList = () => ajax.get('/product')

// 产品详情
export const ApiProductDetail = (id) => ajax.get(`/product/${id}`)

// 产品添加
export const ApiProductAdd = (data) => ajax.post('/product', data)

// 产品修改
export const ApiProductUpdate = (id, data) => ajax.put(`/product/${id}`, data)

// 产品删除
export const ApiProductDelete = (id) => ajax.delete(`/product/${id}`)

// 产品状态修改
export const ApiProductStatus = (data) => ajax.post('/product/publish', data)
