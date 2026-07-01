/**
 * 步骤控制组件
 *
 * 底部控制栏，紧凑布局
 * 固定在页面底部
 */

<script setup lang="ts">
import { useTransformerStore } from '@/stores/transformer'

const store = useTransformerStore()
</script>

<template>
  <div class="bg-white border-t border-surface-200">
    <div class="max-w-[1800px] mx-auto px-4 py-2.5 flex items-center justify-between">
      <!-- 左侧：步骤进度 -->
      <div class="flex items-center gap-3">
        <span class="text-xs text-surface-400">
          {{ store.currentStep + 1 }} / {{ store.steps.length }}
        </span>
        <div class="flex items-center gap-1">
          <div
            v-for="(step, index) in store.steps"
            :key="step.id"
            class="w-1.5 h-1.5 rounded-full transition-colors"
            :class="{
              'bg-primary': index === store.currentStep,
              'bg-surface-300': index !== store.currentStep,
            }"
          />
        </div>
      </div>

      <!-- 中间：控制按钮 -->
      <div class="flex items-center gap-2">
        <button
          class="px-4 py-1.5 text-xs font-medium rounded-md border border-surface-300 text-surface-600 hover:bg-surface-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          :disabled="!store.canGoPrev"
          @click="store.prevStep"
        >
          <span class="i-lucide-arrow-left text-sm"></span> 上一步
        </button>
        <button
          class="px-4 py-1.5 text-xs font-medium rounded-md bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          :disabled="!store.canGoNext"
          @click="store.nextStep"
        >
          下一步 <span class="i-lucide-arrow-right text-sm"></span>
        </button>
      </div>

      <!-- 右侧：快捷键提示 -->
      <div class="text-xs text-surface-300 hidden md:flex items-center gap-1">
        <span class="i-lucide-arrow-left"></span>
        <span class="i-lucide-arrow-right"></span>
        切换步骤
      </div>
    </div>
  </div>
</template>
