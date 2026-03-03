// 云函数：保存用户信息
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { userInfo } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    // 检查用户是否已存在
    const userRecord = await db.collection('users').where({
      _openid: openid
    }).get()

    if (userRecord.data.length > 0) {
      // 更新现有用户信息
      await db.collection('users').doc(userRecord.data[0]._id).update({
        data: {
          userInfo: userInfo,
          updatedAt: new Date()
        }
      })
    } else {
      // 创建新用户记录
      await db.collection('users').add({
        data: {
          userInfo: userInfo,
          preferences: {
            cuisines: [],
            mealTypes: [],
            dietaryRestrictions: [],
            healthConditions: [],
            maxPrepTime: 60,
            difficultyLevel: '中等',
            cookingPreference: '自己做'
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    }

    return {
      success: true,
      message: '用户信息保存成功'
    }
  } catch (error) {
    console.error('保存用户信息失败:', error)
    return {
      success: false,
      message: '保存失败，请稍后重试'
    }
  }
}