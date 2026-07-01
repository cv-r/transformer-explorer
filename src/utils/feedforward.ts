/**
 * Feed Forward Network (前馈神经网络)
 *
 * Transformer 中每个 Token 独立经过的 MLP 层
 *
 * 结构：
 * Input → Linear → ReLU → Linear → Output
 *
 * 教学要点：
 * 1. Attention 负责"词与词之间的交互"
 * 2. FFN 负责"每个词自己的变换"
 * 3. 两者配合，模型才能同时理解上下文和做复杂变换
 *
 * 类比：
 * - Attention 像是开会讨论（收集别人的意见）
 * - FFN 像是独自思考（消化信息，形成自己的理解）
 */

import { randomMatrix, matMul, relu } from './math'

/** FFN 的隐藏层维度（通常是 d_model 的 4 倍） */
const D_HIDDEN = 16

/** 权重矩阵 */
let W1: number[][] | null = null
let b1: number[] | null = null
let W2: number[][] | null = null
let b2: number[] | null = null

function initWeights(dModel: number): void {
  if (!W1) {
    W1 = randomMatrix(dModel, D_HIDDEN, 0.3)
    b1 = new Array(D_HIDDEN).fill(0)
    W2 = randomMatrix(D_HIDDEN, dModel, 0.3)
    b2 = new Array(dModel).fill(0)
  }
}

/**
 * 前向传播
 *
 * @param input - 输入向量（来自 Attention 的输出）
 * @returns 每一步的中间结果（用于可视化）
 */
export function feedForward(input: number[]): {
  afterLinear1: number[]
  afterReLU: number[]
  afterLinear2: number[]
  output: number[]
} {
  const dModel = input.length
  initWeights(dModel)

  // Step 1: 第一层线性变换
  // input (1×d_model) × W1 (d_model×d_hidden) + b1
  const afterLinear1 = W1![0].map((_, j) => {
    let sum = b1![j]
    for (let i = 0; i < dModel; i++) {
      sum += input[i] * W1![i][j]
    }
    return sum
  })

  // Step 2: ReLU 激活
  const afterReLU = relu(afterLinear1)

  // Step 3: 第二层线性变换
  const afterLinear2 = W2![0].map((_, j) => {
    let sum = b2![j]
    for (let i = 0; i < D_HIDDEN; i++) {
      sum += afterReLU[i] * W2![i][j]
    }
    return sum
  })

  return {
    afterLinear1,
    afterReLU,
    afterLinear2,
    output: afterLinear2,
  }
}

/**
 * 重置权重
 */
export function resetFFNWeights(): void {
  W1 = null
  b1 = null
  W2 = null
  b2 = null
}
