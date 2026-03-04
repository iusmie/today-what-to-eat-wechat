// 云函数：保存用户信息和处理登录
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { userInfo, preferences, type, code } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    // 检查用户是否已存在
    const userRecord = await db.collection('user_preferences').where({
      _openid: openid
    }).get()

    if (userRecord.data.length > 0) {
      // 更新现有用户信息
      const updateData = {};
      
      if (userInfo !== undefined) {
        updateData.userInfo = userInfo || userRecord.data[0].userInfo;
      }
      
      if (preferences !== undefined) {
        updateData.preferences = preferences || userRecord.data[0].preferences;
      }
      
      if (Object.keys(updateData).length > 0) {
        updateData.updatedAt = new Date();
        await db.collection('user_preferences').doc(userRecord.data[0]._id).update({
          data: updateData
        });
      }
    } else {
      // 创建新用户记录
      const userData = {
        userInfo: userInfo || {
          nickName: '微信用户',
          avatarUrl: ''
        },
        preferences: preferences || {
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
      };
      
      // 如果是通过 code 登录，可以在这里调用微信 API 获取更多信息
      // 但通常小程序端会直接传递 userInfo
      await db.collection('user_preferences').add({
        data: userData
      });
    }

    return {
      success: true,
      openId: openid,
      message: '用户信息保存成功'
    }
  } catch (error) {
    console.error('保存用户信息失败:', error);
    return {
      success: false,
      openId: openid, // 即使失败也返回openid，前端可以使用
      message: '保存失败，请稍后重试',
      error: error.message
    }
  }
}