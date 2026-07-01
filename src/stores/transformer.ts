/**
 * Transformer Store
 *
 * 管理整个应用的状态
 * 包括：
 * - 当前步骤
 * - 输入文本
 * - 所有计算结果
 * - 动画状态
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Token,
  Vector,
  QKVMatrix,
  AttentionMatrix,
  MultiHeadAttention,
  FeedForwardLayer,
  Prediction,
  AnimationState,
  Step,
} from '@/types'
import { tokenize } from '@/utils/tokenizer'
import { getEmbedding, EMBEDDING_DIM } from '@/utils/embedding'
import { positionalEncoding, vecAdd, softmax } from '@/utils/math'
import { computeQKV, resetWeights } from '@/utils/qkv'
import { feedForward, resetFFNWeights } from '@/utils/feedforward'
import { predictNextToken } from '@/utils/prediction'

/** 所有步骤定义 */
const STEPS: Step[] = [
  { index: 0, id: 'tokenizer', title: 'Tokenizer', description: '将文本切分为 Token', icon: 'i-lucide-scissors' },
  { index: 1, id: 'embedding', title: 'Embedding', description: 'Token 变成向量', icon: 'i-lucide-binary' },
  { index: 2, id: 'position', title: 'Position', description: '添加位置信息', icon: 'i-lucide-map-pin' },
  { index: 3, id: 'qkv', title: 'QKV', description: '生成 Query, Key, Value', icon: 'i-lucide-key-round' },
  { index: 4, id: 'attention', title: 'Attention', description: '计算注意力分数', icon: 'i-lucide-eye' },
  { index: 5, id: 'matrix', title: 'Attention Matrix', description: '注意力矩阵可视化', icon: 'i-lucide-grid-3x3' },
  { index: 6, id: 'multihead', title: 'Multi-Head', description: '多头注意力', icon: 'i-lucide-brain' },
  { index: 7, id: 'feedforward', title: 'Feed Forward', description: '前馈神经网络', icon: 'i-lucide-zap' },
  { index: 8, id: 'layernorm', title: 'LayerNorm', description: '层归一化', icon: 'i-lucide-scale' },
  { index: 9, id: 'residual', title: 'Residual', description: '残差连接', icon: 'i-lucide-link' },
  { index: 10, id: 'output', title: 'Output', description: '预测下一个 Token', icon: 'i-lucide-target' },
]

export const useTransformerStore = defineStore('transformer', () => {
  // ========== 基础状态 ==========
  const currentStep = ref(0)
  const inputText = ref('苹果发布了新手机')
  const isAnimating = ref(false)

  // ========== 计算结果 ==========
  const tokens = ref<Token[]>([])
  const embeddings = ref<Vector[]>([])
  const positionEncoded = ref<Vector[]>([])
  const qkv = ref<QKVMatrix | null>(null)
  const attentionMatrix = ref<AttentionMatrix | null>(null)
  const multiHeadResults = ref<MultiHeadAttention[]>([])
  const feedForwardResults = ref<FeedForwardLayer[]>([])
  const predictions = ref<Prediction[]>([])

  // ========== 动画状态 ==========
  const animation = ref<AnimationState>({
    isPlaying: false,
    currentFrame: 0,
    totalFrames: 30,
    speed: 500,
  })

  // ========== 计算属性 ==========
  const currentStepInfo = computed(() => STEPS[currentStep.value])
  const canGoNext = computed(() => currentStep.value < STEPS.length - 1)
  const canGoPrev = computed(() => currentStep.value > 0)

  // ========== 核心方法 ==========

  /**
   * 执行 Tokenizer（步骤 0）
   * 将输入文本切分为 Token
   */
  function runTokenizer(): void {
    tokens.value = tokenize(inputText.value)
  }

  /**
   * 执行 Embedding（步骤 1）
   * 将 Token ID 转换为向量
   */
  function runEmbedding(): void {
    if (tokens.value.length === 0) return
    embeddings.value = tokens.value.map(token => ({
      values: getEmbedding(token.id),
      dimension: EMBEDDING_DIM,
    }))
  }

  /**
   * 执行 Position Encoding（步骤 2）
   * 为每个 Token 添加位置信息
   */
  function runPositionEncoding(): void {
    positionEncoded.value = embeddings.value.map((emb, pos) => ({
      values: vecAdd(emb.values, positionalEncoding(pos, EMBEDDING_DIM)),
      dimension: EMBEDDING_DIM,
    }))
  }

  /**
   * 执行 QKV 计算（步骤 3）
   * 生成 Query, Key, Value 矩阵
   */
  function runQKV(): void {
    const embValues = positionEncoded.value.map(v => v.values)
    qkv.value = computeQKV(embValues)
  }

  /**
   * 执行 Attention 计算（步骤 4 & 5）
   * 计算注意力分数和权重
   */
  function runAttention(): void {
    if (!qkv.value) return

    const Q = qkv.value.query
    const K = qkv.value.key
    const V = qkv.value.value

    // 计算 Q × K^T
    const dk = K[0].length
    const scaleFactor = Math.sqrt(dk)

    // 手动计算 Attention 分数
    const scores: number[][] = []
    for (let i = 0; i < Q.length; i++) {
      const row: number[] = []
      for (let j = 0; j < K.length; j++) {
        // 点积
        let dot = 0
        for (let k = 0; k < dk; k++) {
          dot += Q[i][k] * K[j][k]
        }
        row.push(dot / scaleFactor)
      }
      scores.push(row)
    }

    // Softmax
    const weights = scores.map(row => softmax(row))

    attentionMatrix.value = {
      weights,
      tokens: tokens.value.map(t => t.text),
    }
  }

  /**
   * 执行 Multi-Head Attention（步骤 6）
   * 模拟多个注意力头
   */
  function runMultiHead(): void {
    // 模拟 4 个 Head，每个关注不同的模式
    const headNames = ['语法 Head', '语义 Head', '位置 Head', '实体 Head']
    const headColors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981']
    const headDescs = [
      '关注词与词之间的语法关系',
      '关注词的语义相似度',
      '关注词的位置距离',
      '关注实体之间的关系',
    ]

    multiHeadResults.value = headNames.map((name, i) => {
      // 每个 Head 使用不同的权重矩阵，产生不同的 Attention 模式
      const tokenCount = tokens.value.length
      const weights: number[][] = []

      for (let row = 0; row < tokenCount; row++) {
        const weightRow: number[] = []
        for (let col = 0; col < tokenCount; col++) {
          // 不同 Head 有不同的注意力模式
          let score = Math.random()

          // Head 0 (语法): 关注相邻的词
          if (i === 0) {
            score = Math.abs(row - col) <= 1 ? 0.8 : 0.2
          }
          // Head 1 (语义): 关注语义相似的词
          if (i === 1) {
            score = (row + col) % 3 === 0 ? 0.7 : 0.3
          }
          // Head 2 (位置): 关注距离近的词
          if (i === 2) {
            score = 1 / (1 + Math.abs(row - col))
          }
          // Head 3 (实体): 关注名词
          if (i === 3) {
            score = (row === col || (row + col) % 2 === 0) ? 0.6 : 0.4
          }

          weightRow.push(score)
        }
        weights.push(softmax(weightRow))
      }

      return {
        headIndex: i,
        name,
        description: headDescs[i],
        color: headColors[i],
        matrix: {
          weights,
          tokens: tokens.value.map(t => t.text),
        },
      }
    })
  }

  /**
   * 执行 Feed Forward（步骤 7）
   */
  function runFeedForward(): void {
    // 对每个 Token 独立执行 FFN
    feedForwardResults.value = positionEncoded.value.map(emb => {
      const result = feedForward(emb.values)
      return {
        input: emb.values,
        ...result,
        output: result.output,
      }
    })
  }

  /**
   * 执行最终预测（步骤 10）
   */
  function runPrediction(): void {
    // 取最后一个 Token 的输出向量作为上下文
    const lastToken = feedForwardResults.value[feedForwardResults.value.length - 1]
    if (lastToken) {
      predictions.value = predictNextToken(lastToken.output)
    }
  }

  /**
   * 执行当前步骤的计算
   */
  function executeStep(step: number): void {
    switch (step) {
      case 0:
        runTokenizer()
        break
      case 1:
        runEmbedding()
        break
      case 2:
        runPositionEncoding()
        break
      case 3:
        runQKV()
        break
      case 4:
      case 5:
        runAttention()
        break
      case 6:
        runMultiHead()
        break
      case 7:
        runFeedForward()
        break
      case 8:
      case 9:
        // LayerNorm 和 Residual 是概念性的，不需要额外计算
        break
      case 10:
        runPrediction()
        break
    }
  }

  /**
   * 跳转到指定步骤
   */
  function goToStep(step: number): void {
    if (step < 0 || step >= STEPS.length) return

    // 确保之前的步骤都已执行
    for (let i = 0; i <= step; i++) {
      executeStep(i)
    }

    currentStep.value = step
  }

  /**
   * 下一步
   */
  function nextStep(): void {
    if (canGoNext.value) {
      goToStep(currentStep.value + 1)
    }
  }

  /**
   * 上一步
   */
  function prevStep(): void {
    if (canGoPrev.value) {
      goToStep(currentStep.value - 1)
    }
  }

  /**
   * 重新开始
   */
  function reset(): void {
    currentStep.value = 0
    tokens.value = []
    embeddings.value = []
    positionEncoded.value = []
    qkv.value = null
    attentionMatrix.value = null
    multiHeadResults.value = []
    feedForwardResults.value = []
    predictions.value = []
    resetWeights()
    resetFFNWeights()
    runTokenizer()
  }

  /**
   * 更新输入文本
   */
  function updateInput(text: string): void {
    inputText.value = text
    reset()
  }

  return {
    // 状态
    currentStep,
    inputText,
    tokens,
    embeddings,
    positionEncoded,
    qkv,
    attentionMatrix,
    multiHeadResults,
    feedForwardResults,
    predictions,
    animation,
    isAnimating,

    // 计算属性
    currentStepInfo,
    canGoNext,
    canGoPrev,
    steps: STEPS,

    // 方法
    goToStep,
    nextStep,
    prevStep,
    reset,
    updateInput,
    executeStep,
  }
})
