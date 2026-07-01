/**
 * 简单的分词器（Tokenizer）
 *
 * 真实的 GPT 使用 BPE（Byte Pair Encoding）分词
 * 这里我们用简单的中文分词来模拟，便于教学理解
 *
 * 教学要点：
 * 1. AI 模型不认识文字，只认识数字
 * 2. Tokenizer 将文字切分成 Token
 * 3. 每个 Token 对应一个数字 ID
 */

import type { Token } from '@/types'

/** 模拟词汇表：中文常见词 → ID */
const VOCABULARY: Record<string, number> = {
  '苹果': 18,
  '发布': 91,
  '了': 7,
  '新': 23,
  '手机': 52,
  '电脑': 45,
  '汽车': 67,
  '水果': 33,
  '香蕉': 28,
  '西瓜': 41,
  '是': 3,
  '的': 2,
  '在': 5,
  '有': 8,
  '和': 11,
  '我': 14,
  '你': 15,
  '他': 16,
  '她': 17,
  '它': 19,
  '这': 20,
  '那': 21,
  '一': 22,
  '个': 24,
  '很': 25,
  '好': 26,
  '大': 27,
  '小': 29,
  '吃': 30,
  '喝': 31,
  '看': 32,
  '不': 34,
  '会': 35,
  '要': 36,
  '能': 37,
  '可': 38,
  '以': 39,
  '把': 40,
  '被': 42,
  '从': 43,
  '到': 44,
  '上': 46,
  '下': 47,
  '左': 48,
  '右': 49,
  '前': 50,
  '后': 51,
  '人': 53,
  '天': 54,
  '地': 55,
  '水': 56,
  '火': 57,
  '山': 58,
  '石': 59,
  '花': 60,
  '鸟': 61,
  '鱼': 62,
  '虫': 63,
  '马': 64,
  '牛': 65,
  '羊': 66,
  '狗': 68,
  '猫': 69,
  '鸡': 70,
  '鸭': 71,
  '鹅': 72,
  '龙': 73,
  '凤': 74,
  '虎': 75,
  '豹': 76,
  '熊': 77,
  '象': 78,
  '鼠': 79,
  '兔': 80,
  '蛇': 81,
  '蛙': 82,
  '蝶': 83,
  '蜂': 84,
  '蚁': 85,
  '蝇': 86,
  '蚊': 87,
  '蜘': 88,
  '蝉': 89,
  '蚂': 90,
  '发布了': 92,
  '新手机': 93,
  '新电脑': 94,
  '新汽车': 95,
  '好水果': 96,
  '大西瓜': 97,
  '小苹果': 98,
  '红苹果': 99,
  '青苹果': 100,
}

/** Token 颜色表（用于可视化） */
const TOKEN_COLORS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#3b82f6', // blue
  '#ef4444', // red
  '#14b8a6', // teal
  '#f97316', // orange
  '#8b5cf6', // purple
]

/**
 * 分词：将输入文本切分为 Token 数组
 *
 * 这里使用简单的中文分词策略：
 * 1. 优先匹配最长的词汇（最大匹配法）
 * 2. 匹配不到的单字作为独立 Token
 */
export function tokenize(text: string): Token[] {
  const tokens: Token[] = []
  let position = 0
  let colorIndex = 0

  let remaining = text.trim()

  while (remaining.length > 0) {
    let matched = false

    // 尝试从最长的子串开始匹配
    for (let len = Math.min(remaining.length, 4); len >= 1; len--) {
      const substr = remaining.substring(0, len)
      if (VOCABULARY[substr] !== undefined) {
        tokens.push({
          text: substr,
          id: VOCABULARY[substr],
          position,
          color: TOKEN_COLORS[colorIndex % TOKEN_COLORS.length],
        })
        position++
        colorIndex++
        remaining = remaining.substring(len)
        matched = true
        break
      }
    }

    // 如果没有匹配到，将单个字符作为 Token
    if (!matched) {
      const char = remaining[0]
      // 使用字符的 Unicode 编码作为 ID（模拟）
      const id = char.charCodeAt(0) % 1000 + 100
      tokens.push({
        text: char,
        id,
        position,
        color: TOKEN_COLORS[colorIndex % TOKEN_COLORS.length],
      })
      position++
      colorIndex++
      remaining = remaining.substring(1)
    }
  }

  return tokens
}

/**
 * 获取词汇表大小
 */
export function getVocabularySize(): number {
  return Object.keys(VOCABULARY).length
}

/**
 * 根据 ID 查找 Token
 */
export function getTokenById(id: number): string | undefined {
  return Object.entries(VOCABULARY).find(([_, v]) => v === id)?.[0]
}
