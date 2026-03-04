// pages/login/login.js
Page({
  data: {
    isLoggingIn: false,
    showSkip: false,
    isLoading: false,
    agreed: false,
    showAgreementTip: false
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
    
    // 先检查本地存储是否有用户信息
    try {
      const localUserInfo = wx.getStorageSync('userInfo');
      if (localUserInfo) {
        app.globalData.userInfo = localUserInfo;
        this.setData({ isLoading: false });
        // 如果用户已登录，可以选择直接跳转或显示登录界面
        // 这里选择显示登录界面，让用户重新登录
        return;
      }
    } catch (e) {
      console.log('读取本地存储失败', e);
    }
    
    // 尝试调用云函数检查用户状态（可选）
    wx.cloud.callFunction({
      name: 'checkUserExists',
      success: res => {
        this.setData({ isLoading: false });
        if (res.result && res.result.exists) {
          // 用户已存在，直接跳转
          app.globalData.userPreferences = res.result.preferences || {};
          app.globalData.userInfo = res.result.userInfo;
          wx.redirectTo({
            url: '/pages/chat/chat'
          });
        } else {
          // 新用户，显示登录界面
          this.setData({ showSkip: false });
        }
      },
      fail: err => {
        console.log('检查用户状态失败（云函数不可用）', err);
        this.setData({ 
          isLoading: false,
          showSkip: false 
        });
        // 不显示错误提示，让用户正常登录
      }
    });
  },

  /**
   * 切换协议同意状态
   */
  toggleAgreement() {
    this.setData({ 
      agreed: !this.data.agreed,
      showAgreementTip: false 
    });
  },

  /**
   * 检查协议同意状态
   */
  checkAgreement() {
    if (!this.data.agreed) {
      // 显示协议提示
      this.setData({ showAgreementTip: true });
      // 3秒后自动隐藏提示
      setTimeout(() => {
        this.setData({ showAgreementTip: false });
      }, 3000);
      return false;
    }
    this.setData({ showAgreementTip: false });
    return true;
  },

  /**
   * 微信小程序登录（官方推荐流程）
   * 调用 wx.login() 获取临时 code，发往后端换取 openid/session_key 完成登录
   */
  onWechatMpLogin() {
    // 检查用户是否同意协议
    if (!this.checkAgreement()) {
      return;
    }
    
    this.setData({ isLoggingIn: true });

    // 获取用户信息（需要用户授权）
    wx.getUserProfile({
      desc: '用于完善用户资料和个性化推荐',
      success: (profileRes) => {
        // 获取登录凭证
        wx.login({
          success: (loginRes) => {
            if (loginRes.code) {
              // 调用云函数进行完整登录流程
              this.handleCompleteLogin(profileRes.userInfo, loginRes.code);
            } else {
              wx.showToast({
                title: loginRes.errMsg || '微信登录失败',
                icon: 'none'
              });
              this.setData({ isLoggingIn: false });
            }
          },
          fail: (loginErr) => {
            console.error('wx.login 失败', loginErr);
            wx.showToast({
              title: loginErr.errMsg || '微信登录失败',
              icon: 'none'
            });
            this.setData({ isLoggingIn: false });
          }
        });
      },
      fail: (profileErr) => {
        console.error('获取用户信息失败', profileErr);
        wx.showModal({
          title: '授权失败',
          content: '需要您的授权才能使用完整功能，是否重新授权？',
          success: (modalRes) => {
            if (modalRes.confirm) {
              // 用户确认重新授权
              this.onWechatMpLogin();
            } else {
              // 显示跳过选项
              this.setData({ 
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

  /**
   * 处理完整登录流程
   * @param {object} userInfo - 用户基本信息
   * @param {string} code - 微信登录凭证
   */
  handleCompleteLogin(userInfo, code) {
    const that = this;
    const app = getApp();
    
    // 调用云函数进行登录和用户信息保存
    wx.cloud.callFunction({
      name: 'saveUserInfo',
      data: {
        userInfo: userInfo,
        code: code,
        preferences: {
          cuisines: ['中餐'],
          mealTypes: ['午餐', '晚餐'],
          dietaryRestrictions: [],
          healthConditions: [],
          maxPrepTime: 60,
          difficultyLevel: '中等',
          cookingPreference: '自己做'
        }
      },
      success: async (res) => {
        console.log('登录成功（云函数）', res);
        
        if (res.result.success) {
          // 保存用户信息到全局
          app.globalData.userInfo = userInfo;
          app.globalData.userPreferences = res.result.preferences || app.globalData.userPreferences;
          
          // 保存到本地存储
          try {
            wx.setStorageSync('userInfo', userInfo);
            wx.setStorageSync('userPreferences', app.globalData.userPreferences);
          } catch (e) {
            console.error('保存用户信息到本地存储失败', e);
          }
          
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1500
          });
          
          // 跳转到聊天页面
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/chat/chat'
            });
          }, 1500);
        } else {
          wx.showToast({
            title: res.result.message || '登录失败，请重试',
            icon: 'none'
          });
          this.setData({ isLoggingIn: false });
        }
      },
      fail: (err) => {
        console.error('云函数调用失败', err);
        wx.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        });
        this.setData({ isLoggingIn: false });
      }
    });
  },

  /**
   * 显示用户协议
   */
  showUserAgreement() {
    wx.showModal({
      title: '用户协议',
      content: '这里是用户协议的内容...',
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  /**
   * 显示隐私政策
   */
  showPrivacyPolicy() {
    wx.showModal({
      title: '隐私政策',
      content: '这里是隐私政策的内容...',
      showCancel: false,
      confirmText: '我知道了'
    });
  }
});