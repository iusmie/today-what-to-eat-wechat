// app.js
App({
  onLaunch() {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'today-what-to-eat-prod', // 生产环境ID
        traceUser: true,
      });
    }

    // 全局用户数据
    this.globalData = {
      userInfo: null,
      userPreferences: {
        cuisines: [],
        mealTypes: [],
        dietaryRestrictions: [],
        healthConditions: [],
        maxPrepTime: 60,
        difficultyLevel: '中等'
      }
    };
  }
});