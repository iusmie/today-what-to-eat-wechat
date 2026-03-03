// pages/login/login.js
Page({
  data: {
    isLoggingIn: false,
    showSkip: false
  },

  onLoad() {
    // 检查是否已经登录
    const app = getApp();
    if (app.globalData.userInfo) {
      // 已经登录，直接跳转到聊天页面
      wx.redirectTo({
        url: '/pages/chat/chat'
      });
    } else {
      // 显示登录界面
      this.checkLoginStatus();
    }
  },

  checkLoginStatus() {
    const app = getApp();
    wx.cloud.callFunction({
      name: 'checkUserExists',
      success: res => {
        if (res.result.exists) {
          // 用户已存在，直接跳转
          app.globalData.userPreferences = res.result.preferences;
          wx.redirectTo({
            url: '/pages/chat/chat'
          });
        } else {
          // 新用户，显示授权按钮
          this.setData({ showSkip: false });
        }
      },
      fail: err => {
        console.log('检查用户状态失败', err);
        this.setData({ showSkip: true });
      }
    });
  },

  onGetUserInfo(e) {
    if (e.detail.userInfo) {
      this.handleLogin(e.detail.userInfo);
    } else {
      // 用户拒绝授权
      wx.showModal({
        title: '授权提示',
        content: '需要您的授权才能使用完整功能，是否重新授权？',
        success: (res) => {
          if (res.confirm) {
            // 重新尝试授权
          }
        }
      });
    }
  },

  handleLogin(userInfo) {
    this.setData({ isLoggingIn: true });
    
    // 保存用户信息
    const app = getApp();
    app.globalData.userInfo = userInfo;
    
    // 调用云函数保存用户信息
    wx.cloud.callFunction({
      name: 'saveUserInfo',
      data: { userInfo },
      success: res => {
        console.log('用户信息保存成功', res);
        // 跳转到聊天页面
        wx.redirectTo({
          url: '/pages/chat/chat'
        });
      },
      fail: err => {
        console.error('用户信息保存失败', err);
        wx.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        });
        this.setData({ isLoggingIn: false });
      }
    });
  },

  // 跳过登录（仅用于开发测试）
  skipLogin() {
    const app = getApp();
    app.globalData.userInfo = {
      nickName: '测试用户',
      avatarUrl: 'https://example.com/avatar.png'
    };
    wx.redirectTo({
      url: '/pages/chat/chat'
    });
  }
});