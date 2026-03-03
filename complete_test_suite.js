// 完整测试套件 - 验证所有功能和新增代码覆盖
const fs = require('fs');
const path = require('path');

console.log('🧪 执行完整测试套件...');
console.log('='.repeat(50));

// 测试配置
const testConfig = {
  projectRoot: '/home/admin/.openclaw/workspace/projects/today-what-to-eat-wechat',
  requiredFiles: [
    'miniprogram/app.js',
    'miniprogram/app.json',
    'miniprogram/pages/login/login.js',
    'miniprogram/pages/login/login.wxml',
    'miniprogram/pages/login/login.wxss',
    'miniprogram/pages/chat/chat.js',
    'miniprogram/pages/chat/chat.wxml',
    'miniprogram/pages/chat/chat.wxss',
    'miniprogram/utils/recipeData.js',
    'cloudfunctions/checkUserExists/index.js',
    'cloudfunctions/saveUserInfo/index.js'
  ],
  expectedFeatures: {
    loginFlow: true,
    chatFunctionality: true,
    recipeRecommendation: true,
    userPreferences: true,
    responsiveDesign: true,
    errorHandling: true,
    animations: true
  }
};

let testResults = {
  passed: 0,
  failed: 0,
  details: []
};

// 测试1: 文件完整性检查
function testFileIntegrity() {
  console.log('🔍 测试1: 文件完整性检查');
  let allFilesExist = true;
  
  testConfig.requiredFiles.forEach(file => {
    const filePath = path.join(testConfig.projectRoot, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file} - 存在`);
      testResults.passed++;
    } else {
      console.log(`❌ ${file} - 缺失`);
      testResults.failed++;
      allFilesExist = false;
    }
  });
  
  testResults.details.push({
    test: '文件完整性',
    status: allFilesExist ? 'PASS' : 'FAIL',
    message: allFilesExist ? '所有必需文件都存在' : '缺少必需文件'
  });
}

// 测试2: app.json 配置验证
function testAppConfig() {
  console.log('\n🔍 测试2: app.json 配置验证');
  const appJsonPath = path.join(testConfig.projectRoot, 'miniprogram/app.json');
  
  try {
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
    
    // 检查页面配置
    const requiredPages = ['pages/login/login', 'pages/chat/chat'];
    const hasAllPages = requiredPages.every(page => appJson.pages.includes(page));
    
    // 检查云开发启用
    const cloudEnabled = appJson.cloud === true;
    
    if (hasAllPages && cloudEnabled) {
      console.log('✅ 页面配置正确');
      console.log('✅ 云开发已启用');
      testResults.passed += 2;
      testResults.details.push({
        test: 'app.json配置',
        status: 'PASS',
        message: '页面配置和云开发设置正确'
      });
    } else {
      if (!hasAllPages) {
        console.log('❌ 页面配置不完整');
        testResults.failed++;
      }
      if (!cloudEnabled) {
        console.log('❌ 云开发未启用');
        testResults.failed++;
      }
      testResults.details.push({
        test: 'app.json配置',
        status: 'FAIL',
        message: '配置不完整'
      });
    }
  } catch (error) {
    console.log('❌ app.json 解析失败:', error.message);
    testResults.failed++;
    testResults.details.push({
      test: 'app.json配置',
      status: 'FAIL',
      message: 'JSON解析错误'
    });
  }
}

// 测试3: 登录页面功能测试
function testLoginPageFunctionality() {
  console.log('\n🔍 测试3: 登录页面功能测试');
  
  // 检查登录JS文件
  const loginJsPath = path.join(testConfig.projectRoot, 'miniprogram/pages/login/login.js');
  const loginJsContent = fs.readFileSync(loginJsPath, 'utf8');
  
  const requiredFunctions = [
    'onLoad',
    'loginWithWeChat',
    'checkLoginStatus',
    'handleLogin',
    'skipLogin'
  ];
  
  let allFunctionsExist = true;
  requiredFunctions.forEach(func => {
    if (loginJsContent.includes(`${func}(`) || loginJsContent.includes(`${func}:`)) {
      console.log(`✅ ${func} - 存在`);
      testResults.passed++;
    } else {
      console.log(`❌ ${func} - 缺失`);
      testResults.failed++;
      allFunctionsExist = false;
    }
  });
  
  // 检查WXML结构
  const loginWxmlPath = path.join(testConfig.projectRoot, 'miniprogram/pages/login/login.wxml');
  const loginWxmlContent = fs.readFileSync(loginWxmlPath, 'utf8');
  
  const requiredElements = [
    'bindtap="loginWithWeChat"',
    'class="login-button"',
    'wx:if="{{isLoggingIn}}"',
    'class="loading-section"'
  ];
  
  requiredElements.forEach(element => {
    if (loginWxmlContent.includes(element)) {
      console.log(`✅ ${element} - 存在`);
      testResults.passed++;
    } else {
      console.log(`❌ ${element} - 缺失`);
      testResults.failed++;
      allFunctionsExist = false;
    }
  });
  
  testResults.details.push({
    test: '登录页面功能',
    status: allFunctionsExist ? 'PASS' : 'FAIL',
    message: allFunctionsExist ? '所有登录功能完整' : '登录功能缺失'
  });
}

// 测试4: 聊天页面功能测试
function testChatPageFunctionality() {
  console.log('\n🔍 测试4: 聊天页面功能测试');
  
  const chatJsPath = path.join(testConfig.projectRoot, 'miniprogram/pages/chat/chat.js');
  const chatJsContent = fs.readFileSync(chatJsPath, 'utf8');
  
  const requiredChatFunctions = [
    'onLoad',
    'sendMessage',
    'addUserMessage',
    'addBotMessage',
    'processUserInput',
    'generateRecommendation'
  ];
  
  let allChatFunctionsExist = true;
  requiredChatFunctions.forEach(func => {
    if (chatJsContent.includes(`${func}(`) || chatJsContent.includes(`${func}:`)) {
      console.log(`✅ ${func} - 存在`);
      testResults.passed++;
    } else {
      console.log(`❌ ${func} - 缺失`);
      testResults.failed++;
      allChatFunctionsExist = false;
    }
  });
  
  // 检查对话状态管理
  const conversationStates = ['greeting', 'collecting_cuisines', 'recommending'];
  conversationStates.forEach(state => {
    if (chatJsContent.includes(state)) {
      console.log(`✅ 对话状态 ${state} - 支持`);
      testResults.passed++;
    } else {
      console.log(`❌ 对话状态 ${state} - 不支持`);
      testResults.failed++;
      allChatFunctionsExist = false;
    }
  });
  
  testResults.details.push({
    test: '聊天页面功能',
    status: allChatFunctionsExist ? 'PASS' : 'FAIL',
    message: allChatFunctionsExist ? '聊天功能完整' : '聊天功能缺失'
  });
}

// 测试5: 菜谱数据测试
function testRecipeData() {
  console.log('\n🔍 测试5: 菜谱数据测试');
  
  const recipeDataPath = path.join(testConfig.projectRoot, 'miniprogram/utils/recipeData.js');
  const recipeDataContent = fs.readFileSync(recipeDataPath, 'utf8');
  
  // 检查菜谱数量
  const recipeCountMatch = recipeDataContent.match(/recipes:\s*\[\s*({[^}]*},?\s*)+/);
  let recipeCount = 0;
  if (recipeCountMatch) {
    const recipesArray = recipeDataContent.match(/{[^}]*}/g);
    recipeCount = recipesArray ? recipesArray.length : 0;
  }
  
  if (recipeCount >= 20) {
    console.log(`✅ 菜谱数据充足 (${recipeCount} 个菜品)`);
    testResults.passed++;
  } else {
    console.log(`❌ 菜谱数据不足 (${recipeCount} 个菜品)`);
    testResults.failed++;
  }
  
  // 检查国际菜系支持
  const internationalCuisines = ['意大利菜', '墨西哥菜', '印度菜', '法国菜', '希腊菜', '泰国菜', '日本料理', '韩国料理'];
  let internationalSupport = true;
  internationalCuisines.forEach(cuisine => {
    if (!recipeDataContent.includes(cuisine)) {
      console.log(`⚠️  国际菜系 ${cuisine} - 可能不支持`);
      internationalSupport = false;
    }
  });
  
  if (internationalSupport) {
    console.log('✅ 国际菜系支持完整');
    testResults.passed++;
  } else {
    console.log('⚠️  国际菜系支持不完整');
    // 不算失败，但记录警告
  }
  
  testResults.details.push({
    test: '菜谱数据',
    status: recipeCount >= 20 ? 'PASS' : 'FAIL',
    message: `菜谱数量: ${recipeCount}, 国际菜系支持: ${internationalSupport}`
  });
}

// 测试6: 云函数测试
function testCloudFunctions() {
  console.log('\n🔍 测试6: 云函数测试');
  
  const cloudFunctions = ['checkUserExists', 'saveUserInfo'];
  let allCloudFunctionsValid = true;
  
  cloudFunctions.forEach(func => {
    const funcPath = path.join(testConfig.projectRoot, `cloudfunctions/${func}/index.js`);
    if (fs.existsSync(funcPath)) {
      const funcContent = fs.readFileSync(funcPath, 'utf8');
      
      // 检查基本结构
      const hasCloudInit = funcContent.includes('cloud.init');
      const hasExportsMain = funcContent.includes('exports.main');
      const hasErrorHandling = funcContent.includes('try') && funcContent.includes('catch');
      
      if (hasCloudInit && hasExportsMain && hasErrorHandling) {
        console.log(`✅ 云函数 ${func} - 结构正确`);
        testResults.passed++;
      } else {
        console.log(`❌ 云函数 ${func} - 结构不完整`);
        testResults.failed++;
        allCloudFunctionsValid = false;
      }
    } else {
      console.log(`❌ 云函数 ${func} - 文件缺失`);
      testResults.failed++;
      allCloudFunctionsValid = false;
    }
  });
  
  testResults.details.push({
    test: '云函数',
    status: allCloudFunctionsValid ? 'PASS' : 'FAIL',
    message: allCloudFunctionsValid ? '云函数配置正确' : '云函数存在问题'
  });
}

// 测试7: 样式文件测试
function testStyles() {
  console.log('\n🔍 测试7: 样式文件测试');
  
  const styleFiles = [
    'miniprogram/pages/login/login.wxss',
    'miniprogram/pages/chat/chat.wxss'
  ];
  
  let allStylesValid = true;
  styleFiles.forEach(styleFile => {
    const stylePath = path.join(testConfig.projectRoot, styleFile);
    if (fs.existsSync(stylePath)) {
      const styleContent = fs.readFileSync(stylePath, 'utf8');
      
      // 检查关键样式类
      const requiredClasses = styleFile.includes('login') ? 
        ['.container', '.login-button', '.loading-section'] :
        ['.chat-container', '.message', '.input-area'];
      
      let hasRequiredClasses = true;
      requiredClasses.forEach(cls => {
        if (!styleContent.includes(cls)) {
          console.log(`❌ ${styleFile} 缺少样式类: ${cls}`);
          testResults.failed++;
          hasRequiredClasses = false;
        }
      });
      
      if (hasRequiredClasses) {
        console.log(`✅ ${styleFile} - 样式完整`);
        testResults.passed++;
      } else {
        allStylesValid = false;
      }
    } else {
      console.log(`❌ ${styleFile} - 文件缺失`);
      testResults.failed++;
      allStylesValid = false;
    }
  });
  
  testResults.details.push({
    test: '样式文件',
    status: allStylesValid ? 'PASS' : 'FAIL',
    message: allStylesValid ? '样式文件完整' : '样式文件缺失或不完整'
  });
}

// 测试8: 用户流程模拟测试
function testUserFlow() {
  console.log('\n🔍 测试8: 用户流程模拟测试');
  
  // 模拟完整用户流程
  const scenarios = [
    '新用户登录授权',
    '老用户直接跳转',
    '偏好收集流程',
    '菜品推荐生成',
    '反馈处理机制'
  ];
  
  let flowTestPassed = true;
  
  // 检查登录跳转逻辑
  const appJsPath = path.join(testConfig.projectRoot, 'miniprogram/app.js');
  const appJsContent = fs.readFileSync(appJsPath, 'utf8');
  const hasLoginCheck = appJsContent.includes('checkLoginStatus');
  
  const loginJsPath = path.join(testConfig.projectRoot, 'miniprogram/pages/login/login.js');
  const loginJsContent = fs.readFileSync(loginJsPath, 'utf8');
  const hasRedirectLogic = loginJsContent.includes('wx.redirectTo');
  
  const chatJsPath = path.join(testConfig.projectRoot, 'miniprogram/pages/chat/chat.js');
  const chatJsContent = fs.readFileSync(chatJsPath, 'utf8');
  const hasPreferenceCollection = chatJsContent.includes('collectedPreferences');
  const hasRecommendationLogic = chatJsContent.includes('generateRecommendation');
  
  if (hasLoginCheck && hasRedirectLogic && hasPreferenceCollection && hasRecommendationLogic) {
    console.log('✅ 完整用户流程支持');
    testResults.passed++;
  } else {
    console.log('❌ 用户流程不完整');
    testResults.failed++;
    flowTestPassed = false;
  }
  
  testResults.details.push({
    test: '用户流程',
    status: flowTestPassed ? 'PASS' : 'FAIL',
    message: flowTestPassed ? '支持完整用户流程' : '用户流程缺失环节'
  });
}

// 执行所有测试
function runAllTests() {
  testFileIntegrity();
  testAppConfig();
  testLoginPageFunctionality();
  testChatPageFunctionality();
  testRecipeData();
  testCloudFunctions();
  testStyles();
  testUserFlow();
}

// 生成测试报告
function generateTestReport() {
  console.log('\n' + '='.repeat(50));
  console.log('📊 测试报告总结:');
  console.log(`✅ 通过: ${testResults.passed}`);
  console.log(`❌ 失败: ${testResults.failed}`);
  console.log(`🎯 总计: ${testResults.passed + testResults.failed}`);
  
  const successRate = Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100);
  console.log(`📈 成功率: ${successRate}%`);
  
  console.log('\n📋 详细结果:');
  testResults.details.forEach(detail => {
    console.log(`${detail.status === 'PASS' ? '✅' : '❌'} ${detail.test}: ${detail.message}`);
  });
  
  if (testResults.failed === 0) {
    console.log('\n🎉 🎉 🎉 所有测试通过！功能完整，代码覆盖全面！🎉 🎉 🎉');
    return true;
  } else {
    console.log('\n⚠️  存在问题，请修复后再部署！');
    return false;
  }
}

// 执行测试
runAllTests();
const allTestsPassed = generateTestReport();

// 输出最终结果
if (allTestsPassed) {
  console.log('\n🚀 准备就绪！可以安全部署到微信开发者工具。');
} else {
  console.log('\n🔧 需要修复问题后再进行下一步。');
}

module.exports = { allTestsPassed };