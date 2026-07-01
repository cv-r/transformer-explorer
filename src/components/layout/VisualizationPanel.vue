/**
 * 可视化面板
 *
 * 中间的可视化区域
 * - h-full 填满父容器
 * - overflow-y-auto 内容超出时独立滚动
 * - 根据当前步骤显示对应组件
 */

<script setup lang="ts">
import { useTransformerStore } from '@/stores/transformer'
import StepTokenizer from '@/components/steps/StepTokenizer.vue'
import StepEmbedding from '@/components/steps/StepEmbedding.vue'
import StepPosition from '@/components/steps/StepPosition.vue'
import StepQKV from '@/components/steps/StepQKV.vue'
import StepAttention from '@/components/steps/StepAttention.vue'
import StepAttentionMatrix from '@/components/steps/StepAttentionMatrix.vue'
import StepMultiHead from '@/components/steps/StepMultiHead.vue'
import StepFeedForward from '@/components/steps/StepFeedForward.vue'
import StepLayerNorm from '@/components/steps/StepLayerNorm.vue'
import StepResidual from '@/components/steps/StepResidual.vue'
import StepOutput from '@/components/steps/StepOutput.vue'

const store = useTransformerStore()

const stepComponents: Record<number, any> = {
  0: StepTokenizer,
  1: StepEmbedding,
  2: StepPosition,
  3: StepQKV,
  4: StepAttention,
  5: StepAttentionMatrix,
  6: StepMultiHead,
  7: StepFeedForward,
  8: StepLayerNorm,
  9: StepResidual,
  10: StepOutput,
}
</script>

<template>
  <div class="h-full bg-white rounded-xl shadow-sm border border-surface-200 overflow-y-auto p-5">
    <component :is="stepComponents[store.currentStep]" />
  </div>
</template>
