// 云函数：跳转到外卖平台
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const { platform, location, cuisine } = event
  
  // 根据平台类型返回对应的跳转URL或小程序路径
  const platformConfig = {
    'taobao': {
      name: '淘宝闪购',
      url: `https://h5.m.taobao.com/app/food-delivery?location=${encodeURIComponent(location)}&cuisine=${encodeURIComponent(cuisine)}`
    },
    'meituan': {
      name: '美团外卖',
      url: `https://waimai.meituan.com/home?lat=${location.lat}&lng=${location.lng}&keyword=${encodeURIComponent(cuisine)}`
    },
    'eleme': {
      name: '饿了么',
      url: `https://h5.ele.me/home/?latitude=${location.lat}&longitude=${location.lng}&keyword=${encodeURIComponent(cuisine)}`
    },
    'ubereats': {
      name: 'Uber Eats',
      url: `https://www.ubereats.com/search?placeId=${location.placeId}&q=${encodeURIComponent(cuisine)}`
    },
    'doordash': {
      name: 'DoorDash',
      url: `https://www.doordash.com/en-US/store-search?address=${encodeURIComponent(location.address)}&city=${location.city}&query=${encodeURIComponent(cuisine)}`
    },
    'deliveroo': {
      name: 'Deliveroo',
      url: `https://deliveroo.co.uk/menu/${location.postcode}?keyword=${encodeURIComponent(cuisine)}`
    }
  }
  
  if (platformConfig[platform]) {
    return {
      success: true,
      platform: platformConfig[platform].name,
      url: platformConfig[platform].url
    }
  } else {
    return {
      success: false,
      message: '不支持的外卖平台'
    }
  }
}
