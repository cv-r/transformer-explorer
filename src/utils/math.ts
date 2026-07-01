/**
 * 数学工具函数
 * 所有 Transformer 相关的数学计算都在这里实现
 * 不依赖任何 AI 库，纯手工实现用于教学
 */

/**
 * 点积（Dot Product）
 * 两个向量的对应元素相乘再求和
 * 这是 Attention 机制的核心运算
 *
 * 公式：a · b = Σ(ai × bi)
 *
 * @example
 * dotProduct([1, 2, 3], [4, 5, 6]) = 1×4 + 2×5 + 3×6 = 32
 */
export function dotProduct(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error(`向量维度不匹配: ${a.length} vs ${b.length}`)
  }
  return a.reduce((sum, ai, i) => sum + ai * b[i], 0)
}

/**
 * Softmax 函数
 * 将一组数值转换为概率分布（所有值在 0-1 之间，总和为 1）
 * 这是 Attention 中将分数转换为权重的关键步骤
 *
 * 公式：softmax(xi) = e^xi / Σ(e^xj)
 *
 * 为什么要用 Softmax？
 * 1. 将任意实数映射到 (0, 1) 区间
 * 2. 所有输出之和为 1，可以当作概率
 * 3. 放大差异：大的值会得到更大的概率
 *
 * @example
 * softmax([1, 2, 3]) ≈ [0.09, 0.24, 0.67]
 */
export function softmax(values: number[]): number[] {
  // 为了数值稳定性，减去最大值（防止 exp 溢出）
  const maxVal = Math.max(...values)
  const expValues = values.map(v => Math.exp(v - maxVal))
  const sumExp = expValues.reduce((a, b) => a + b, 0)
  return expValues.map(v => v / sumExp)
}

/**
 * 矩阵乘法
 * 矩阵 A (m×n) 乘以矩阵 B (n×p) 得到矩阵 C (m×p)
 *
 * 这是 Transformer 中最基础的运算：
 * - Embedding: token_id × embedding_matrix
 * - QKV: embedding × W_q, W_k, W_v
 * - Feed Forward: input × weight_matrix
 *
 * 公式：C[i][j] = Σ(A[i][k] × B[k][j])
 */
export function matMul(
  A: number[][],
  B: number[][]
): number[][] {
  const m = A.length
  const n = A[0].length
  const p = B[0].length

  if (n !== B.length) {
    throw new Error(`矩阵维度不匹配: A(${m}×${n}) × B(${B.length}×${p})`)
  }

  const C: number[][] = Array.from({ length: m }, () => new Array(p).fill(0))

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < p; j++) {
      for (let k = 0; k < n; k++) {
        C[i][j] += A[i][k] * B[k][j]
      }
    }
  }

  return C
}

/**
 * 向量加法
 * 用于 Position Encoding: embedding + position_encoding
 */
export function vecAdd(a: number[], b: number[]): number[] {
  if (a.length !== b.length) {
    throw new Error(`向量维度不匹配: ${a.length} vs ${b.length}`)
  }
  return a.map((ai, i) => ai + b[i])
}

/**
 * ReLU 激活函数
 * 将负值变为 0，正值保持不变
 *
 * 公式：ReLU(x) = max(0, x)
 *
 * 为什么需要 ReLU？
 * 1. 引入非线性（否则多层线性变换等于一层）
 * 2. 稀疏激活（很多神经元输出为 0）
 * 3. 计算简单，训练快
 */
export function relu(values: number[]): number[] {
  return values.map(v => Math.max(0, v))
}

/**
 * Layer Normalization
 * 对每个样本的所有特征进行归一化
 *
 * 公式：y = (x - mean) / sqrt(variance + eps) * gamma + beta
 *
 * 为什么需要 LayerNorm？
 * 1. 稳定训练过程中的数值范围
 * 2. 加速收敛
 * 3. 防止梯度消失/爆炸
 */
export function layerNorm(
  values: number[],
  gamma: number = 1,
  beta: number = 0,
  eps: number = 1e-5
): number[] {
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length
  return values.map(v => ((v - mean) / Math.sqrt(variance + eps)) * gamma + beta)
}

/**
 * 生成随机矩阵
 * 用于模拟权重矩阵 W_q, W_k, W_v
 */
export function randomMatrix(rows: number, cols: number, scale: number = 0.1): number[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (Math.random() - 0.5) * 2 * scale)
  )
}

/**
 * 计算向量的余弦相似度
 * 用于可视化 Embedding 空间中词与词的距离
 *
 * 公式：cos(θ) = (a · b) / (|a| × |b|)
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  const dot = dotProduct(a, b)
  const normA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0))
  const normB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0))
  if (normA === 0 || normB === 0) return 0
  return dot / (normA * normB)
}

/**
 * 生成 Positional Encoding
 * 使用正弦/余弦函数生成位置编码
 *
 * 为什么用正弦/余弦？
 * 1. 每个位置都有唯一的编码
 * 2. 相对位置可以通过线性变换表示
 * 3. 可以推广到训练时未见过的长度
 *
 * 公式：
 * PE(pos, 2i) = sin(pos / 10000^(2i/d))
 * PE(pos, 2i+1) = cos(pos / 10000^(2i/d))
 */
export function positionalEncoding(position: number, dimension: number): number[] {
  const encoding: number[] = []
  for (let i = 0; i < dimension; i++) {
    if (i % 2 === 0) {
      // 偶数维度用 sin
      encoding.push(Math.sin(position / Math.pow(10000, i / dimension)))
    } else {
      // 奇数维度用 cos
      encoding.push(Math.cos(position / Math.pow(10000, (i - 1) / dimension)))
    }
  }
  return encoding
}

/**
 * Scaled Dot-Product Attention
 * Transformer 的核心计算
 *
 * 公式：Attention(Q, K, V) = softmax(Q·K^T / √dk) · V
 *
 * 步骤：
 * 1. Q 和 K 做点积 → 得到注意力分数
 * 2. 除以 √dk → 缩放（防止点积过大导致 softmax 梯度消失）
 * 3. Softmax → 转换为概率分布
 * 4. 乘以 V → 加权求和得到输出
 */
export function scaledDotProductAttention(
  Q: number[][],
  K: number[][],
  V: number[][]
): { output: number[][]; attentionWeights: number[][] } {
  const dk = K[0].length
  const scaleFactor = Math.sqrt(dk)

  // Step 1: Q × K^T
  const KT = transpose(K)
  const scores = matMul(Q, KT)

  // Step 2: 缩放
  const scaledScores = scores.map(row => row.map(s => s / scaleFactor))

  // Step 3: Softmax（对每一行）
  const attentionWeights = scaledScores.map(row => softmax(row))

  // Step 4: 乘以 V
  const output = matMul(attentionWeights, V)

  return { output, attentionWeights }
}

/**
 * 矩阵转置
 */
export function transpose(matrix: number[][]): number[][] {
  const rows = matrix.length
  const cols = matrix[0].length
  return Array.from({ length: cols }, (_, j) =>
    Array.from({ length: rows }, (_, i) => matrix[i][j])
  )
}
