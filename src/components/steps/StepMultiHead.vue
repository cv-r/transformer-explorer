/**
 * 步骤 7: Multi-Head Attention 🧠
 *
 * 多头注意力并行工作
 * 紧凑布局
 */

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTransformerStore } from '@/stores/transformer'

const store = useTransformerStore()

const selectedHead = ref<number | null>(null)

function getHeatmapColor(value: number, headColor: string): string {
  const opacity = 0.2 + value * 0.8
  return `${headColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`
}

onMounted(() => { store.executeStep(6) })
</script>

<template>
  <div>
    <h2 class="text-xl font-bold text-surface-800 mb-1">Step 7: Multi-Head Attention 🧠</h2>
    <p class="text-sm text-surface-500 mb-4">多个注意力头并行工作</p>

    <!-- 提示 -->
    <div class="bg-amber-50 border border-amber-200 rounded-lg p-2.5 mb-4">
      <p class="text-xs text-amber-700">
        <strong>注意：</strong>真实模型中我们不知道每个 Head 关注什么，这里的名称只是教学用。
      </p>
    </div>

    <!-- Head 选择 -->
    <div class="flex gap-2 mb-4">
      <button
        v-for="head in store.multiHeadResults"
        :key="head.headIndex"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all"
        :class="selectedHead === head.headIndex ? 'text-white shadow-md' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'"
        :style="selectedHead === head.headIndex ? { backgroundColor: head.color } : {}"
        @click="selectedHead = selectedHead === head.headIndex ? null : head.headIndex"
      >
        <div class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: head.color }" />
        {{ head.name }}
      </button>
    </div>

    <!-- 2x2 热力图 -->
    <div class="grid grid-cols-2 gap-3 mb-4">
      <div
        v-for="head in store.multiHeadResults"
        :key="head.headIndex"
        class="bg-surface-50 rounded-lg p-3 cursor-pointer transition-all"
        :class="{ 'ring-2 ring-offset-1': selectedHead === head.headIndex }"
        :style="selectedHead === head.headIndex ? { '--tw-ring-color': head.color } : {}"
        @click="selectedHead = selectedHead === head.headIndex ? null : head.headIndex"
      >
        <div class="flex items-center gap-1.5 mb-1.5">
          <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: head.color }" />
          <span class="text-xs font-bold text-surface-700">{{ head.name }}</span>
        </div>
        <p class="text-xs text-surface-500 mb-2">{{ head.description }}</p>
        <div class="flex flex-col">
          <div v-for="(rowToken, i) in store.tokens" :key="i" class="flex">
            <div
              v-for="(colToken, j) in store.tokens"
              :key="j"
              class="border border-surface-200"
              :style="{ width: '28px', height: '28px', backgroundColor: getHeatmapColor(head.matrix.weights[i]?.[j] || 0, head.color) }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 选中 Head 详情 -->
    <div v-if="selectedHead !== null" class="mb-4">
      <div class="bg-surface-50 rounded-lg p-3">
        <h3 class="text-sm font-bold text-surface-800 mb-2">{{ store.multiHeadResults[selectedHead]?.name }}</h3>
        <div class="flex flex-col">
          <div v-for="(rowToken, i) in store.tokens" :key="i" class="flex items-center">
            <div class="w-10 text-right pr-1 text-xs font-bold" :style="{ color: rowToken.color }">{{ rowToken.text }}</div>
            <div
              v-for="(colToken, j) in store.tokens"
              :key="j"
              class="border border-surface-200 flex items-center justify-center text-xs font-bold"
              :style="{
                width: '40px', height: '40px',
                backgroundColor: getHeatmapColor(store.multiHeadResults[selectedHead]?.matrix.weights[i]?.[j] || 0, store.multiHeadResults[selectedHead]?.color || '#6366f1'),
              }"
            >
              {{ ((store.multiHeadResults[selectedHead]?.matrix.weights[i]?.[j] || 0) * 100).toFixed(0) }}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 关键信息 -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div class="flex items-start gap-2">
        <span class="i-lucide-lightbulb text-blue-500"></span>
        <p class="text-xs text-blue-700 leading-relaxed">
          <strong>关键：</strong>多个 Head 并行，每个学到不同注意力模式，最后拼接结果。
        </p>
      </div>
    </div>
  </div>
</template>
