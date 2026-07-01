/**
 * 步骤 6: Attention Matrix 📊
 *
 * 热力图展示注意力权重
 * 紧凑布局
 */

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTransformerStore } from '@/stores/transformer'

const store = useTransformerStore()

const selectedRow = ref<number | null>(null)
const cellSize = 50

function getHeatmapColor(value: number): string {
  const r = 255
  const g = Math.floor(255 * (1 - value))
  const b = Math.floor(100 * (1 - value))
  return `rgb(${r}, ${g}, ${b})`
}

onMounted(() => { store.executeStep(5) })
</script>

<template>
  <div>
    <h2 class="text-xl font-bold text-surface-800 mb-1">Step 6: Attention Matrix 📊</h2>
    <p class="text-sm text-surface-500 mb-4">热力图展示所有词之间的注意力权重</p>

    <!-- 热力图 -->
    <div class="mb-4 overflow-x-auto">
      <div class="inline-block">
        <!-- 列标题 -->
        <div class="flex ml-16 mb-1">
          <div v-for="(token, j) in store.tokens" :key="j" class="text-center text-xs font-bold" :style="{ width: `${cellSize}px`, color: token.color }">
            {{ token.text }}
          </div>
        </div>

        <!-- 矩阵行 -->
        <div v-for="(rowToken, i) in store.tokens" :key="i" class="flex items-center">
          <div class="w-16 text-right pr-2 text-xs font-bold" :style="{ color: rowToken.color }">{{ rowToken.text }}</div>
          <div
            v-for="(colToken, j) in store.tokens"
            :key="j"
            class="border border-surface-300 flex items-center justify-center cursor-pointer transition-all hover:scale-110 hover:z-10 text-xs font-bold"
            :style="{
              width: `${cellSize}px`, height: `${cellSize}px`,
              backgroundColor: getHeatmapColor(store.attentionMatrix?.weights[i]?.[j] || 0),
              opacity: selectedRow !== null && selectedRow !== i ? 0.3 : 1,
            }"
            @click="selectedRow = selectedRow === i ? null : i"
          >
            {{ ((store.attentionMatrix?.weights[i]?.[j] || 0) * 100).toFixed(0) }}%
          </div>
        </div>
      </div>
    </div>

    <!-- 选中行详情 -->
    <div v-if="selectedRow !== null" class="mb-4">
      <p class="text-xs text-surface-400 mb-2">
        <span class="font-bold" :style="{ color: store.tokens[selectedRow].color }">{{ store.tokens[selectedRow].text }}</span> 的注意力分布
      </p>
      <div class="flex gap-2">
        <div v-for="(token, j) in store.tokens" :key="j" class="flex flex-col items-center flex-1">
          <div class="w-full rounded-md mb-1 transition-all" :style="{ height: `${(store.attentionMatrix?.weights[selectedRow]?.[j] || 0) * 100 + 10}px`, backgroundColor: token.color }" />
          <span class="text-xs font-bold" :style="{ color: token.color }">{{ token.text }}</span>
          <span class="text-xs text-surface-400">{{ ((store.attentionMatrix?.weights[selectedRow]?.[j] || 0) * 100).toFixed(0) }}%</span>
        </div>
      </div>
    </div>

    <!-- 关键信息 -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div class="flex items-start gap-2">
        <span class="i-lucide-lightbulb text-blue-500"></span>
        <p class="text-xs text-blue-700 leading-relaxed">
          <strong>关键：</strong>热力图直观展示每个词对其他词的"关注程度"，颜色越深注意力越集中。
        </p>
      </div>
    </div>
  </div>
</template>
