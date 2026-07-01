/**
 * 步骤 9: LayerNorm ⚖️
 *
 * 层归一化
 * 紧凑布局，带开关演示
 */

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTransformerStore } from '@/stores/transformer'
import { layerNorm } from '@/utils/math'

const store = useTransformerStore()

const enableLayerNorm = ref(true)

const unnormalizedValues = ref([2.5, -1.8, 3.2, -0.5, 4.1, -2.3, 5.8, -3.1])

const normalizedValues = computed(() => layerNorm(unnormalizedValues.value))

const deepLayers = computed(() => {
  const layers: { layer: number; max: number; min: number }[] = []
  let current = [...unnormalizedValues.value]
  for (let i = 0; i < 8; i++) {
    current = current.map(v => v * 1.5 + (Math.random() - 0.5) * 0.5)
    layers.push({ layer: i + 1, max: Math.max(...current), min: Math.min(...current) })
  }
  return layers
})

onMounted(() => { store.executeStep(8) })
</script>

<template>
  <div>
    <h2 class="text-xl font-bold text-surface-800 mb-1">Step 9: LayerNorm ⚖️</h2>
    <p class="text-sm text-surface-500 mb-4">稳定训练过程中的数值范围</p>

    <!-- 开关 -->
    <div class="flex items-center gap-3 mb-4">
      <span class="text-sm text-surface-600">LayerNorm：</span>
      <button
        class="relative w-12 h-6 rounded-full transition-colors"
        :class="enableLayerNorm ? 'bg-primary' : 'bg-surface-400'"
        @click="enableLayerNorm = !enableLayerNorm"
      >
        <div
          class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
          :class="enableLayerNorm ? 'translate-x-6' : 'translate-x-0.5'"
        />
      </button>
      <span class="text-xs text-surface-400">{{ enableLayerNorm ? '已启用' : '已关闭' }}</span>
    </div>

    <!-- 对比展示 -->
    <div class="grid grid-cols-2 gap-3 mb-4">
      <div class="bg-surface-50 rounded-lg p-3">
        <h3 class="text-xs font-bold text-surface-700 mb-2">原始值</h3>
        <div class="space-y-1">
          <div v-for="(val, i) in unnormalizedValues" :key="i" class="flex items-center gap-1.5">
            <span class="text-xs text-surface-400 w-4">{{ i }}</span>
            <div class="flex-1 bg-surface-200 rounded-full h-2.5 overflow-hidden">
              <div class="h-full rounded-full bg-surface-500" :style="{ width: `${Math.min(100, Math.abs(val) * 15)}%` }" />
            </div>
            <span class="font-mono text-xs w-8 text-right">{{ val.toFixed(1) }}</span>
          </div>
        </div>
      </div>
      <div class="rounded-lg p-3" :class="enableLayerNorm ? 'bg-green-50' : 'bg-red-50'">
        <h3 class="text-xs font-bold mb-2" :class="enableLayerNorm ? 'text-green-700' : 'text-red-700'">
          {{ enableLayerNorm ? 'LayerNorm 后' : '没有 LayerNorm' }}
        </h3>
        <div class="space-y-1">
          <div v-for="(val, i) in enableLayerNorm ? normalizedValues : unnormalizedValues" :key="i" class="flex items-center gap-1.5">
            <span class="text-xs text-surface-400 w-4">{{ i }}</span>
            <div class="flex-1 bg-surface-200 rounded-full h-2.5 overflow-hidden">
              <div class="h-full rounded-full" :class="enableLayerNorm ? 'bg-green-500' : 'bg-red-500'" :style="{ width: `${Math.min(100, Math.abs(val) * 15)}%` }" />
            </div>
            <span class="font-mono text-xs w-8 text-right">{{ val.toFixed(1) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 数值变化图 -->
    <div class="mb-4">
      <p class="text-xs text-surface-400 mb-1.5">{{ enableLayerNorm ? '有 LayerNorm 数值稳定' : '无数值归一化会爆炸' }}</p>
      <div class="bg-surface-800 rounded-lg p-3" style="height: 120px;">
        <svg width="100%" height="100%" viewBox="0 0 400 120">
          <line x1="40" y1="100" x2="360" y2="100" stroke="#475569" stroke-width="0.5" />
          <rect
            v-for="(layer, i) in deepLayers"
            :key="i"
            :x="40 + i * 40 + 5"
            :y="enableLayerNorm ? 50 : Math.max(10, 80 - layer.max * 5)"
            width="30"
            :height="enableLayerNorm ? 30 : Math.min(100, layer.max * 5)"
            :fill="enableLayerNorm ? '#10b981' : '#ef4444'"
            fill-opacity="0.7"
            rx="3"
          />
          <text v-for="i in 8" :key="i" :x="40 + (i - 1) * 40 + 20" y="115" text-anchor="middle" fill="#94a3b8" style="font-size: 9px">
            L{{ i }}
          </text>
        </svg>
      </div>
    </div>

    <!-- 关键信息 -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div class="flex items-start gap-2">
        <span class="i-lucide-lightbulb text-blue-500"></span>
        <p class="text-xs text-blue-700 leading-relaxed">
          <strong>关键：</strong>LayerNorm 归一化每层输出，防止数值爆炸，让深层网络可以训练。
        </p>
      </div>
    </div>
  </div>
</template>
