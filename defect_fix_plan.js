// 缺陷修复计划

// P0: 立即修复
// 1. 修复菜系匹配逻辑
const fixCuisineMatching = () => {
  // 原错误代码:
  // if (!prefs.cuisines.includes('中餐') && !prefs.cuisines.includes('中餐')) {
  //   return false;
  // }
  
  // 修复后代码:
  // 检查菜谱的菜系是否在用户偏好的菜系列表中
  if (prefs.cuisines.length > 0 && !prefs.cuisines.includes(recipe.cuisine)) {
    return false;
  }
};

// 2. 验证云函数
const verifyCloudFunctions = async () => {
  try {
    const checkResult = await wx.cloud.callFunction({
      name: 'checkUserExists'
    });
    console.log('checkUserExists 云函数正常');
    
    const saveResult = await wx.cloud.callFunction({
      name: 'saveUserInfo',
      data: { test: true }
    });
    console.log('saveUserInfo 云函数正常');
  } catch (error) {
    console.error('云函数验证失败:', error);
  }
};

// P1: 高优先级修复
// 3. 完善错误处理
const enhanceErrorHandling = () => {
  // 在云函数调用处添加详细错误处理
  wx.cloud.callFunction({
    name: 'checkUserExists',
    success: res => {
      // 处理成功
    },
    fail: err => {
      console.error('云函数调用失败:', err);
      let errorMessage = '网络连接失败，请检查网络后重试';
      if (err.errCode === -501001) {
        errorMessage = '云函数未部署，请联系开发者';
      }
      wx.showToast({ title: errorMessage, icon: 'none' });
    }
  });
};

// 4. 优化UI反馈
const addLoadingStates = () => {
  // 在关键操作前显示加载状态
  this.setData({ isLoading: true });
  // 操作完成后隐藏加载状态
  this.setData({ isLoading: false });
};

module.exports = {
  fixCuisineMatching,
  verifyCloudFunctions,
  enhanceErrorHandling,
  addLoadingStates
};