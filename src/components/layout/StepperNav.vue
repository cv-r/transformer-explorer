/**
 * 步骤导航组件
 *
 * 顶部 Stepper，紧凑布局
 * 横向滚动，适配小屏幕
 */

<script setup lang="ts">
import { useTransformerStore } from '@/stores/transformer'

const store = useTransformerStore()
</script>

<template>
  <nav class="bg-white border-b border-surface-200">
    <div class="max-w-[1800px] mx-auto px-4 py-2">
      <div class="flex items-center gap-1 overflow-x-auto scrollbar-hide">
        <template v-for="(step, index) in store.steps" :key="step.id">
          <!-- 步骤按钮 -->
          <button
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all duration-150"
            :class="{
              'bg-primary text-white shadow-sm': store.currentStep === index,
              'text-surface-500 hover:bg-surface-100 hover:text-surface-700': store.currentStep !== index,
            }"
            @click="store.goToStep(index)"
          >
            <span :class="step.icon" class="text-sm"></span>
            <span>{{ step.title }}</span>
          </button>

          <!-- 连接线 -->
          <div
            v-if="index < store.steps.length - 1"
            class="w-4 h-px shrink-0"
            :class="index < store.currentStep ? 'bg-primary/40' : 'bg-surface-200'"
          />
        </template>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
