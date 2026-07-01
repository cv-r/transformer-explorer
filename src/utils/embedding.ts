/**
 * Embedding 工具
 *
 * 将 Token ID 转换为稠密向量（Dense Vector）
 *
 * 教学要点：
 * 1. Token ID 只是一个编号，没有语义信息
 * 2. Embedding 将 ID 映射到一个高维空间
 * 3. 语义相近的词在向量空间中距离更近
 * 4. 这是模型"理解"语言的基础
 */

import type { Token, Vector } from '@/types'

/** Embedding 维度（真实模型通常是 768 或 1024，这里简化为 8 维便于可视化） */
export const EMBEDDING_DIM = 8

/**
 * 预设的 Embedding 向量（模拟训练好的结果）
 * 语义相近的词会有相似的向量
 *
 * 注意：这是教学用的模拟数据
 * 真实模型的 Embedding 是通过训练学习得到的
 */
const PRETRAINED_EMBEDDINGS: Record<number, number[]> = {
  // 水果类（在向量空间中彼此靠近）
  18: [0.23, 0.81, -0.55, 0.12, 0.45, -0.32, 0.67, 0.18],   // 苹果
  28: [0.28, 0.75, -0.48, 0.15, 0.42, -0.28, 0.71, 0.22],   // 香蕉
  41: [0.25, 0.78, -0.52, 0.13, 0.44, -0.30, 0.69, 0.20],   // 西瓜
  33: [0.26, 0.79, -0.50, 0.14, 0.43, -0.31, 0.68, 0.19],   // 水果

  // 电子产品类
  52: [0.65, -0.22, 0.38, 0.71, -0.15, 0.55, -0.42, 0.33],  // 手机
  45: [0.62, -0.25, 0.35, 0.68, -0.18, 0.52, -0.45, 0.30],  // 电脑
  67: [0.58, -0.28, 0.32, 0.65, -0.20, 0.48, -0.48, 0.28],  // 汽车

  // 动词类
  91: [0.12, 0.45, 0.78, -0.33, 0.56, 0.22, -0.15, 0.41],   // 发布
  30: [0.15, 0.42, 0.75, -0.30, 0.53, 0.25, -0.18, 0.38],   // 吃
  31: [0.14, 0.43, 0.76, -0.31, 0.54, 0.24, -0.17, 0.39],   // 喝
  32: [0.16, 0.41, 0.74, -0.29, 0.52, 0.26, -0.19, 0.37],   // 看

  // 助词类（功能词，向量应该相似）
  7: [0.88, 0.12, -0.05, 0.15, -0.08, 0.03, 0.11, -0.06],    // 了
  2: [0.87, 0.13, -0.06, 0.14, -0.07, 0.04, 0.10, -0.05],    // 的
  3: [0.86, 0.14, -0.04, 0.16, -0.09, 0.02, 0.12, -0.07],    // 是

  // 形容词类
  23: [0.35, 0.62, -0.28, 0.45, 0.18, -0.42, 0.55, 0.25],   // 新
  25: [0.32, 0.65, -0.25, 0.42, 0.21, -0.39, 0.52, 0.28],   // 很
  26: [0.33, 0.64, -0.26, 0.43, 0.20, -0.40, 0.53, 0.27],   // 好
  27: [0.31, 0.66, -0.24, 0.41, 0.22, -0.38, 0.51, 0.29],   // 大
  29: [0.34, 0.63, -0.27, 0.44, 0.19, -0.41, 0.54, 0.26],   // 小
}

/**
 * 获取 Token 的 Embedding 向量
 *
 * 如果 Token 有预设的 Embedding，直接返回
 * 否则生成一个伪随机的 Embedding（基于 ID 的哈希）
 */
export function getEmbedding(tokenId: number): number[] {
  // 如果有预训练的 Embedding，直接返回
  if (PRETRAINED_EMBEDDINGS[tokenId]) {
    return [...PRETRAINED_EMBEDDINGS[tokenId]]
  }

  // 否则基于 ID 生成伪随机向量（确保相同 ID 总是得到相同向量）
  const embedding: number[] = []
  let seed = tokenId
  for (let i = 0; i < EMBEDDING_DIM; i++) {
    // 简单的伪随机数生成器
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    embedding.push(((seed % 1000) / 1000 - 0.5) * 2)
  }
  return embedding
}

/**
 * 获取所有 Token 的 Embedding
 */
export function getAllEmbeddings(tokens: Token[]): Vector[] {
  return tokens.map(token => ({
    values: getEmbedding(token.id),
    dimension: EMBEDDING_DIM,
  }))
}

/**
 * 计算两个 Embedding 之间的欧氏距离
 * 用于可视化词与词之间的相似度
 */
export function euclideanDistance(a: number[], b: number[]): number {
  return Math.sqrt(
    a.reduce((sum, ai, i) => sum + (ai - b[i]) ** 2, 0)
  )
}
