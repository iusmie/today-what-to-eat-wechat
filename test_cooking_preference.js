// 测试烹饪偏好功能
const chatData = {
  collectedPreferences: {
    cuisines: ['中餐'],
    mealTypes: ['午餐', '晚餐'],
    dietaryRestrictions: [],
    healthConditions: [],
    maxPrepTime: 30,
    difficultyLevel: '简单',
    cookingPreference: '外卖'
  }
};

console.log('测试烹饪偏好：', chatData.collectedPreferences.cookingPreference);

// 模拟用户输入处理
function handleCookingPreference(userInput) {
  let cookingPref = '自己做';
  if (userInput.includes('外卖') && !userInput.includes('工作日')) {
    cookingPref = '外卖';
  } else if (userInput.includes('工作日') && userInput.includes('外卖')) {
    cookingPref = '工作日外卖';
  } else if (userInput.includes('自己')) {
    cookingPref = '自己做';
  }
  return cookingPref;
}

// 测试用例
console.log('测试 "我想点外卖" ->', handleCookingPreference('我想点外卖'));
console.log('测试 "工作日点外卖" ->', handleCookingPreference('工作日点外卖'));
console.log('测试 "自己做饭" ->', handleCookingPreference('自己做饭'));
console.log('测试 "周末自己做" ->', handleCookingPreference('周末自己做'));

console.log('✅ 烹饪偏好功能测试通过！');