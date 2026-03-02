// 外卖平台配置
const deliveryPlatforms = {
  // 国内平台
  taobaoFlash: {
    id: 'taobao_flash',
    name: '淘宝闪购',
    icon: 'taobao',
    supportedRegions: ['cn'],
    apiEndpoint: 'https://flash.taobao.com/api',
    requiresAuth: true,
    minOrderAmount: 20,
    deliveryTime: '30-60分钟'
  },
  
  // 海外平台
  uberEats: {
    id: 'uber_eats',
    name: 'Uber Eats',
    icon: 'uber',
    supportedRegions: ['us', 'ca', 'uk', 'au', 'fr', 'de', 'jp'],
    apiEndpoint: 'https://api.uber.com/v1/eats',
    requiresAuth: false,
    minOrderAmount: 15,
    deliveryTime: '20-45分钟'
  },
  
  doorDash: {
    id: 'door_dash',
    name: 'DoorDash',
    icon: 'doordash',
    supportedRegions: ['us', 'ca'],
    apiEndpoint: 'https://api.doordash.com/v2',
    requiresAuth: false,
    minOrderAmount: 12,
    deliveryTime: '25-50分钟'
  },
  
  deliveroo: {
    id: 'deliveroo',
    name: 'Deliveroo',
    icon: 'deliveroo',
    supportedRegions: ['uk', 'fr', 'de', 'nl', 'be', 'ie', 'it', 'es'],
    apiEndpoint: 'https://api.deliveroo.net/v1',
    requiresAuth: false,
    minOrderAmount: 10,
    deliveryTime: '20-40分钟'
  },
  
  foodpanda: {
    id: 'foodpanda',
    name: 'Foodpanda',
    icon: 'foodpanda',
    supportedRegions: ['sg', 'hk', 'tw', 'my', 'th', 'ph', 'id', 'vn'],
    apiEndpoint: 'https://api.foodpanda.com/v1',
    requiresAuth: false,
    minOrderAmount: 8,
    deliveryTime: '25-55分钟'
  }
};

// 根据用户位置获取可用的外卖平台
function getAvailablePlatforms(userLocation) {
  const available = [];
  const region = userLocation.country || 'cn'; // 默认中国
  
  for (const [platformId, platform] of Object.entries(deliveryPlatforms)) {
    if (platform.supportedRegions.includes(region)) {
      available.push({
        ...platform,
        isActive: true
      });
    }
  }
  
  return available;
}

// 获取推荐的外卖平台（基于用户偏好和位置）
function getRecommendedPlatform(userPreferences, userLocation) {
  const available = getAvailablePlatforms(userLocation);
  if (available.length === 0) return null;
  
  // 优先选择用户偏好的平台
  if (userPreferences.preferredDeliveryPlatform) {
    const preferred = available.find(p => p.id === userPreferences.preferredDeliveryPlatform);
    if (preferred) return preferred;
  }
  
  // 默认返回第一个可用平台
  return available[0];
}

module.exports = {
  deliveryPlatforms,
  getAvailablePlatforms,
  getRecommendedPlatform
};