// 云函数：用户偏好存储和获取
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { action, preferences, userId } = event
  const wxContext = cloud.getWXContext()
  const openid = userId || wxContext.OPENID

  try {
    if (action === 'save') {
      // 保存用户偏好
      const result = await db.collection('userPreferences').doc(openid).set({
        data: {
          preferences,
          updatedAt: new Date(),
          createdAt: _.eq(new Date(), _.setOnInsert(new Date()))
        },
        upsert: true
      })
      return { success: true, data: result }
    } else if (action === 'get') {
      // 获取用户偏好
      const result = await db.collection('userPreferences').doc(openid).get()
      if (result.data) {
        return { success: true, data: result.data.preferences }
      } else {
        return { success: false, message: 'No preferences found' }
      }
    } else {
      return { success: false, message: 'Invalid action' }
    }
  } catch (error) {
    console.error('User preferences error:', error)
    return { success: false, error: error.message }
  }
}
