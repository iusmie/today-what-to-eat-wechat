// app.js
App({
  onLaunch() {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      // 不指定环境ID，使用默认环境或从project.config.json中读取
      // 如果需要在微信开发者工具中指定环境，请在项目设置中配置
      wx.cloud.init({
        // env: 'your-env-id', // 注释掉硬编码的环境ID，使用默认环境
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
    
    // 先尝试从本地存储读取用户信息
    try {
      const localUserInfo = wx.getStorageSync('userInfo');
      if (localUserInfo) {
        this.globalData.userInfo = localUserInfo;
        console.log('从本地存储加载用户信息');
        // 检查是否是首次登录
        this.checkFirstLogin();
        return;
      }
    } catch (e) {
      console.log('读取本地存储失败', e);
    }
    
    // 获取用户信息（旧版API，可能已废弃）
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接获取用户信息
          wx.getUserInfo({
            success: function(res) {
              that.globalData.userInfo = res.userInfo;
              console.log('用户已登录:', res.userInfo);
              
              // 保存到本地存储
              try {
                wx.setStorageSync('userInfo', res.userInfo);
              } catch (e) {
                console.error('保存用户信息到本地存储失败', e);
              }
              
              // 检查是否是首次登录
              that.checkFirstLogin();
            },
            fail: function(err) {
              console.log('获取用户信息失败', err);
            }
          });
        } else {
          // 未授权，需要跳转到授权页面
          console.log('用户未授权，需要登录');
          // 这里会在页面 onLoad 中处理跳转
        }
      },
      fail: function(err) {
        console.log('获取设置失败', err);
      }
    });
  },

  // 检查是否首次登录
  checkFirstLogin() {
    const that = this;
    
    if (!this.globalData.userInfo) return;
    
    // 先尝试从本地存储读取
    try {
      const localPreferences = wx.getStorageSync('userPreferences');
      if (localPreferences) {
        this.globalData.userPreferences = localPreferences;
        this.globalData.hasCompletedOnboarding = true;
        console.log('从本地存储加载用户偏好');
        return;
      }
    } catch (e) {
      console.log('读取本地存储失败', e);
    }
    
    // 如果云开发不可用，使用默认值
    if (!wx.cloud || !wx.cloud.database) {
      console.log('云开发不可用，使用默认偏好设置');
      this.globalData.isFirstLogin = true;
      this.globalData.hasCompletedOnboarding = false;
      return;
    }
    
    const db = wx.cloud.database();
    
    // 尝试从云数据库读取，如果集合不存在则使用本地存储
    db.collection('user_preferences')
      .where({
        _openid: wx.cloud.CloudID(this.globalData.userInfo.openId)
      })
      .get()
      .then(res => {
        if (res.data.length === 0) {
          // 首次登录
          this.globalData.isFirstLogin = true;
          this.globalData.hasCompletedOnboarding = false;
        } else {
          // 已有偏好设置
          this.globalData.hasCompletedOnboarding = true;
          this.globalData.userPreferences = res.data[0].preferences || this.globalData.userPreferences;
          // 同步到本地存储
          try {
            wx.setStorageSync('userPreferences', this.globalData.userPreferences);
          } catch (e) {
            console.error('保存到本地存储失败', e);
          }
        }
        console.log('用户偏好检查完成:', {
          isFirstLogin: this.globalData.isFirstLogin,
          hasCompletedOnboarding: this.globalData.hasCompletedOnboarding
        });
      })
      .catch(err => {
        // 集合不存在或其他错误，使用本地存储
        console.log('检查用户偏好失败（使用本地存储）:', err);
        try {
          const localPreferences = wx.getStorageSync('userPreferences');
          if (localPreferences) {
            this.globalData.userPreferences = localPreferences;
            this.globalData.hasCompletedOnboarding = true;
          } else {
            this.globalData.isFirstLogin = true;
            this.globalData.hasCompletedOnboarding = false;
          }
        } catch (e) {
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
      // 即使未登录，也保存到本地存储
      try {
        wx.setStorageSync('userPreferences', preferences);
        this.globalData.userPreferences = preferences;
        return Promise.resolve({ success: true, local: true });
      } catch (e) {
        return Promise.reject('用户未登录且本地存储失败');
      }
    }
    
    // 先保存到本地存储（确保数据不丢失）
    try {
      wx.setStorageSync('userPreferences', preferences);
      this.globalData.userPreferences = preferences;
      this.globalData.hasCompletedOnboarding = true;
    } catch (e) {
      console.error('保存到本地存储失败', e);
    }
    
    // 如果云开发不可用，只使用本地存储
    if (!wx.cloud || !wx.cloud.database) {
      console.log('云开发不可用，仅保存到本地存储');
      return Promise.resolve({ success: true, local: true });
    }
    
    const db = wx.cloud.database();
    
    // 尝试保存到云数据库
    return db.collection('user_preferences')
      .where({
        _openid: wx.cloud.CloudID(this.globalData.userInfo.openId)
      })
      .get()
      .then(res => {
        if (res.data.length > 0) {
          // 更新现有记录
          return db.collection('user_preferences')
            .doc(res.data[0]._id)
            .update({
              data: {
                preferences: preferences,
                updatedAt: new Date()
              }
            });
        } else {
          // 创建新记录
          return db.collection('user_preferences')
            .add({
              data: {
                preferences: preferences,
                createdAt: new Date(),
                updatedAt: new Date()
              }
            });
        }
      })
      .then(res => {
        this.globalData.userPreferences = preferences;
        this.globalData.hasCompletedOnboarding = true;
        console.log('用户偏好保存成功（云端）');
        return { success: true, local: true, cloud: true, data: res };
      })
      .catch(err => {
        // 云数据库保存失败，但本地存储已成功
        console.log('保存用户偏好到云端失败（已保存到本地）:', err);
        return { success: true, local: true, cloud: false, error: err };
      });
  }
});
