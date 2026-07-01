/**
 * 输入面板
 *
 * 左侧输入区域，高度由父容器控制
 * 内容少，不需要滚动
 */

<script setup lang="ts">
import { useTransformerStore } from '@/stores/transformer'

const store = useTransformerStore()

const examples = [
  '苹果发布了新手机',
  '苹果发布了新电脑',
  '香蕉是好吃的水果',
]

function handleInput(e: Event): void {
  const target = e.target as HTMLTextAreaElement
  store.updateInput(target.value)
}

function selectExample(text: string): void {
  store.updateInput(text)
}
</script>

<template>
  <div class="h-full bg-white rounded-xl shadow-sm border border-surface-200 p-4 flex flex-col">
    <!-- 标题 -->
    <h2 class="text-sm font-bold text-surface-800 mb-3 flex items-center gap-2">
      <span class="i-lucide-file-text text-base"></span> 输入
    </h2>

    <!-- 输入框 -->
    <textarea
      :value="store.inputText"
      @input="handleInput"
      class="w-full h-20 p-2.5 border border-surface-200 rounded-lg resize-none focus:border-primary focus:outline-none transition-colors text-sm text-surface-800 mb-3"
      placeholder="输入一句话..."
    />

    <!-- 快捷示例 -->
    <div class="mb-3">
      <p class="text-xs text-surface-400 mb-2">试试这些：</p>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="example in examples"
          :key="example"
          class="text-xs px-2.5 py-1 bg-surface-100 text-surface-600 rounded-full hover:bg-primary hover:text-white transition-colors"
          @click="selectExample(example)"
        >
          {{ example }}
        </button>
      </div>
    </div>

    <!-- 当前步骤信息（推到底部） -->
    <div class="mt-auto">
      <div class="bg-surface-50 rounded-lg p-3">
        <div class="flex items-center gap-2 mb-1">
          <span :class="store.currentStepInfo.icon" class="text-base"></span>
          <span class="text-sm font-bold text-surface-800">
            {{ store.currentStepInfo.title }}
          </span>
        </div>
        <p class="text-xs text-surface-500 leading-relaxed">
          {{ store.currentStepInfo.description }}
        </p>
      </div>
    </div>
  </div>
</template>
