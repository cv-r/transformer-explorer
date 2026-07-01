/**
 * Transformer Explorer 类型定义
 * 所有数据流都使用 TypeScript 类型约束
 */

/** Token：分词后的最小单位 */
export interface Token {
  /** Token 文本 */
  text: string
  /** Token 在词汇表中的 ID */
  id: number
  /** Token 在句子中的位置 */
  position: number
  /** 分配的颜色（用于可视化） */
  color: string
}

/** 向量：Embedding 后的数值表示 */
export interface Vector {
  /** 向量值（只显示前 N 维） */
  values: number[]
  /** 完整维度（模拟） */
  dimension: number
}

/** QKV 矩阵：Query, Key, Value */
export interface QKVMatrix {
  /** Query 向量 */
  query: number[][]
  /** Key 向量 */
  key: number[][]
  /** Value 向量 */
  value: number[][]
}

/** Attention 分数 */
export interface AttentionScore {
  /** 源 Token */
  from: string
  /** 目标 Token */
  to: string
  /** 原始点积分数 */
  dotProduct: number
  /** Softmax 后的权重 */
  weight: number
}

/** Attention 矩阵 */
export interface AttentionMatrix {
  /** 二维权重矩阵 */
  weights: number[][]
  /** Token 列表 */
  tokens: string[]
}

/** Multi-Head Attention */
export interface MultiHeadAttention {
  /** Head 索引 */
  headIndex: number
  /** Head 名称（教学用） */
  name: string
  /** Head 描述 */
  description: string
  /** 颜色 */
  color: string
  /** Attention 矩阵 */
  matrix: AttentionMatrix
}

/** Feed Forward 层 */
export interface FeedForwardLayer {
  /** 输入向量 */
  input: number[]
  /** 第一层线性变换后 */
  afterLinear1: number[]
  /** ReLU 激活后 */
  afterReLU: number[]
  /** 第二层线性变换后 */
  afterLinear2: number[]
  /** 输出向量 */
  output: number[]
}

/** 预测结果 */
export interface Prediction {
  /** Token 文本 */
  token: string
  /** 概率 */
  probability: number
  /** 颜色 */
  color: string
}

/** 步骤定义 */
export interface Step {
  /** 步骤索引 */
  index: number
  /** 步骤 ID */
  id: string
  /** 步骤标题 */
  title: string
  /** 步骤描述 */
  description: string
  /** 步骤图标 */
  icon: string
}

/** 动画状态 */
export interface AnimationState {
  /** 是否正在播放 */
  isPlaying: boolean
  /** 当前帧 */
  currentFrame: number
  /** 总帧数 */
  totalFrames: number
  /** 速度（ms） */
  speed: number
}

/** 教学内容 */
export interface TeachingContent {
  /** 标题 */
  title: string
  /** 为什么存在 */
  whyExists: string
  /** 解决什么问题 */
  solvesProblem: string
  /** 如果没有会怎样 */
  withoutIt: string
  /** 类比说明 */
  analogy?: string
}
