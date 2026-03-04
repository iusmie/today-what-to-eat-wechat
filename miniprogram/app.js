// app.js
App({
  onLaunch() {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      // 使用动态环境，支持开发/生产环境自动切换
      wx.cloud.init({
        env: wx.cloud.DYNAMIC_CURRENT_ENV,
        traceUser: true,
      });
    }

    // 检查用户登录状态
    this.checkLoginStatus();

    // 全局用户数据
    this.globalData = {
      userInfo: null,
      userPreferences: {
        cuisines: [],
        mealTypes: [],
        dietaryRestrictions: [],
        healthConditions: [],
        maxPrepTime: 60,
        difficultyLevel: '中等',
        cookingPreference: '自己做' // '自己做', '外卖', '工作日外卖'
      },
      isFirstLogin: false, // 标记是否首次登录
      hasCompletedOnboarding: false // 标记是否完成引导
    };
  },

  // 检查登录状态
  checkLoginStatus() {
    const that = this;
    
    // 获取用户信息
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接获取用户信息
          wx.getUserInfo({
            success: function(res) {
              that.globalData.userInfo = res.userInfo;
              console.log('用户已登录:', res.userInfo);
              
              // 检查是否是首次登录
              that.checkFirstLogin();
            }
          });
        } else {
          // 未授权，需要跳转到授权页面
          console.log('用户未授权，需要登录');
          // 这里会在页面 onLoad 中处理跳转
        }
      }
    });
  },

  // 检查是否首次登录
  checkFirstLogin() {
    const that = this;
    
    if (!this.globalData.userInfo) return;
    
    // 由于无法直接获取 openid，这里改为调用云函数检查
    wx.cloud.callFunction({
      name: 'checkUserExists',
      success: res => {
        if (res.result && res.result.exists) {
          this.globalData.hasCompletedOnboarding = true;
          this.globalData.userPreferences = res.result.preferences || this.globalData.userPreferences;
        } else {
          this.globalData.isFirstLogin = true;
          this.globalData.hasCompletedOnboarding = false;
        }
        console.log('用户偏好检查完成:', {
          isFirstLogin: this.globalData.isFirstLogin,
          hasCompletedOnboarding: this.globalData.hasCompletedOnboarding
        });
      },
      fail: err => {
        console.error('检查用户偏好失败:', err);
        this.globalData.isFirstLogin = true;
        this.globalData.hasCompletedOnboarding = false;
      }
    });
  },

  // 保存用户偏好
  saveUserPreferences(preferences) {
    const that = this;
    
    if (!this.globalData.userInfo) {
      console.warn('用户未登录，无法保存偏好');
      return Promise.reject('用户未登录');
    }
    
    // 调用云函数保存偏好
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'saveUserPreferences',
        data: { preferences: preferences },
        success: res => {
          if (res.result && res.result.success) {
            this.globalData.userPreferences = preferences;
            this.globalData.hasCompletedOnboarding = true;
            console.log('用户偏好保存成功');
            resolve(res.result);
          } else {
            reject(new Error('保存失败'));
          }
        },
        fail: err => {
          console.error('保存用户偏好失败:', err);
          reject(err);
        }
      });
    });
  }
});