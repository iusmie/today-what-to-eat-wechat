// 测试登录功能修复
const fs = require('fs');
const path = require('path');

// 检查关键文件是否存在
const projectRoot = './projects/today-what-to-eat-wechat';
const filesToCheck = [
  'cloudfunctions/checkUserExists/index.js',
  'cloudfunctions/saveUserInfo/index.js',
  'miniprogram/pages/login/login.js',
  'miniprogram/pages/login/login.wxml',
  'miniprogram/app.json'
];

console.log('检查登录功能修复状态...\n');

let allFilesExist = true;
filesToCheck.forEach(file => {
  const fullPath = path.join(projectRoot, file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file} - 存在`);
  } else {
    console.log(`❌ ${file} - 不存在`);
    allFilesExist = false;
  }
});

// 检查app.json中的页面配置
const appJsonPath = path.join(projectRoot, 'miniprogram/app.json');
if (fs.existsSync(appJsonPath)) {
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  if (appJson.pages && appJson.pages.includes('pages/login/login')) {
    console.log('✅ app.json - 登录页面已正确配置');
  } else {
    console.log('❌ app.json - 登录页面未正确配置');
    allFilesExist = false;
  }
}

console.log('\n' + '='.repeat(50));
if (allFilesExist) {
  console.log('🎉 所有必要的文件都已存在，登录功能应该可以正常工作！');
  console.log('请在微信开发者工具中重新编译项目并测试。');
} else {
  console.log('⚠️  仍有文件缺失，请检查修复过程。');
}