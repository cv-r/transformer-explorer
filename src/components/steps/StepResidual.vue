/**
 * 步骤 10: Residual Connection 🔗
 *
 * 残差连接
 * 紧凑布局
 */

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTransformerStore } from '@/stores/transformer'

const store = useTransformerStore()

const phase = ref<'input' | 'attention' | 'add' | 'output'>('input')

onMounted(() => {
  store.executeStep(9)
  setTimeout(() => { phase.value = 'attention' }, 800)
  setTimeout(() => { phase.value = 'add' }, 2000)
  setTimeout(() => { phase.value = 'output' }, 3200)
})
</script>

<template>
  <div>
    <h2 class="text-xl font-bold text-surface-800 mb-1">Step 10: Residual Connection 🔗</h2>
    <p class="text-sm text-surface-500 mb-4">让信息可以"跳过"某些层直接传递</p>

    <!-- 问题提示 -->
    <div class="bg-amber-50 border border-amber-200 rounded-lg p-2.5 mb-4">
      <p class="text-xs text-amber-700">
        <strong>问题：</strong>网络层数增加后梯度会消失，残差连接让信息可以"跳过"某些层直接传递。
      </p>
    </div>

    <!-- 流程图 -->
    <div class="bg-surface-50 rounded-lg p-4 mb-4">
      <svg width="100%" height="280" viewBox="0 0 400 280">
        <!-- 输入 -->
        <rect x="150" y="10" width="100" height="40" rx="6" :fill="phase === 'input' ? '#6366f1' : '#e2e8f0'" class="transition-all duration-500" />
        <text x="200" y="35" text-anchor="middle" fill="white" font-weight="bold" style="font-size: 13px">Input</text>

        <!-- 左侧跳过连接 -->
        <path d="M 140 50 L 140 220 L 160 220" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="6,3" :class="{ 'animate-pulse': phase === 'add' }" />
        <text x="125" y="140" fill="#10b981" style="font-size: 10px" text-anchor="end">跳过</text>

        <!-- Attention -->
        <rect x="150" y="70" width="100" height="40" rx="6" :fill="phase === 'attention' ? '#8b5cf6' : '#e2e8f0'" class="transition-all duration-500" />
        <text x="200" y="95" text-anchor="middle" fill="white" font-weight="bold" style="font-size: 13px">Attention</text>

        <line x1="200" y1="110" x2="200" y2="150" stroke="#94a3b8" stroke-width="1.5" />
        <polygon points="196,150 204,150 200,158" fill="#94a3b8" />

        <!-- FFN -->
        <rect x="150" y="158" width="100" height="40" rx="6" :fill="phase === 'attention' ? '#f59e0b' : '#e2e8f0'" class="transition-all duration-500" />
        <text x="200" y="183" text-anchor="middle" fill="white" font-weight="bold" style="font-size: 13px">FFN</text>

        <!-- 加法节点 -->
        <circle cx="200" cy="220" r="16" :fill="phase === 'add' ? '#10b981' : '#e2e8f0'" class="transition-all duration-500" />
        <text x="200" y="225" text-anchor="middle" fill="white" font-weight="bold" style="font-size: 16px">+</text>

        <line x1="200" y1="236" x2="200" y2="255" stroke="#94a3b8" stroke-width="1.5" />
        <polygon points="196,255 204,255 200,263" fill="#94a3b8" />

        <!-- 输出 -->
        <rect x="150" y="263" width="100" height="30" rx="6" :fill="phase === 'output' ? '#10b981' : '#e2e8f0'" class="transition-all duration-500" />
        <text x="200" y="283" text-anchor="middle" fill="white" font-weight="bold" style="font-size: 13px">Output</text>
      </svg>
    </div>

    <!-- 公式 -->
    <div class="text-center bg-surface-50 rounded-lg p-3 mb-4">
      <span class="font-mono text-lg text-surface-800">Output = Layer(x) + x</span>
      <p class="text-xs text-surface-500 mt-1">输入经过某层处理后，再加上原始输入</p>
    </div>

    <!-- 关键信息 -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div class="flex items-start gap-2">
        <span class="i-lucide-lightbulb text-blue-500"></span>
        <p class="text-xs text-blue-700 leading-relaxed">
          <strong>关键：</strong>残差连接解决梯度消失问题，让 Transformer 可以堆叠很多层（GPT-3 有 96 层）。
        </p>
      </div>
    </div>
  </div>
</template>
