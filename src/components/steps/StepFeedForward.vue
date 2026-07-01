/**
 * 步骤 8: Feed Forward ⚡
 *
 * 前馈神经网络
 * 紧凑布局
 */

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTransformerStore } from '@/stores/transformer'

const store = useTransformerStore()

const selectedToken = ref<number>(0)

onMounted(() => { store.executeStep(7) })
</script>

<template>
  <div>
    <h2 class="text-xl font-bold text-surface-800 mb-1">Step 8: Feed Forward ⚡</h2>
    <p class="text-sm text-surface-500 mb-4">每个 Token 独立经过小型神经网络</p>

    <!-- 类比 -->
    <div class="bg-green-50 border border-green-200 rounded-lg p-2.5 mb-4">
      <p class="text-xs text-green-700">
        <strong>Attention</strong> = 开会讨论（收集意见）→ <strong>FFN</strong> = 独自思考（消化信息）
      </p>
    </div>

    <!-- Token 选择 -->
    <div class="flex gap-1.5 mb-4">
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

    <!-- FFN 流程图 -->
    <div class="bg-surface-50 rounded-lg p-4 mb-4">
      <div class="flex items-center gap-3 overflow-x-auto text-xs">
        <div class="shrink-0 text-center">
          <div class="text-surface-400 mb-1">Input</div>
          <div class="bg-blue-100 text-blue-800 px-3 py-2 rounded font-mono">
            {{ store.feedForwardResults[selectedToken]?.input.slice(0, 2).map(v => v.toFixed(2)).join(',') }}...
          </div>
        </div>
        <span class="text-surface-400 text-lg">→</span>
        <div class="shrink-0 text-center">
          <div class="text-surface-400 mb-1">Linear</div>
          <div class="bg-purple-100 text-purple-800 px-3 py-2 rounded font-mono">
            {{ store.feedForwardResults[selectedToken]?.afterLinear1.slice(0, 2).map(v => v.toFixed(2)).join(',') }}...
          </div>
        </div>
        <span class="text-surface-400 text-lg">→</span>
        <div class="shrink-0 text-center">
          <div class="text-surface-400 mb-1">ReLU</div>
          <div class="bg-orange-100 text-orange-800 px-3 py-2 rounded font-mono">
            {{ store.feedForwardResults[selectedToken]?.afterReLU.slice(0, 2).map(v => v.toFixed(2)).join(',') }}...
          </div>
        </div>
        <span class="text-surface-400 text-lg">→</span>
        <div class="shrink-0 text-center">
          <div class="text-surface-400 mb-1">Linear</div>
          <div class="bg-green-100 text-green-800 px-3 py-2 rounded font-mono">
            {{ store.feedForwardResults[selectedToken]?.afterLinear2.slice(0, 2).map(v => v.toFixed(2)).join(',') }}...
          </div>
        </div>
        <span class="text-surface-400 text-lg">→</span>
        <div class="shrink-0 text-center">
          <div class="text-surface-400 mb-1">Output</div>
          <div class="bg-primary/10 text-primary px-3 py-2 rounded font-mono">
            {{ store.feedForwardResults[selectedToken]?.output.slice(0, 2).map(v => v.toFixed(2)).join(',') }}...
          </div>
        </div>
      </div>
    </div>

    <!-- ReLU 说明 -->
    <div class="mb-4">
      <p class="text-xs text-surface-400 mb-1.5">ReLU 激活函数：负值变 0，正值保留</p>
      <div class="bg-surface-800 rounded-lg p-3" style="height: 120px;">
        <svg width="100%" height="100%" viewBox="0 0 300 120">
          <line x1="30" y1="90" x2="270" y2="90" stroke="#475569" stroke-width="0.5" />
          <line x1="150" y1="20" x2="150" y2="100" stroke="#475569" stroke-width="0.5" />
          <path d="M 30 90 L 150 90 L 270 30" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" />
        </svg>
      </div>
    </div>

    <!-- 关键信息 -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div class="flex items-start gap-2">
        <span class="i-lucide-lightbulb text-blue-500"></span>
        <p class="text-xs text-blue-700 leading-relaxed">
          <strong>关键：</strong>Attention 负责词与词交互，FFN 负责每个词自己的非线性变换。
        </p>
      </div>
    </div>
  </div>
</template>
