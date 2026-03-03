const fs = require('fs');
const path = require('path');

console.log('检查登录功能修复状态...\n');

const projectRoot = '/home/admin/.openclaw/workspace/projects/today-what-to-eat-wechat';
const filesToCheck = [
  'cloudfunctions/checkUserExists/index.js',
  'cloudfunctions/saveUserInfo/index.js',
  'miniprogram/pages/login/login.js',
  'miniprogram/pages/login/login.wxml',
  'miniprogram/app.json'
];

let allGood = true;

filesToCheck.forEach(file => {
  const fullPath = path.join(projectRoot, file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file} - 存在`);
  } else {
    console.log(`❌ ${file} - 不存在`);
    allGood = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allGood) {
  console.log('✅ 所有必需文件都已存在，修复完成！');
  console.log('请在微信开发者工具中：');
  console.log('1. 右键 cloudfunctions 文件夹 -> 上传所有云函数');
  console.log('2. 编译并运行小程序');
  console.log('3. 测试登录功能');
} else {
  console.log('⚠️  仍有文件缺失，请检查修复过程。');
}