// pages/index/index.js
Page({
  data: {
    motto: '今天吃什么？让AI帮你决定！',
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
  },

  onLoad() {
    // 获取用户信息
    const app = getApp();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    }
  },

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息
    wx.getUserProfile({
      desc: '用于个性化美食推荐',
      success: (res) => {
        const app = getApp();
        app.globalData.userInfo = res.userInfo;
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        
        // 跳转到聊天页面
        wx.navigateTo({
          url: '/pages/chat/chat'
        });
      }
    });
  },

  startChat() {
    wx.navigateTo({
      url: '/pages/chat/chat'
    });
  },

  viewProfile() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    });
  },

  viewHistory() {
    wx.navigateTo({
      url: '/pages/history/history'
    });
  }
});