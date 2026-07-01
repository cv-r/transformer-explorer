/**
 * 步骤 5: Attention 👁️
 *
 * 计算注意力分数
 * 紧凑布局
 */

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTransformerStore } from '@/stores/transformer'
import { useAnimation } from '@/composables/useAnimation'
import { dotProduct, softmax } from '@/utils/math'

const store = useTransformerStore()
const { play } = useAnimation(20, 500)

const selectedToken = ref<number>(0)

const attentionScores = computed(() => {
  if (!store.qkv) return []
  const Q = store.qkv.query[selectedToken.value]
  const K = store.qkv.key
  const dk = K[0].length
  const scaleFactor = Math.sqrt(dk)

  const dotProducts = K.map((k: number[], i: number) => ({
    index: i,
    token: store.tokens[i].text,
    color: store.tokens[i].color,
    dotProduct: dotProduct(Q, k),
    scaledScore: dotProduct(Q, k) / scaleFactor,
  }))

  const scores = dotProducts.map((d: { scaledScore: number }) => d.scaledScore)
  const weights = softmax(scores)

  return dotProducts.map((d: any, i: number) => ({ ...d, weight: weights[i] }))
})

const tokenPositions = computed(() => {
  const count = store.tokens.length
  const spacing = 400 / (count + 1)
  return store.tokens.map((_, i) => ({ x: spacing * (i + 1) + 50, y: 130 }))
})

onMounted(() => { store.executeStep(4); play() })
</script>

<template>
  <div>
    <h2 class="text-xl font-bold text-surface-800 mb-1">Step 5: Attention 👁️</h2>
    <p class="text-sm text-surface-500 mb-4">计算每个词应该关注哪些词</p>

    <!-- Token 选择 -->
    <div class="mb-4">
      <p class="text-xs text-surface-400 mb-1.5">选择 Query Token：</p>
      <div class="flex gap-1.5">
        <button
          v-for="(token, index) in store.tokens"
          :key="index"
          class="px-3 py-1.5 rounded-md text-xs font-bold transition-all"
          :class="selectedToken === index ? 'text-white shadow-md' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'"
          :style="selectedToken === index ? { backgroundColor: token.color } : {}"
          @click="selectedToken = index"
        >
          {{ token.text }}
        </button>
      </div>
    </div>

    <!-- 可视化 + 分数表 并排 -->
    <div class="grid grid-cols-2 gap-4 mb-4">
      <!-- 连线图 -->
      <div>
        <p class="text-xs text-surface-400 mb-1.5">Attention 连线</p>
        <div class="bg-surface-800 rounded-lg p-2" style="height: 220px;">
          <svg width="100%" height="100%" viewBox="0 0 500 220">
            <line
              v-for="(score, index) in attentionScores"
              :key="'line-' + index"
              :x1="tokenPositions[selectedToken]?.x || 0"
              :y1="tokenPositions[selectedToken]?.y || 0"
              :x2="tokenPositions[index]?.x || 0"
              :y2="tokenPositions[index]?.y || 0"
              :stroke="store.tokens[index].color"
              :stroke-width="Math.max(1, score.weight * 10)"
              :stroke-opacity="0.5"
            />
            <g v-for="(token, index) in store.tokens" :key="'node-' + index">
              <circle
                :cx="tokenPositions[index]?.x || 0"
                :cy="tokenPositions[index]?.y || 0"
                :r="selectedToken === index ? 22 : 18"
                :fill="token.color"
                :stroke="selectedToken === index ? 'white' : 'none'"
                stroke-width="2"
              />
              <text
                :x="tokenPositions[index]?.x || 0"
                :y="(tokenPositions[index]?.y || 0) + 4"
                text-anchor="middle" style="font-size: 11px" font-weight="bold" fill="white"
              >
                {{ token.text }}
              </text>
            </g>
          </svg>
        </div>
      </div>

      <!-- 分数表 -->
      <div>
        <p class="text-xs text-surface-400 mb-1.5">
          "{{ store.tokens[selectedToken]?.text }}" 的 Attention
        </p>
        <div class="space-y-1.5">
          <div v-for="score in attentionScores" :key="score.token" class="flex items-center gap-2">
            <span class="w-10 text-xs font-bold text-right" :style="{ color: score.color }">{{ score.token }}</span>
            <div class="flex-1 bg-surface-200 rounded-full h-3 overflow-hidden">
              <div class="h-full rounded-full transition-all" :style="{ width: `${score.weight * 100}%`, backgroundColor: score.color }" />
            </div>
            <span class="text-xs font-mono text-surface-500 w-10 text-right">{{ (score.weight * 100).toFixed(0) }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 关键信息 -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div class="flex items-start gap-2">
        <span class="i-lucide-lightbulb text-blue-500"></span>
        <p class="text-xs text-blue-700 leading-relaxed">
          <strong>关键：</strong>Attention 让每个词"看到"其他所有词，根据相关性加权聚合信息。
        </p>
      </div>
    </div>
  </div>
</template>
