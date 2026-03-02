// 云函数：保存用户偏好
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { preferences } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    // 检查用户是否已存在
    const userRecord = await db.collection('users').where({
      _openid: openid
    }).get()

    if (userRecord.data.length > 0) {
      // 更新现有用户偏好
      await db.collection('users').doc(userRecord.data[0]._id).update({
        data: {
          preferences: preferences,
          updatedAt: new Date()
        }
      })
    } else {
      // 创建新用户记录
      await db.collection('users').add({
        data: {
          preferences: preferences,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    }

    return {
      success: true,
      message: '用户偏好保存成功'
    }
  } catch (error) {
    console.error('保存用户偏好失败:', error)
    return {
      success: false,
      message: '保存失败，请稍后重试'
    }
  }
}