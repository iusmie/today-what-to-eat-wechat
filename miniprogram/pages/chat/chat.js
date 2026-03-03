// pages/chat/chat.js
const recipeData = require('../../utils/recipeData.js');

Page({
  data: {
    messages: [],
    inputText: '',
    isTyping: false,
    conversationState: 'greeting', // greeting, collecting_preferences, recommending, feedback
    collectedPreferences: {
      cuisines: [],
      mealTypes: [],
      dietaryRestrictions: [],
      healthConditions: [],
      maxPrepTime: 60,
      difficultyLevel: '中等',
      cookingPreference: '自己做' // '自己做', '外卖', '工作日外卖'
    },
    currentRecommendation: null,
    lastMessageId: '',
    showQuickReplies: true
  },

  onLoad() {
    // 初始化对话
    this.addBotMessage('你好！我是你的美食推荐助手。让我帮你解决"今天吃什么"的难题吧！');
    this.addBotMessage('首先，我想了解一下你的饮食偏好。你有什么特别喜欢的菜系吗？比如中餐、西餐、日料等？');
  },

  onInput(e) {
    this.setData({
      inputText: e.detail.value
    });
  },

  sendMessage() {
    const userMessage = this.data.inputText.trim();
    if (!userMessage) return;

    // 添加用户消息
    this.addUserMessage(userMessage);
    this.setData({ 
      inputText: '', 
      isTyping: true,
      showQuickReplies: false
    });

    // 处理用户输入并生成AI响应
    setTimeout(() => {
      this.processUserInput(userMessage);
    }, 1000);
  },

  selectQuickReply(e) {
    const reply = e.currentTarget.dataset.reply;
    this.setData({
      inputText: reply,
      showQuickReplies: false
    });
    // 自动发送
    setTimeout(() => {
      this.sendMessage();
    }, 300);
  },

  addUserMessage(text) {
    const messages = this.data.messages;
    const messageId = 'msg-' + messages.length;
    messages.push({
      type: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString()
    });
    this.setData({ 
      messages: messages,
      lastMessageId: messageId
    });
    this.scrollToBottom();
  },

  addBotMessage(text) {
    const messages = this.data.messages;
    const messageId = 'msg-' + messages.length;
    messages.push({
      type: 'bot',
      text: text,
      timestamp: new Date().toLocaleTimeString()
    });
    this.setData({ 
      messages: messages,
      lastMessageId: messageId
    });
    this.scrollToBottom();
  },

  scrollToBottom() {
    wx.pageScrollTo({
      scrollTop: 100000,
      duration: 100
    });
  },

  onScrollBottom() {
    // 滚动到底部时的处理
  },

  processUserInput(userInput) {
    const state = this.data.conversationState;
    
    switch (state) {
      case 'greeting':
        this.handleCuisinePreference(userInput);
        break;
      case 'collecting_cuisines':
        this.handleMealTypePreference(userInput);
        break;
      case 'collecting_meal_types':
        this.handleDietaryRestrictions(userInput);
        break;
      case 'collecting_restrictions':
        this.handleHealthConditions(userInput);
        break;
      case 'collecting_health':
        this.handlePrepTimePreference(userInput);
        break;
      case 'collecting_prep_time':
        this.handleDifficultyPreference(userInput);
        break;
      case 'collecting_difficulty':
        this.handleCookingPreference(userInput);
        break;
      case 'collecting_cooking_preference':
        this.generateRecommendation();
        break;
      case 'recommending':
        this.handleFeedback(userInput);
        break;
      default:
        this.addBotMessage('抱歉，我可能需要重新开始。让我们从头来过吧！');
        this.resetConversation();
    }
    
    this.setData({ isTyping: false });
  },

  handleCuisinePreference(userInput) {
    // 简单解析用户输入的菜系偏好
    const cuisines = ['中餐', '西餐', '日料', '韩餐', '泰餐', '意大利菜', '墨西哥菜', '印度菜', '法国菜', '希腊菜', '快餐', '素食', '甜品', '饮品'];
    const userCuisines = [];
    
    cuisines.forEach(cuisine => {
      if (userInput.includes(cuisine)) {
        userCuisines.push(cuisine);
      }
    });
    
    if (userCuisines.length === 0) {
      // 如果没有明确提到，假设用户接受所有菜系
      userCuisines.push('中餐'); // 默认中餐，因为我们有丰富的中式菜谱数据
    }
    
    const prefs = this.data.collectedPreferences;
    prefs.cuisines = userCuisines;
    this.setData({ 
      collectedPreferences: prefs,
      conversationState: 'collecting_cuisines'
    });
    
    this.addBotMessage(`好的！你喜欢 ${userCuisines.join('、')}。那么你通常在什么时间需要推荐呢？比如早餐、午餐、晚餐还是夜宵？`);
  },

  handleMealTypePreference(userInput) {
    const mealTypes = ['早餐', '午餐', '晚餐', '夜宵'];
    const userMealTypes = [];
    
    mealTypes.forEach(mealType => {
      if (userInput.includes(mealType)) {
        userMealTypes.push(mealType);
      }
    });
    
    if (userMealTypes.length === 0) {
      userMealTypes.push('午餐', '晚餐'); // 默认午餐和晚餐
    }
    
    const prefs = this.data.collectedPreferences;
    prefs.mealTypes = userMealTypes;
    this.setData({ 
      collectedPreferences: prefs,
      conversationState: 'collecting_meal_types'
    });
    
    this.addBotMessage(`明白了！你在 ${userMealTypes.join('、')} 时需要推荐。你有什么饮食禁忌或过敏吗？比如不吃辣、不吃海鲜、素食等？`);
  },

  handleDietaryRestrictions(userInput) {
    const restrictions = [];
    const restrictionKeywords = ['辣', '海鲜', '肉', '素', '糖', '乳', '蛋', '坚果'];
    
    restrictionKeywords.forEach(keyword => {
      if (userInput.includes(keyword)) {
        restrictions.push(keyword);
      }
    });
    
    const prefs = this.data.collectedPreferences;
    prefs.dietaryRestrictions = restrictions;
    this.setData({ 
      collectedPreferences: prefs,
      conversationState: 'collecting_restrictions'
    });
    
    this.addBotMessage(restrictions.length > 0 ? 
      `记下了！你会避免 ${restrictions.join('、')}。你有特殊的健康状况需要考虑吗？比如糖尿病、高血压等？` :
      '好的！没有特别的饮食禁忌。你有特殊的健康状况需要考虑吗？比如糖尿病、高血压等？'
    );
  },

  handleHealthConditions(userInput) {
    const conditions = [];
    const conditionKeywords = ['糖尿', '高血压', '高血脂', '减肥', '健身', '孕妇'];
    
    conditionKeywords.forEach(keyword => {
      if (userInput.includes(keyword)) {
        conditions.push(keyword);
      }
    });
    
    const prefs = this.data.collectedPreferences;
    prefs.healthConditions = conditions;
    this.setData({ 
      collectedPreferences: prefs,
      conversationState: 'collecting_health'
    });
    
    this.addBotMessage(conditions.length > 0 ? 
      `了解了！会考虑你的健康需求。你希望菜品的准备时间不超过多少分钟呢？` :
      '好的！没有特殊健康需求。你希望菜品的准备时间不超过多少分钟呢？'
    );
  },

  handlePrepTimePreference(userInput) {
    let prepTime = 60; // 默认60分钟
    
    // 尝试从用户输入中提取数字
    const timeMatch = userInput.match(/(\d+)/);
    if (timeMatch) {
      prepTime = parseInt(timeMatch[1]);
      if (prepTime < 10) prepTime = 10;
      if (prepTime > 180) prepTime = 180;
    }
    
    const prefs = this.data.collectedPreferences;
    prefs.maxPrepTime = prepTime;
    this.setData({ 
      collectedPreferences: prefs,
      conversationState: 'collecting_prep_time'
    });
    
    this.addBotMessage(`好的！准备时间不超过 ${prepTime} 分钟。你希望菜品的难度是简单、中等还是困难呢？`);
  },

  handleDifficultyPreference(userInput) {
    let difficulty = '中等';
    if (userInput.includes('简单') || userInput.includes('容易')) {
      difficulty = '简单';
    } else if (userInput.includes('困难') || userInput.includes('复杂')) {
      difficulty = '困难';
    }
    
    const prefs = this.data.collectedPreferences;
    prefs.difficultyLevel = difficulty;
    this.setData({ 
      collectedPreferences: prefs,
      conversationState: 'collecting_cooking_preference'
    });
    
    this.addBotMessage(`好的！难度设置为${difficulty}。你更倾向于哪种用餐方式呢？\n选项：外卖、自己做、工作日外卖`);
  },

  handleCookingPreference(userInput) {
    let cookingPref = '自己做';
    if (userInput.includes('外卖') && !userInput.includes('工作日')) {
      cookingPref = '外卖';
    } else if (userInput.includes('工作日') && userInput.includes('外卖')) {
      cookingPref = '工作日外卖';
    } else if (userInput.includes('自己')) {
      cookingPref = '自己做';
    }
    
    const prefs = this.data.collectedPreferences;
    prefs.cookingPreference = cookingPref;
    this.setData({ 
      collectedPreferences: prefs,
      conversationState: 'collecting_cooking_preference_done'
    });
    
    this.addBotMessage(`明白了！你的用餐偏好是：${cookingPref}。现在让我为你推荐一个合适的菜品...`);
    
    // 延迟一下再生成推荐，给用户时间看到消息
    setTimeout(() => {
      this.generateRecommendation();
    }, 1500);
  },

  generateRecommendation() {
    // 使用真实的菜谱数据进行推荐
    const allRecipes = recipeData.getRecipeList();
    const prefs = this.data.collectedPreferences;
    
    // 简单的过滤逻辑
    let filteredRecipes = allRecipes.filter(recipe => {
      // 检查菜系（我们主要支持中餐）
      if (!prefs.cuisines.includes('中餐') && !prefs.cuisines.includes('中餐')) {
        return false;
      }
      
      // 检查准备时间
      if (recipe.prepTime > prefs.maxPrepTime) {
        return false;
      }
      
      // 检查难度（简化处理）
      const difficultyMap = { '简单': 1, '中等': 2, '困难': 3 };
      const recipeDifficulty = recipe.difficulty || '中等';
      if (difficultyMap[recipeDifficulty] > difficultyMap[prefs.difficultyLevel]) {
        return false;
      }
      
      // 检查忌口
      const hasRestriction = prefs.dietaryRestrictions.some(restriction => {
        return recipe.ingredients.some(ingredient => 
          ingredient.includes(restriction)
        );
      });
      if (hasRestriction) {
        return false;
      }
      
      return true;
    });
    
    if (filteredRecipes.length === 0) {
      filteredRecipes = allRecipes.slice(0, 10); // 如果没有匹配，返回前10个
    }
    
    const recommendation = filteredRecipes[Math.floor(Math.random() * filteredRecipes.length)];
    
    let recommendationText = `🍽️ 为你推荐：${recommendation.name}\n`;
    if (recommendation.category) {
      recommendationText += `菜系：${recommendation.category}\n`;
    }
    if (recommendation.prepTime) {
      recommendationText += `准备时间：${recommendation.prepTime}分钟\n`;
    }
    if (recommendation.difficulty) {
      recommendationText += `难度：${recommendation.difficulty}\n`;
    }
    if (recommendation.ingredients && recommendation.ingredients.length > 0) {
      recommendationText += `主要食材：${recommendation.ingredients.slice(0, 3).join('、')}\n`;
    }
    if (recommendation.steps && recommendation.steps.length > 0) {
      recommendationText += `\n制作步骤概览：\n${recommendation.steps.slice(0, 2).map((step, i) => `${i + 1}. ${step}`).join('\n')}`;
      if (recommendation.steps.length > 2) {
        recommendationText += `\n...（共${recommendation.steps.length}步）`;
      }
    }
    
    recommendationText += `\n\n你觉得这个推荐怎么样？喜欢/不喜欢？`;
    
    this.addBotMessage(recommendationText);
    this.setData({ 
      conversationState: 'recommending',
      currentRecommendation: recommendation
    });
    
    // 保存用户偏好到云数据库
    this.saveUserPreferences();
  },

  saveUserPreferences() {
    const app = getApp();
    app.globalData.userPreferences = this.data.collectedPreferences;
    
    // 保存到云数据库（需要用户授权）
    // 这里暂时注释掉，因为需要配置云开发环境
    /*
    wx.cloud.callFunction({
      name: 'saveUserPreferences',
      data: {
        preferences: this.data.collectedPreferences
      },
      success: res => {
        console.log('用户偏好保存成功', res);
      },
      fail: err => {
        console.error('用户偏好保存失败', err);
      }
    });
    */
  },

  handleFeedback(userInput) {
    if (userInput.includes('喜欢') || userInput.includes('好') || userInput.includes('可以')) {
      this.addBotMessage('太好了！我会记住你的喜好。下次可以继续找我推荐哦！😊');
    } else {
      this.addBotMessage('抱歉这次推荐不够满意。让我重新为你推荐一个...');
      this.generateRecommendation();
      return;
    }
    
    // 重置对话状态，准备下一次交互
    setTimeout(() => {
      this.addBotMessage('你还可以：\n1. 点击"我的偏好"修改设置\n2. 查看"推荐历史"\n3. 再次点击"开始对话"获取新推荐');
      this.setData({ showQuickReplies: true });
    }, 2000);
  },

  resetConversation() {
    this.setData({
      messages: [],
      conversationState: 'greeting',
      collectedPreferences: {
        cuisines: [],
        mealTypes: [],
        dietaryRestrictions: [],
        healthConditions: [],
        maxPrepTime: 60,
        difficultyLevel: '中等',
        cookingPreference: '自己做'
      },
      currentRecommendation: null,
      showQuickReplies: true
    });
    this.onLoad();
  }
});