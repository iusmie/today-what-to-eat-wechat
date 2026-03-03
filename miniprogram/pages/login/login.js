// pages/login/login.js
Page({
  data: {
    isLoggingIn: false,
    showSkip: false,
    isLoading: false
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
    this.setData({ isLoading: true });
    const app = getApp();
    
    wx.cloud.callFunction({
      name: 'checkUserExists',
      success: res => {
        this.setData({ isLoading: false });
        if (res.result.exists) {
          // 用户已存在，直接跳转
          app.globalData.userPreferences = res.result.preferences;
          app.globalData.userInfo = res.result.userInfo;
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
        this.setData({ 
          isLoading: false,
          showSkip: true 
        });
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        });
      }
    });
  },

  // 微信一键登录
  loginWithWeChat() {
    const that = this;
    this.setData({ isLoggingIn: true, isLoading: true });
    
    // 获取用户信息
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        that.handleLogin(res.userInfo);
      },
      fail: (err) => {
        console.error('获取用户信息失败', err);
        wx.showModal({
          title: '授权失败',
          content: '需要您的授权才能使用完整功能，是否重新授权？',
          success: (modalRes) => {
            if (modalRes.confirm) {
              // 用户确认重新授权
              that.loginWithWeChat();
            } else {
              // 显示跳过选项
              that.setData({ 
                isLoggingIn: false, 
                isLoading: false,
                showSkip: true 
              });
            }
          }
        });
      }
    });
  },

  handleLogin(userInfo) {
    this.setData({ isLoggingIn: true, isLoading: true });
    
    // 保存用户信息
    const app = getApp();
    app.globalData.userInfo = userInfo;
    
    // 调用云函数保存用户信息
    wx.cloud.callFunction({
      name: 'saveUserInfo',
      data: { userInfo },
      success: res => {
        console.log('用户信息保存成功', res);
        if (res.result.success) {
          // 跳转到聊天页面
          wx.redirectTo({
            url: '/pages/chat/chat'
          });
        } else {
          wx.showToast({
            title: '登录失败，请重试',
            icon: 'none'
          });
          this.setData({ isLoggingIn: false, isLoading: false });
        }
      },
      fail: err => {
        console.error('用户信息保存失败', err);
        wx.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        });
        this.setData({ isLoggingIn: false, isLoading: false });
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