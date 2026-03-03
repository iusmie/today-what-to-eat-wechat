// 云函数：检查用户是否存在
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    // 检查用户是否已存在
    const userRecord = await db.collection('users').where({
      _openid: openid
    }).get()

    if (userRecord.data.length > 0) {
      return {
        exists: true,
        userInfo: userRecord.data[0].userInfo || null,
        preferences: userRecord.data[0].preferences || null
      }
    } else {
      return {
        exists: false,
        userInfo: null,
        preferences: null
      }
    }
  } catch (error) {
    console.error('检查用户存在性失败:', error)
    return {
      exists: false,
      userInfo: null,
      preferences: null,
      error: error.message
    }
  }
}
