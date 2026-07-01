/**
 * 输出预测
 *
 * Transformer 最终输出一个概率分布，预测下一个 Token
 *
 * 教学要点：
 * 1. GPT 每次只做一件事：预测下一个词
 * 2. 输出层将向量映射回词汇表大小
 * 3. Softmax 将分数转换为概率
 * 4. 选择概率最高的词作为预测结果
 */

import type { Prediction } from '@/types'
import { softmax } from './math'

/**
 * 模拟词汇表（简化版）
 */
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
}

/**
 * 预测下一个 Token
 *
 * @param contextVector - 最终的上下文向量
 * @param topK - 返回前 K 个预测
 * @returns 预测结果列表
 */
export function predictNextToken(
  contextVector: number[],
  topK: number = 5
): Prediction[] {
  // 模拟：根据输入生成"看起来合理"的预测
  // 真实模型：output = contextVector × W_output → vocab_size 维向量

  // 预定义一些合理的预测（用于教学演示）
  const predictions: Prediction[] = [
    { token: '手机', probability: 0.85, color: '#10b981' },
    { token: '电脑', probability: 0.08, color: '#3b82f6' },
    { token: '汽车', probability: 0.02, color: '#f59e0b' },
    { token: '水果', probability: 0.05, color: '#8b5cf6' },
  ]

  // 按概率排序
  predictions.sort((a, b) => b.probability - a.probability)

  // 返回前 K 个
  return predictions.slice(0, topK)
}

/**
 * 计算交叉熵损失（教学用）
 *
 * 交叉熵衡量预测分布和真实分布的差距
 * 损失越小，模型预测越准
 */
export function crossEntropyLoss(predicted: number[], target: number[]): number {
  const EPSILON = 1e-15
  return -target.reduce((sum, t, i) => {
    const p = Math.max(predicted[i], EPSILON)
    return sum + t * Math.log(p)
  }, 0)
}
