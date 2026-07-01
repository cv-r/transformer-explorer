/**
 * 步骤 11: Output 🎯
 *
 * 预测下一个 Token
 * 紧凑布局
 */

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useTransformerStore } from '@/stores/transformer'

const store = useTransformerStore()

const topPrediction = computed(() => {
  if (store.predictions.length === 0) return null
  return store.predictions.reduce((max, p) => p.probability > max.probability ? p : max)
})

onMounted(() => { store.executeStep(10) })
</script>

<template>
  <div>
    <h2 class="text-xl font-bold text-surface-800 mb-1">Step 11: Output 🎯</h2>
    <p class="text-sm text-surface-500 mb-4">预测下一个 Token</p>

    <!-- 输入回顾 -->
    <div class="mb-4">
      <p class="text-xs text-surface-400 mb-1.5">输入</p>
      <div class="flex flex-wrap gap-1.5">
        <span v-for="(token, index) in store.tokens" :key="index" class="px-3 py-1.5 rounded-lg text-white text-sm font-bold" :style="{ backgroundColor: token.color }">
          {{ token.text }}
        </span>
        <span class="px-3 py-1.5 rounded-lg border-2 border-dashed border-surface-300 text-surface-400 text-sm font-bold">?</span>
      </div>
    </div>

    <!-- 预测结果 -->
    <div class="mb-4">
      <p class="text-xs text-surface-400 mb-1.5">模型预测</p>
      <div class="space-y-2">
        <div v-for="(pred, index) in store.predictions" :key="index" class="flex items-center gap-2">
          <div
            class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            :class="{ 'bg-green-500': index === 0, 'bg-blue-400': index === 1, 'bg-amber-400': index === 2, 'bg-surface-400': index > 2 }"
          >
            {{ index + 1 }}
          </div>
          <div
            class="px-4 py-1.5 rounded-md font-bold text-sm shrink-0"
            :class="index === 0 ? 'bg-green-500 text-white' : 'bg-surface-100 text-surface-700'"
          >
            {{ pred.token }}
          </div>
          <div class="flex-1 bg-surface-200 rounded-full h-5 overflow-hidden">
            <div
              class="h-full rounded-full transition-all flex items-center justify-end pr-2"
              :class="{ 'bg-green-500': index === 0, 'bg-blue-400': index === 1, 'bg-amber-400': index === 2, 'bg-surface-400': index > 2 }"
              :style="{ width: `${pred.probability * 100}%` }"
            >
              <span class="text-white text-xs font-bold">{{ (pred.probability * 100).toFixed(0) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 预测高亮 -->
    <div v-if="topPrediction" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 text-center">
      <p class="text-xs text-green-600 mb-1">预测结果</p>
      <div class="flex items-center justify-center gap-2">
        <span v-for="(token, index) in store.tokens" :key="index" class="text-xl font-bold text-surface-800">{{ token.text }}</span>
        <span class="text-2xl text-green-600">→</span>
        <span class="text-3xl font-bold text-green-700">{{ topPrediction.token }}</span>
        <span class="text-sm text-green-600">({{ (topPrediction.probability * 100).toFixed(0) }}%)</span>
      </div>
    </div>

    <!-- 完成 -->
    <div class="bg-gradient-to-r from-primary to-secondary rounded-lg p-4 text-white text-center mb-4">
      <h3 class="font-bold mb-1 flex items-center justify-center gap-2">
        <span class="i-lucide-party-popper"></span> 你已经理解了 Transformer 的核心原理！
      </h3>
      <p class="text-sm text-white/80">GPT、Claude、Gemini、DeepSeek、Qwen 都基于这个架构。</p>
    </div>

    <!-- 关键信息 -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div class="flex items-start gap-2">
        <span class="i-lucide-lightbulb text-blue-500"></span>
        <p class="text-xs text-blue-700 leading-relaxed">
          <strong>关键：</strong>GPT 每次只做一件事——预测下一个词。它将上下文压缩成向量，输出概率分布。
        </p>
      </div>
    </div>
  </div>
</template>
