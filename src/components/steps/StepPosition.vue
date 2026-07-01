/**
 * 步骤 3: Position Encoding 📍
 *
 * 为每个 Token 添加位置信息
 * 紧凑布局
 */

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTransformerStore } from '@/stores/transformer'
import { useAnimation } from '@/composables/useAnimation'
import { positionalEncoding } from '@/utils/math'
import { EMBEDDING_DIM } from '@/utils/embedding'

const store = useTransformerStore()
const { play } = useAnimation(15, 500)

const waveformPath = computed(() => {
  const points: { x: number; y: number }[] = []
  for (let pos = 0; pos < 20; pos++) {
    const encoding = positionalEncoding(pos, 1)
    points.push({ x: pos * 25 + 30, y: 80 + encoding[0] * 50 })
  }
  return points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ')
})

onMounted(() => { store.executeStep(2); play() })
</script>

<template>
  <div>
    <h2 class="text-xl font-bold text-surface-800 mb-1">Step 3: Position Encoding 📍</h2>
    <p class="text-sm text-surface-500 mb-4">让模型知道词的顺序</p>

    <!-- 问题提示 -->
    <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
      <p class="text-xs text-amber-700">
        <strong>问题：</strong>Attention 是"无序"的，"苹果发布了"和"发布了苹果"没有位置信息时是一样的！
      </p>
    </div>

    <!-- Token 位置 + 波形 并排 -->
    <div class="grid grid-cols-2 gap-4 mb-4">
      <!-- Token 位置 -->
      <div>
        <p class="text-xs text-surface-400 mb-2">Token 位置</p>
        <div class="flex flex-wrap gap-2">
          <div v-for="(token, index) in store.tokens" :key="index" class="flex flex-col items-center">
            <div class="px-3 py-1.5 rounded-lg text-white text-sm font-bold" :style="{ backgroundColor: token.color }">
              {{ token.text }}
            </div>
            <span class="text-xs text-surface-400 mt-1">pos={{ token.position }}</span>
          </div>
        </div>
      </div>

      <!-- 位置编码波形 -->
      <div>
        <p class="text-xs text-surface-400 mb-2">位置编码（正弦波）</p>
        <div class="bg-surface-800 rounded-lg p-2" style="height: 120px;">
          <svg width="100%" height="100%" viewBox="0 0 530 120">
            <line x1="30" y1="80" x2="510" y2="80" stroke="#475569" stroke-width="0.5" />
            <path :d="waveformPath" fill="none" stroke="#6366f1" stroke-width="2" />
            <circle
              v-for="(token, index) in store.tokens"
              :key="index"
              :cx="token.position * 25 + 30"
              :cy="80 + positionalEncoding(token.position, 1)[0] * 50"
              r="4"
              :fill="token.color"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- 向量加法 -->
    <div class="mb-4">
      <p class="text-xs text-surface-400 mb-2">Embedding + Position = 新向量</p>
      <div class="space-y-1.5">
        <div v-for="(token, index) in store.tokens" :key="index" class="flex items-center gap-2 text-xs bg-surface-50 rounded-lg p-2">
          <span class="px-2 py-0.5 rounded text-white font-bold" :style="{ backgroundColor: token.color }">{{ token.text }}</span>
          <span class="font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
            {{ store.embeddings[index]?.values.slice(0, 2).map(v => v.toFixed(2)).join(',') }}...
          </span>
          <span class="text-surface-400">+</span>
          <span class="font-mono text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
            {{ positionalEncoding(token.position, 2).map(v => v.toFixed(2)).join(',') }}...
          </span>
          <span class="text-surface-400">=</span>
          <span class="font-mono text-primary bg-primary/5 px-1.5 py-0.5 rounded">
            {{ store.positionEncoded[index]?.values.slice(0, 2).map(v => v.toFixed(2)).join(',') }}...
          </span>
        </div>
      </div>
    </div>

    <!-- 关键信息 -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div class="flex items-start gap-2">
        <span class="i-lucide-lightbulb text-blue-500"></span>
        <p class="text-xs text-blue-700 leading-relaxed">
          <strong>关键：</strong>用正弦/余弦函数生成位置编码，每个位置有独特"指纹"，让模型区分词序。
        </p>
      </div>
    </div>
  </div>
</template>
