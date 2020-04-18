import jsonp from 'jsonp'
import {message} from 'antd'
import ajax from './ajax'

const BASE = ''

export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST')

export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', {parentId})

export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {categoryName, parentId}, 'POST')

export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST')

export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})

export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {pageNum, pageSize})

export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {productId, status}, 'POST')

export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax(BASE + '/manage/product/search', {
  pageNum,
  pageSize,
  [searchType]: searchName,
})

export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')

export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + ( product._id?'update':'add'), product, 'POST')

export const reqRoles = () => ajax(BASE + '/manage/role/list')

export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', {roleName}, 'POST')

export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')

export const reqUsers = () => ajax(BASE + '/manage/user/list')

export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', {userId}, 'POST')

export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/'+(user._id ? 'update' : 'add'), user, 'POST')

export const reqWeather = (city) => {

  return new Promise((resolve, reject) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    jsonp(url, {}, (err, data) => {
      console.log('jsonp()', err, data)
      if (!err && data.status==='success') {
        const {dayPictureUrl, weather} = data.results[0].weather_data[0]
        resolve({dayPictureUrl, weather})
      } else {
        message.error('获取天气信息失败!')
      }
    })
  })
}
