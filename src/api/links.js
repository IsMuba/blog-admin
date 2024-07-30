import ajax from './ajax'

// 资讯列表
export const ApiLinksList = () => ajax.get('/links/list')

// 资讯详情
export const ApiLinksDetail = (id) => ajax.get(`/links/${id}`)

// 上下架
export const ApiLinksStatus = (data) => ajax.post('/links/publish', data)
