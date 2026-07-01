/**
 * 步骤 1: Tokenizer ✂️
 *
 * 将文本切分为 Token
 * 紧凑布局，避免溢出
 */

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useTransformerStore } from '@/stores/transformer'
import { useAnimation } from '@/composables/useAnimation'

const store = useTransformerStore()
const { currentFrame, play } = useAnimation(20, 400)

const phase = ref<'text' | 'split' | 'mapping' | 'complete'>('text')
const visibleTokens = ref(0)

watch(currentFrame, (frame) => {
  if (frame < 5) phase.value = 'text'
  else if (frame < 12) { phase.value = 'split'; visibleTokens.value = Math.min(frame - 4, store.tokens.length) }
  else if (frame < 18) phase.value = 'mapping'
  else { phase.value = 'complete'; visibleTokens.value = store.tokens.length }
})

onMounted(() => { store.executeStep(0); play() })
</script>

<template>
  <div>
    <!-- 标题 -->
    <h2 class="text-xl font-bold text-surface-800 mb-1">Step 1: Tokenizer ✂️</h2>
    <p class="text-sm text-surface-500 mb-5">将文本切分成一个个 Token</p>

    <!-- 输入文本 -->
    <div class="mb-5">
      <p class="text-xs text-surface-400 mb-1.5">输入文本</p>
      <div class="text-2xl font-bold text-surface-800">{{ store.inputText }}</div>
    </div>

    <!-- 切分动画 -->
    <div class="mb-5">
      <p class="text-xs text-surface-400 mb-2">切分结果</p>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="(token, index) in store.tokens"
          :key="index"
          class="transition-all duration-500"
          :class="index >= visibleTokens ? 'opacity-0 scale-75' : 'opacity-100 scale-100'"
        >
          <div
            class="px-4 py-2 rounded-lg text-white font-bold shadow-md hover:scale-110 transition-transform cursor-pointer"
            :style="{ backgroundColor: token.color }"
          >
            {{ token.text }}
          </div>
        </div>
      </div>
    </div>

    <!-- Token → ID 映射 -->
    <div v-if="phase === 'mapping' || phase === 'complete'" class="mb-5">
      <p class="text-xs text-surface-400 mb-2">词汇表映射</p>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="(token, index) in store.tokens"
          :key="index"
          class="flex items-center gap-2 bg-surface-50 rounded-lg px-3 py-2 animate-fade-in"
        >
          <span class="px-2 py-0.5 rounded text-white text-xs font-bold" :style="{ backgroundColor: token.color }">
            {{ token.text }}
          </span>
          <span class="text-surface-400 text-xs">→</span>
          <span class="font-mono text-sm text-primary font-bold">{{ token.id }}</span>
        </div>
      </div>
    </div>

    <!-- 关键信息 -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div class="flex items-start gap-2">
        <span class="i-lucide-lightbulb text-blue-500"></span>
        <p class="text-xs text-blue-700 leading-relaxed">
          <strong>关键：</strong>AI 模型不认识文字，只认识数字。Tokenizer 将文字"翻译"成数字 ID。
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
</style>
