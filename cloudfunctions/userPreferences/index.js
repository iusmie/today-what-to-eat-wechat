// 云函数：用户偏好存储和获取
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { action, preferences } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    if (action === 'save') {
      // 保存用户偏好到 user_preferences 集合
      const existingUser = await db.collection('user_preferences').where({
        _openid: openid
      }).get()
      
      if (existingUser.data.length > 0) {
        // 更新现有记录
        await db.collection('user_preferences').doc(existingUser.data[0]._id).update({
          data: {
            preferences: preferences,
            updatedAt: new Date()
          }
        })
      } else {
        // 创建新记录
        await db.collection('user_preferences').add({
          data: {
            preferences: preferences,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
      }
      
      return { success: true, message: '用户偏好保存成功' }
    } else if (action === 'get') {
      // 获取用户偏好
      const result = await db.collection('user_preferences').where({
        _openid: openid
      }).get()
      
      if (result.data.length > 0) {
        return { success: true, data: result.data[0].preferences }
      } else {
        return { success: false, message: '未找到用户偏好' }
      }
    } else {
      return { success: false, message: '无效的操作' }
    }
  } catch (error) {
    console.error('用户偏好操作失败:', error)
    return { success: false, error: error.message }
  }
}