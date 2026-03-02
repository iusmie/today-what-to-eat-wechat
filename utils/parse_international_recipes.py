#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
解析 KGKitchen 的国际菜谱数据 (recipe_food.ttl)
转换为简单的 JSON 格式用于微信小程序
"""

import re
import json
from urllib.parse import unquote

def parse_recipe_ttl(file_path):
    """解析 TTL 文件并提取菜谱信息"""
    recipes = {}
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 提取所有 recipe URL 和对应的食材使用信息
    usedby_pattern = r'\[\s+a schema:usedby\s+;\s+schema:amount ([\d\.e\+\-]+)\s+;\s+schema:forfood _:(\d+)\s+;\s+schema:inrecipe _:([^;]+)\s+;'
    
    matches = re.findall(usedby_pattern, content)
    
    # 构建 recipe -> ingredients 映射
    recipe_ingredients = {}
    for amount, food_id, recipe_url in matches:
        recipe_name = extract_recipe_name(recipe_url)
        if recipe_name not in recipe_ingredients:
            recipe_ingredients[recipe_name] = []
        
        # 这里简化处理，只记录食材ID和用量
        recipe_ingredients[recipe_name].append({
            'food_id': food_id,
            'amount': float(amount)
        })
    
    # 提取食材信息
    food_pattern = r'\[\s+a schema:food\s+;\s+schema:price ([\d\.e\+\-]+)\s+;\s+schema:subclass "([^"]*)"\s+;\s+schema:topclass "([^"]*)"\s+;\s+schema:unit "([^"]*)"\s+;\s+schema:unit_price ([\d\.e\+\-]+)\s+;\s+rdf:value "([^"]*)"\^\^xsd:string\s+\.\s+\]'
    
    food_matches = re.findall(food_pattern, content)
    food_info = {}
    for price, subclass, topclass, unit, unit_price, value in food_matches:
        food_id = len(food_info)  # 简单的ID分配
        food_info[str(food_id)] = {
            'name': value,
            'category': subclass,
            'unit': unit,
            'price': float(price),
            'unit_price': float(unit_price)
        }
    
    # 构建完整的菜谱数据
    international_recipes = []
    for recipe_name, ingredients in recipe_ingredients.items():
        # 只选择有多个食材的菜谱（过滤掉太简单的）
        if len(ingredients) >= 3:
            recipe_data = {
                'name': recipe_name,
                'cuisine': detect_cuisine(recipe_name),
                'mealType': detect_meal_type(recipe_name),
                'difficulty': '中等',
                'prepTime': estimate_prep_time(recipe_name),
                'ingredients': [food_info.get(ing['food_id'], {'name': f'ingredient_{ing["food_id"]}'} )['name'] for ing in ingredients[:5]],  # 取前5个食材
                'steps': ['准备食材', '按照菜谱步骤制作', '完成并享用'],
                'description': f'经典的{detect_cuisine(recipe_name)}菜品'
            }
            international_recipes.append(recipe_data)
    
    return international_recipes[:100]  # 限制为100个菜谱以控制大小

def extract_recipe_name(recipe_url):
    """从URL中提取菜谱名称"""
    # URL格式: https---www-allrecipes-com-recipe-12345-recipe-name-
    parts = recipe_url.split('-')
    if len(parts) >= 5:
        # 取最后几个部分作为菜谱名
        name_parts = parts[4:]
        return ' '.join(name_parts).replace('-', ' ').title()
    return recipe_url

def detect_cuisine(recipe_name):
    """根据菜谱名称推测菜系"""
    recipe_lower = recipe_name.lower()
    
    if any(word in recipe_lower for word in ['italian', 'pasta', 'pizza', 'lasagna', 'risotto']):
        return '意大利菜'
    elif any(word in recipe_lower for word in ['mexican', 'taco', 'burrito', 'enchilada', 'guacamole']):
        return '墨西哥菜'
    elif any(word in recipe_lower for word in ['greek', 'gyro', 'souvlaki', 'tzatziki']):
        return '希腊菜'
    elif any(word in recipe_lower for word in ['thai', 'pad thai', 'curry', 'tom yum']):
        return '泰国菜'
    elif any(word in recipe_lower for word in ['indian', 'curry', 'naan', 'tandoori']):
        return '印度菜'
    elif any(word in recipe_lower for word in ['french', 'quiche', 'ratatouille', 'coq au vin']):
        return '法国菜'
    elif any(word in recipe_lower for word in ['spanish', 'paella', 'tapas']):
        return '西班牙菜'
    elif any(word in recipe_lower for word in ['japanese', 'sushi', 'ramen', 'tempura']):
        return '日本料理'
    elif any(word in recipe_lower for word in ['korean', 'kimchi', 'bibimbap', 'bulgogi']):
        return '韩国料理'
    else:
        return '西餐'

def detect_meal_type(recipe_name):
    """根据菜谱名称推测餐时类型"""
    recipe_lower = recipe_name.lower()
    
    if any(word in recipe_lower for word in ['soup', 'stew', 'salad']):
        return '午餐'
    elif any(word in recipe_lower for word in ['dinner', 'main course', 'entree']):
        return '晚餐'
    elif any(word in recipe_lower for word in ['breakfast', 'morning', 'brunch']):
        return '早餐'
    elif any(word in recipe_lower for word in ['dessert', 'cake', 'cookie', 'pie']):
        return '甜品'
    else:
        return '午餐'

def estimate_prep_time(recipe_name):
    """根据菜谱名称估算准备时间"""
    recipe_lower = recipe_name.lower()
    
    if any(word in recipe_lower for word in ['quick', 'easy', 'fast', 'simple']):
        return 20
    elif any(word in recipe_lower for word in ['slow cooker', 'casserole', 'bake']):
        return 60
    elif any(word in recipe_lower for word in ['dessert', 'cake', 'cookie']):
        return 45
    else:
        return 35

if __name__ == '__main__':
    # 解析国际菜谱数据
    international_recipes = parse_recipe_ttl('international-recipes-kg/recipe_food.ttl')
    
    # 创建输出目录
    import os
    os.makedirs('projects/today-what-to-eat-wechat/miniprogram/utils', exist_ok=True)
    
    # 保存为JSON文件
    with open('projects/today-what-to-eat-wechat/miniprogram/utils/internationalRecipes.json', 'w', encoding='utf-8') as f:
        json.dump(international_recipes, f, ensure_ascii=False, indent=2)
    
    print(f"成功解析 {len(international_recipes)} 个国际菜谱")
    print("已保存到: projects/today-what-to-eat-wechat/miniprogram/utils/internationalRecipes.json")