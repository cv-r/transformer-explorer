/**
 * QKV 工具
 *
 * Query, Key, Value 是 Attention 机制的核心概念
 *
 * 教学类比：
 * 想象你在图书馆找书：
 * - Query（查询）= 你脑海中的问题 "我想找关于机器学习的书"
 * - Key（键）= 每本书封面上的关键词
 * - Value（值）= 书的实际内容
 *
 * Attention 的过程：
 * 1. 用 Query 和所有 Key 做匹配（点积）
 * 2. 得到匹配分数
 * 3. 用分数对 Value 做加权求和
 * 4. 得到最终的上下文向量
 */

import type { QKVMatrix } from '@/types'
import { randomMatrix, matMul, transpose } from './math'

/** QKV 权重矩阵的维度 */
const D_MODEL = 8  // Embedding 维度
const D_K = 4      // Q/K/V 的维度（简化）

/**
 * 生成 QKV 权重矩阵
 * 在真实模型中，这些是训练得到的参数
 * 这里我们用随机矩阵模拟
 */
let Wq: number[][] | null = null
let Wk: number[][] | null = null
let Wv: number[][] | null = null

function initWeights(): void {
  if (!Wq) {
    Wq = randomMatrix(D_MODEL, D_K, 0.3)
    Wk = randomMatrix(D_MODEL, D_K, 0.3)
    Wv = randomMatrix(D_MODEL, D_K, 0.3)
  }
}

/**
 * 将 Embedding 向量转换为 Q, K, V
 *
 * 数学过程：
 * Q = Embedding × Wq
 * K = Embedding × Wk
 * V = Embedding × Wv
 *
 * 为什么要分成三个？
 * - 每个词在不同场景下扮演不同角色
 * - 作为"提问者"（Query）时，关注别人的信息
 * - 作为"被查询者"（Key）时，提供自己的特征
 * - 作为"信息源"（Value）时，提供实际内容
 */
export function computeQKV(embeddings: number[][]): QKVMatrix {
  initWeights()

  // 将 embeddings 转换为矩阵形式
  const embMatrix = embeddings.map(e => [e]) // 列向量

  // 计算 Q, K, V
  const Q = matMul(embeddings, Wq!)
  const K = matMul(embeddings, Wk!)
  const V = matMul(embeddings, Wv!)

  return {
    query: Q,
    key: K,
    value: V,
  }
}

/**
 * 获取权重矩阵（用于可视化）
 */
export function getWeightMatrices(): { Wq: number[][]; Wk: number[][]; Wv: number[][] } {
  initWeights()
  return {
    Wq: Wq!,
    Wk: Wk!,
    Wv: Wv!,
  }
}

/**
 * 重置权重矩阵（用于重新开始）
 */
export function resetWeights(): void {
  Wq = null
  Wk = null
  Wv = null
}
