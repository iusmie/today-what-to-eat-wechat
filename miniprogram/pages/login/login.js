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
    this.setData({ isLoggingIn: true });

    wx.login({
      success: (res) => {
        if (res.code) {
          // 将 code 发往后端，后端调 auth.code2Session 换取 openid、session_key
          this.handleThirdPartyLogin('wechat', { code: res.code });
        } else {
          wx.showToast({
            title: res.errMsg || '微信登录失败',
            icon: 'none'
          });
          this.setData({ isLoggingIn: false });
        }
      },
      fail: (err) => {
        console.error('wx.login 失败', err);
        wx.showToast({
          title: err.errMsg || '微信登录失败',
          icon: 'none'
        });
        this.setData({ isLoggingIn: false });
      }
    });
  },

  /**
   * 处理第三方登录
   * @param {string} type - 登录类型：wechat-微信
   * @param {object} data - 登录相关数据
   */
  handleThirdPartyLogin(type, data) {
    const that = this;
    const app = getApp();
    
    // 先尝试调用云函数进行登录
    wx.cloud.callFunction({
      name: 'saveUserInfo',
      data: {
        type: type,
        code: data.code
      },
      success: async (res) => {
        console.log('登录成功（云函数）', res);
        
        // 模拟登录延迟，提供更好的用户体验
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 保存用户信息到全局
        const openId = res.result?.openId || `mock_openid_${Date.now()}`;
        app.globalData.userInfo = {
          nickName: '微信用户',
          avatarUrl: '',
          openId: openId
        };
        
        // 保存到本地存储
        try {
          wx.setStorageSync('userInfo', app.globalData.userInfo);
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
      },
      fail: (err) => {
        console.error('云函数调用失败，使用本地登录', err);
        // 降级方案：如果云函数调用失败，使用本地存储
        that.handleLocalLogin(type, data);
      }
    });
  },

  /**
   * 本地登录（降级方案）
   * 当云函数不可用时，使用本地存储保存用户信息
   */
  handleLocalLogin(type, data) {
    const app = getApp();
    
    // 生成一个临时的用户ID
    const userId = `local_user_${Date.now()}`;
    
    // 保存用户信息到全局
    app.globalData.userInfo = {
      nickName: '微信用户',
      avatarUrl: '',
      openId: userId,
      isLocalUser: true // 标记为本地用户
    };
    
    // 保存到本地存储
    try {
      wx.setStorageSync('userInfo', app.globalData.userInfo);
      wx.setStorageSync('userCode', data.code); // 保存code，后续可以用于换取openid
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
    
    this.setData({ isLoggingIn: false });
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
