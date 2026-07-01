/**
 * Transformer Explorer - 主应用
 *
 * 布局策略：flexbox 纵向排列
 * - 顶部固定区域（header + stepper）
 * - 中间弹性区域（三栏，各自独立滚动）
 * - 底部固定控制栏
 */

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTransformerStore } from '@/stores/transformer'
import StepperNav from '@/components/layout/StepperNav.vue'
import InputPanel from '@/components/layout/InputPanel.vue'
import VisualizationPanel from '@/components/layout/VisualizationPanel.vue'
import ExplanationPanel from '@/components/layout/ExplanationPanel.vue'
import StepControls from '@/components/layout/StepControls.vue'

const store = useTransformerStore()

onMounted(() => {
  store.executeStep(0)
})
</script>

<template>
  <div class="h-screen flex flex-col bg-surface-50 overflow-hidden">
    <!-- ===== 顶部固定区域 ===== -->
    <header class="shrink-0 bg-white border-b border-surface-200 z-50">
      <div class="max-w-[1800px] mx-auto px-6 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <span class="i-lucide-brain text-white text-lg"></span>
          </div>
          <div>
            <h1 class="text-lg font-bold text-surface-800 leading-tight">Transformer Explorer</h1>
            <p class="text-xs text-surface-400">理解 AI 的核心算法</p>
          </div>
        </div>
        <button class="btn-primary text-sm flex items-center gap-1.5" @click="store.reset">
          <span class="i-lucide-rotate-ccw text-sm"></span> 重新开始
        </button>
      </div>
    </header>

    <!-- 步骤导航 -->
    <StepperNav class="shrink-0" />

    <!-- ===== 中间弹性区域：三栏布局 ===== -->
    <main class="flex-1 min-h-0">
      <div class="h-full max-w-[1800px] mx-auto px-4 py-4 flex gap-4">
        <!-- 左侧：输入面板 -->
        <aside class="w-[260px] shrink-0 h-full overflow-hidden">
          <InputPanel />
        </aside>

        <!-- 中间：可视化面板（核心区域） -->
        <section class="flex-1 min-w-0 h-full overflow-hidden">
          <VisualizationPanel />
        </section>

        <!-- 右侧：解释面板 -->
        <aside class="w-[280px] shrink-0 h-full overflow-hidden">
          <ExplanationPanel />
        </aside>
      </div>
    </main>

    <!-- ===== 底部固定控制栏 ===== -->
    <StepControls class="shrink-0" />
  </div>
</template>

<style>
/* 全局滚动条美化 */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
