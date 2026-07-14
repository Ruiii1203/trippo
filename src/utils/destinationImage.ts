const destinationImages: Record<string, string> = {
  '东京': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
  '日本东京': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
  '京都': 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
  '日本京都': 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
  '大阪': 'https://images.unsplash.com/photo-1605348532353-d37499826965?w=800&q=80',
  '日本大阪': 'https://images.unsplash.com/photo-1605348532353-d37499826965?w=800&q=80',
  '北海道': 'https://images.unsplash.com/photo-1545081645-64350e075b42?w=800&q=80',
  '日本北海道': 'https://images.unsplash.com/photo-1545081645-64350e075b42?w=800&q=80',
  '冲绳': 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800&q=80',
  '日本冲绳': 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800&q=80',
  '首尔': 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=800&q=80',
  '韩国首尔': 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=800&q=80',
  '济州岛': 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80',
  '韩国济州岛': 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80',
  '巴黎': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
  '法国巴黎': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
  '伦敦': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
  '英国伦敦': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
  '罗马': 'https://images.unsplash.com/photo-1515549832467-8783363e19b5?w=800&q=80',
  '意大利罗马': 'https://images.unsplash.com/photo-1515549832467-8783363e19b5?w=800&q=80',
  '威尼斯': 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800&q=80',
  '意大利威尼斯': 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800&q=80',
  '巴塞罗那': 'https://images.unsplash.com/photo-1543364216-d18d8089f7d3?w=800&q=80',
  '西班牙巴塞罗那': 'https://images.unsplash.com/photo-1543364216-d18d8089f7d3?w=800&q=80',
  '新加坡': 'https://images.unsplash.com/photo-1543364216-d18d8089f7d3?w=800&q=80',
  '新加坡市': 'https://images.unsplash.com/photo-1543364216-d18d8089f7d3?w=800&q=80',
  '曼谷': 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=800&q=80',
  '泰国曼谷': 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=800&q=80',
  '普吉岛': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  '泰国普吉岛': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  '清迈': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
  '泰国清迈': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
  '巴厘岛': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  '印度尼西亚巴厘岛': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  '马尔代夫': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  '迪拜': 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80',
  '阿联酋迪拜': 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80',
  '悉尼': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  '澳大利亚悉尼': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  '墨尔本': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  '澳大利亚墨尔本': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  '新西兰': 'https://images.unsplash.com/photo-1482192505345-5655af888cc4?w=800&q=80',
  '奥克兰': 'https://images.unsplash.com/photo-1482192505345-5655af888cc4?w=800&q=80',
  '美国纽约': 'https://images.unsplash.com/photo-1496442266666-8d4c0e62e6e9?w=800&q=80',
  '纽约': 'https://images.unsplash.com/photo-1496442266666-8d4c0e62e6e9?w=800&q=80',
  '洛杉矶': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  '美国洛杉矶': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  '旧金山': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
  '美国旧金山': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
  '拉斯维加斯': 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=800&q=80',
  '美国拉斯维加斯': 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=800&q=80',
  '加拿大温哥华': 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=800&q=80',
  '温哥华': 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=800&q=80',
  '多伦多': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  '加拿大多伦多': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  '中国北京': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
  '北京': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
  '中国上海': 'https://images.unsplash.com/photo-1543364216-d18d8089f7d3?w=800&q=80',
  '上海': 'https://images.unsplash.com/photo-1543364216-d18d8089f7d3?w=800&q=80',
  '中国广州': 'https://images.unsplash.com/photo-1543364216-d18d8089f7d3?w=800&q=80',
  '广州': 'https://images.unsplash.com/photo-1543364216-d18d8089f7d3?w=800&q=80',
  '中国深圳': 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80',
  '深圳': 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80',
  '中国成都': 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80',
  '成都': 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80',
  '中国杭州': 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80',
  '杭州': 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80',
  '中国苏州': 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
  '苏州': 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
  '中国西安': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
  '西安': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
  '中国重庆': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
  '重庆': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
  '中国香港': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  '香港': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  '中国澳门': 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80',
  '澳门': 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80',
  '中国台湾': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  '台湾': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  '中国台北': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  '台北': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  '中国厦门': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  '厦门': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  '中国青岛': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  '青岛': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  '中国三亚': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  '三亚': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  '中国丽江': 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
  '丽江': 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
  '中国大理': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
  '大理': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
  '中国桂林': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
  '桂林': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
  '中国张家界': 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800&q=80',
  '张家界': 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800&q=80',
  '中国九寨沟': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  '九寨沟': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  '中国黄山': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  '黄山': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  '中国泰山': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  '泰山': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
}

const fallbackImages = [
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
]

function getDestinationImage(destination: string): string | undefined {
  if (!destination) return undefined

  const trimmed = destination.trim()

  if (destinationImages[trimmed]) {
    return destinationImages[trimmed]
  }

  const parts = trimmed.split(/[··/、]/)
  for (const part of parts) {
    const cleanedPart = part.trim()
    if (destinationImages[cleanedPart]) {
      return destinationImages[cleanedPart]
    }
  }

  const keywords = ['市', '省', '县', '区', '岛', '山', '湖', '河', '海', '湾']
  for (const keyword of keywords) {
    const index = trimmed.indexOf(keyword)
    if (index > 0) {
      const baseName = trimmed.substring(0, index).trim()
      if (destinationImages[baseName]) {
        return destinationImages[baseName]
      }
    }
  }

  const hash = destination.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return fallbackImages[hash % fallbackImages.length]
}

export { getDestinationImage, destinationImages }
