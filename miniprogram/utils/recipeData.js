// 简化版菜谱数据 - 从CookBook-KG提取的核心数据
const recipeData = {
  recipes: [
    {
      id: 1,
      name: "番茄炒蛋",
      cuisine: "中餐",
      mealType: "午餐",
      difficulty: "简单",
      prepTime: 15,
      ingredients: ["番茄", "鸡蛋", "盐", "糖", "油"],
      steps: ["1. 番茄切块，鸡蛋打散", "2. 热锅加油，先炒鸡蛋至半熟", "3. 加入番茄翻炒", "4. 加盐糖调味，炒至番茄出汁"],
      description: "经典的家常菜，酸甜可口，营养丰富",
      cookingMethod: "自己做"
    },
    {
      id: 2,
      name: "宫保鸡丁",
      cuisine: "中餐",
      mealType: "晚餐",
      difficulty: "中等",
      prepTime: 25,
      ingredients: ["鸡胸肉", "花生", "干辣椒", "花椒", "葱姜蒜", "酱油", "醋", "糖"],
      steps: ["1. 鸡胸肉切丁腌制", "2. 花生炒香备用", "3. 爆香干辣椒和花椒", "4. 炒鸡丁，加入调料", "5. 最后加入花生翻炒均匀"],
      description: "川菜经典，麻辣鲜香，口感丰富",
      cookingMethod: "自己做"
    },
    {
      id: 3,
      name: "意大利面",
      cuisine: "西餐",
      mealType: "晚餐",
      difficulty: "简单",
      prepTime: 20,
      ingredients: ["意大利面", "番茄酱", "洋葱", "大蒜", "橄榄油", "盐", "黑胡椒"],
      steps: ["1. 意大利面煮熟", "2. 热锅加橄榄油，炒香洋葱大蒜", "3. 加入番茄酱煮开", "4. 拌入煮好的意面", "5. 加盐和黑胡椒调味"],
      description: "简单美味的西式主食，适合快速晚餐",
      cookingMethod: "自己做"
    },
    {
      id: 4,
      name: "蔬菜沙拉",
      cuisine: "素食",
      mealType: "午餐",
      difficulty: "简单",
      prepTime: 10,
      ingredients: ["生菜", "黄瓜", "番茄", "胡萝卜", "橄榄油", "柠檬汁", "盐"],
      steps: ["1. 所有蔬菜洗净切块", "2. 混合在一起", "3. 加入橄榄油和柠檬汁", "4. 撒盐拌匀即可"],
      description: "健康轻食，低卡路里，富含维生素",
      cookingMethod: "自己做"
    },
    {
      id: 5,
      name: "红烧肉",
      cuisine: "中餐",
      mealType: "晚餐",
      difficulty: "中等",
      prepTime: 60,
      ingredients: ["五花肉", "冰糖", "酱油", "料酒", "八角", "桂皮", "姜", "葱"],
      steps: ["1. 五花肉切块焯水", "2. 炒糖色", "3. 加入肉块翻炒上色", "4. 加入调料和水", "5. 小火慢炖至软烂"],
      description: "经典中式硬菜，色泽红亮，肥而不腻",
      cookingMethod: "自己做"
    },
    {
      id: 6,
      name: "鱼香肉丝",
      cuisine: "中餐",
      mealType: "午餐",
      difficulty: "中等",
      prepTime: 20,
      ingredients: ["猪里脊", "木耳", "胡萝卜", "青椒", "豆瓣酱", "醋", "糖", "酱油"],
      steps: ["1. 里脊肉切丝腌制", "2. 配菜切丝", "3. 爆香豆瓣酱", "4. 炒肉丝至变色", "5. 加入配菜和调料翻炒"],
      description: "川菜代表，鱼香味型，酸甜微辣",
      cookingMethod: "自己做"
    },
    {
      id: 7,
      name: "可乐鸡翅",
      cuisine: "中餐",
      mealType: "晚餐",
      difficulty: "简单",
      prepTime: 30,
      ingredients: ["鸡翅", "可乐", "酱油", "姜", "葱", "料酒"],
      steps: ["1. 鸡翅洗净划刀", "2. 焯水去腥", "3. 煎至两面金黄", "4. 加入可乐和调料", "5. 小火收汁"],
      description: "家常快手菜，甜咸适口，深受孩子喜爱",
      cookingMethod: "自己做"
    },
    {
      id: 8,
      name: "麻婆豆腐",
      cuisine: "中餐",
      mealType: "午餐",
      difficulty: "中等",
      prepTime: 20,
      ingredients: ["豆腐", "牛肉末", "豆瓣酱", "花椒", "辣椒粉", "葱姜蒜", "酱油"],
      steps: ["1. 豆腐切块焯水", "2. 爆香花椒和豆瓣酱", "3. 炒牛肉末", "4. 加入豆腐和调料", "5. 勾芡收汁"],
      description: "川菜经典，麻辣鲜香，豆腐嫩滑",
      cookingMethod: "自己做"
    },
    {
      id: 9,
      name: "黄焖鸡米饭",
      cuisine: "中餐",
      mealType: "午餐",
      difficulty: "外卖",
      prepTime: 0,
      ingredients: ["鸡肉", "土豆", "青椒", "香菇", "米饭"],
      steps: ["外卖配送"],
      description: "经典外卖菜品，汤汁浓郁，配米饭绝佳",
      cookingMethod: "外卖"
    },
    {
      id: 10,
      name: "麻辣香锅",
      cuisine: "中餐",
      mealType: "晚餐",
      difficulty: "外卖",
      prepTime: 0,
      ingredients: ["各种蔬菜", "肉类", "豆制品", "麻辣调料"],
      steps: ["外卖配送"],
      description: "重口味外卖首选，食材丰富，麻辣过瘾",
      cookingMethod: "外卖"
    },
    // 国际菜谱
    {
      id: 11,
      name: "意大利肉酱面",
      cuisine: "意大利菜",
      mealType: "晚餐",
      difficulty: "中等",
      prepTime: 45,
      ingredients: ["意大利面", "牛肉末", "番茄酱", "洋葱", "大蒜", "橄榄油", "罗勒叶"],
      steps: ["1. 煮意大利面至al dente", "2. 炒香洋葱大蒜，加入牛肉末炒熟", "3. 加入番茄酱和香料炖煮20分钟", "4. 拌入煮好的意面", "5. 撒上帕尔马干酪和罗勒叶"],
      description: "经典的意大利主食，浓郁的肉酱搭配弹牙的意面",
      cookingMethod: "自己做"
    },
    {
      id: 12,
      name: "墨西哥卷饼",
      cuisine: "墨西哥菜",
      mealType: "午餐",
      difficulty: "简单",
      prepTime: 25,
      ingredients: ["玉米饼", "牛肉末", "生菜", "番茄", "洋葱", "芝士", "酸奶油", "牛油果"],
      steps: ["1. 炒熟牛肉末并调味", "2. 准备各种配菜切丝", "3. 加热玉米饼", "4. 在饼上铺牛肉和配菜", "5. 卷起即可享用"],
      description: "色彩缤纷的墨西哥街头美食，口感丰富多样",
      cookingMethod: "自己做"
    },
    {
      id: 13,
      name: "希腊烤肉卷",
      cuisine: "希腊菜",
      mealType: "午餐",
      difficulty: "中等",
      prepTime: 35,
      ingredients: ["羊肉", "酸奶", "柠檬汁", "大蒜", "皮塔饼", "黄瓜", "番茄", "红洋葱"],
      steps: ["1. 羊肉用酸奶、柠檬汁、大蒜腌制", "2. 烤制羊肉至外焦里嫩", "3. 切碎配菜制作希腊沙拉", "4. 将羊肉和沙拉包入皮塔饼", "5. 淋上特制酱汁"],
      description: "地中海风味的经典美食，酸甜清爽的配菜平衡了烤肉的油腻",
      cookingMethod: "自己做"
    },
    {
      id: 14,
      name: "泰式冬阴功汤",
      cuisine: "泰国菜",
      mealType: "午餐",
      difficulty: "困难",
      prepTime: 50,
      ingredients: ["虾", "香茅", "柠檬叶", "辣椒", "椰奶", "鱼露", "蘑菇", "番茄"],
      steps: ["1. 准备香茅、柠檬叶、辣椒等香料", "2. 煮开高汤，加入香料炖煮", "3. 加入虾和蘑菇煮熟", "4. 倒入椰奶和鱼露调味", "5. 挤入青柠汁完成"],
      description: "泰国国汤，酸辣鲜香，椰奶的甜味平衡了辣椒的刺激",
      cookingMethod: "自己做"
    },
    {
      id: 15,
      name: "印度咖喱鸡",
      cuisine: "印度菜",
      mealType: "晚餐",
      difficulty: "中等",
      prepTime: 40,
      ingredients: ["鸡肉", "洋葱", "番茄", "姜蒜", "咖喱粉", "孜然", "香菜", "酸奶"],
      steps: ["1. 鸡肉用酸奶和香料腌制", "2. 炒香洋葱、姜蒜", "3. 加入番茄和香料炒成酱", "4. 加入鸡肉炖煮至入味", "5. 撒上香菜装饰"],
      description: "浓郁的印度香料与嫩滑鸡肉的完美结合",
      cookingMethod: "自己做"
    },
    {
      id: 16,
      name: "法式洋葱汤",
      cuisine: "法国菜",
      mealType: "午餐",
      difficulty: "中等",
      prepTime: 60,
      ingredients: ["洋葱", "黄油", "面粉", "牛肉高汤", "白葡萄酒", "法棍", "格鲁耶尔芝士"],
      steps: ["1. 洋葱用黄油慢炒至焦糖色", "2. 加入面粉炒匀", "3. 倒入高汤和白葡萄酒炖煮", "4. 将汤倒入烤碗，放上法棍片", "5. 撒上芝士烤至金黄"],
      description: "经典的法式汤品，焦糖洋葱的甜味与芝士的浓郁相得益彰",
      cookingMethod: "自己做"
    },
    {
      id: 17,
      name: "西班牙海鲜饭",
      cuisine: "西班牙菜",
      mealType: "晚餐",
      difficulty: "困难",
      prepTime: 70,
      ingredients: ["短粒米", "虾", "青口贝", "鱿鱼", "藏红花", "番茄", "青豆", "柠檬"],
      steps: ["1. 准备海鲜并处理干净", "2. 炒香洋葱、番茄，加入藏红花", "3. 加入米翻炒，倒入高汤", "4. 铺上海鲜，小火焖煮", "5. 挤上柠檬汁，撒上欧芹"],
      description: "西班牙国菜，藏红花赋予米饭独特的金黄色和香气",
      cookingMethod: "自己做"
    },
    {
      id: 18,
      name: "日式照烧鸡排",
      cuisine: "日本料理",
      mealType: "晚餐",
      difficulty: "简单",
      prepTime: 30,
      ingredients: ["鸡腿肉", "酱油", "味醂", "清酒", "糖", "芝麻", "米饭", "西兰花"],
      steps: ["1. 鸡腿去骨，用刀背拍松", "2. 调制照烧酱（酱油、味醂、清酒、糖）", "3. 煎鸡排至两面金黄", "4. 倒入照烧酱收汁", "5. 切片配米饭和蔬菜"],
      description: "甜咸适中的日式经典，照烧酱汁光亮诱人",
      cookingMethod: "自己做"
    },
    {
      id: 19,
      name: "韩式石锅拌饭",
      cuisine: "韩国料理",
      mealType: "午餐",
      difficulty: "中等",
      prepTime: 45,
      ingredients: ["米饭", "牛肉", "菠菜", "豆芽", "胡萝卜", "香菇", "鸡蛋", "韩式辣酱"],
      steps: ["1. 分别炒制各种配菜", "2. 牛肉用酱油腌制后炒熟", "3. 石锅加热，涂上香油", "4. 底部放米饭，上面摆配菜", "5. 中间放生鸡蛋，淋上辣酱"],
      description: "韩国代表性料理，热石锅让底部米饭形成香脆锅巴",
      cookingMethod: "自己做"
    },
    {
      id: 20,
      name: "披萨外卖",
      cuisine: "西餐",
      mealType: "晚餐",
      difficulty: "外卖",
      prepTime: 0,
      ingredients: ["披萨饼底", "番茄酱", "芝士", "各种配料"],
      steps: ["外卖配送"],
      description: "经典的西式外卖，芝士拉丝，配料丰富",
      cookingMethod: "外卖"
    },
    {
      id: 21,
      name: "汉堡套餐",
      cuisine: "西餐",
      mealType: "午餐",
      difficulty: "外卖",
      prepTime: 0,
      ingredients: ["汉堡面包", "牛肉饼", "生菜", "番茄", "芝士", "薯条", "可乐"],
      steps: ["外卖配送"],
      description: "美式快餐代表，搭配薯条和饮料的完整套餐",
      cookingMethod: "外卖"
    }
  ],
  
  getRecipeList: function() {
    return this.recipes;
  },
  
  // 根据用户偏好筛选推荐
  getRecommendations: function(preferences) {
    let filtered = this.recipes.filter(recipe => {
      // 菜系匹配
      if (preferences.cuisines.length > 0 && !preferences.cuisines.includes(recipe.cuisine)) {
        return false;
      }
      
      // 餐时匹配
      if (preferences.mealTypes.length > 0 && !preferences.mealTypes.includes(recipe.mealType)) {
        return false;
      }
      
      // 烹饪方式匹配
      if (preferences.cookingPreference === '外卖' && recipe.cookingMethod !== '外卖') {
        return false;
      }
      if (preferences.cookingPreference === '自己做' && recipe.cookingMethod !== '自己做') {
        return false;
      }
      if (preferences.cookingPreference === '工作日外卖' && recipe.cookingMethod !== '外卖') {
        return false;
      }
      
      // 准备时间（仅对"自己做"的菜品检查）
      if (preferences.cookingPreference === '自己做' && recipe.prepTime > preferences.maxPrepTime) {
        return false;
      }
      
      // 难度匹配（仅对"自己做"的菜品检查）
      if (preferences.cookingPreference === '自己做') {
        const difficultyMap = { '简单': 1, '中等': 2, '困难': 3 };
        const userDifficulty = difficultyMap[preferences.difficultyLevel] || 2;
        const recipeDifficulty = difficultyMap[recipe.difficulty] || 2;
        if (recipeDifficulty > userDifficulty + 1) {
          return false;
        }
      }
      
      // 忌口检查
      if (preferences.dietaryRestrictions.length > 0) {
        for (let restriction of preferences.dietaryRestrictions) {
          if (restriction === '肉' && recipe.ingredients.some(ing => ing.includes('肉') || ing.includes('鸡') || ing.includes('牛') || ing.includes('猪'))) {
            return false;
          }
          if (restriction === '辣' && (recipe.name.includes('辣') || recipe.ingredients.some(ing => ing.includes('辣椒') || ing.includes('花椒') || ing.includes('豆瓣酱')))) {
            return false;
          }
          if (restriction === '海鲜' && recipe.ingredients.some(ing => ing.includes('鱼') || ing.includes('虾') || ing.includes('蟹'))) {
            return false;
          }
        }
      }
      
      return true;
    });
    
    // 如果没有匹配的，返回所有
    if (filtered.length === 0) {
      filtered = this.recipes;
    }
    
    // 随机选择一个
    return filtered[Math.floor(Math.random() * filtered.length)];
  }
};

module.exports = recipeData;