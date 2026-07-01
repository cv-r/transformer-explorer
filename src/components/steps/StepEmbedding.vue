/**
 * 步骤 2: Embedding 🔢
 *
 * Token ID 变成向量
 * 紧凑布局
 */

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTransformerStore } from '@/stores/transformer'
import { useAnimation } from '@/composables/useAnimation'
import { cosineSimilarity } from '@/utils/math'

const store = useTransformerStore()
const { play } = useAnimation(15, 500)

const selectedToken = ref<number | null>(null)

/** 二维投影坐标 */
const tokenPositions = computed(() => {
  return store.tokens.map((_, i) => {
    const emb = store.embeddings[i]
    if (!emb) return { x: 0, y: 0 }
    return {
      x: emb.values[0] * 150 + 200,
      y: emb.values[1] * 150 + 150,
    }
  })
})

/** 相似度列表 */
const similarities = computed(() => {
  if (selectedToken.value === null || !store.embeddings[selectedToken.value]) return []
  const selectedEmb = store.embeddings[selectedToken.value].values
  return store.tokens
    .map((token, i) => ({
      token: token.text,
      similarity: cosineSimilarity(selectedEmb, store.embeddings[i].values),
      color: token.color,
    }))
    .sort((a, b) => b.similarity - a.similarity)
})

onMounted(() => { store.executeStep(1); play() })
</script>

<template>
  <div>
    <h2 class="text-xl font-bold text-surface-800 mb-1">Step 2: Embedding 🔢</h2>
    <p class="text-sm text-surface-500 mb-5">Token ID 变成有意义的向量</p>

    <!-- Token → 向量 -->
    <div class="mb-5">
      <p class="text-xs text-surface-400 mb-2">Embedding 转换</p>
      <div class="space-y-2">
        <div
          v-for="(token, index) in store.tokens"
          :key="index"
          class="flex items-center gap-3 bg-surface-50 rounded-lg p-2.5 text-sm"
        >
          <span class="px-2.5 py-1 rounded text-white text-xs font-bold shrink-0" :style="{ backgroundColor: token.color }">
            {{ token.text }}
          </span>
          <span class="text-surface-400 text-xs">→</span>
          <span class="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-mono">ID:{{ token.id }}</span>
          <span class="text-surface-400 text-xs">→</span>
          <span v-if="store.embeddings[index]" class="font-mono text-xs text-surface-600 truncate">
            [{{ store.embeddings[index].values.slice(0, 4).map(v => v.toFixed(2)).join(', ') }}...]
          </span>
        </div>
      </div>
    </div>

    <!-- 散点图 + 相似度 并排 -->
    <div class="grid grid-cols-2 gap-4 mb-5">
      <!-- 散点图 -->
      <div>
        <p class="text-xs text-surface-400 mb-1.5">向量空间（点击查看相似度）</p>
        <div class="bg-surface-800 rounded-lg p-3 relative" style="height: 220px;">
          <svg width="100%" height="100%" viewBox="0 0 400 220">
            <line x1="20" y1="110" x2="380" y2="110" stroke="#475569" stroke-width="0.5" />
            <line x1="200" y1="10" x2="200" y2="210" stroke="#475569" stroke-width="0.5" />
            <g
              v-for="(token, index) in store.tokens"
              :key="index"
              class="cursor-pointer"
              @click="selectedToken = index"
            >
              <circle
                :cx="tokenPositions[index]?.x || 0"
                :cy="tokenPositions[index]?.y || 0"
                r="5"
                :fill="token.color"
                :stroke="selectedToken === index ? 'white' : 'none'"
                stroke-width="2"
              />
              <text
                :x="(tokenPositions[index]?.x || 0) + 8"
                :y="(tokenPositions[index]?.y || 0) + 4"
                :fill="token.color"
                style="font-size: 11px"
                font-weight="bold"
              >
                {{ token.text }}
              </text>
            </g>
          </svg>
        </div>
      </div>

      <!-- 相似度 -->
      <div>
        <p class="text-xs text-surface-400 mb-1.5">
          {{ selectedToken !== null ? `与"${store.tokens[selectedToken]?.text}"的相似度` : '点击左侧点查看相似度' }}
        </p>
        <div v-if="selectedToken !== null" class="space-y-1.5">
          <div
            v-for="item in similarities"
            :key="item.token"
            class="flex items-center gap-2"
          >
            <span class="w-10 text-xs font-bold text-right" :style="{ color: item.color }">{{ item.token }}</span>
            <div class="flex-1 bg-surface-200 rounded-full h-3 overflow-hidden">
              <div class="h-full rounded-full transition-all" :style="{ width: `${Math.max(0, item.similarity * 100)}%`, backgroundColor: item.color }" />
            </div>
            <span class="text-xs font-mono text-surface-500 w-10 text-right">{{ (item.similarity * 100).toFixed(0) }}%</span>
          </div>
        </div>
        <div v-else class="text-xs text-surface-400 italic">点击散点图中的词</div>
      </div>
    </div>

    <!-- 关键信息 -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div class="flex items-start gap-2">
        <span class="i-lucide-lightbulb text-blue-500"></span>
        <p class="text-xs text-blue-700 leading-relaxed">
          <strong>关键：</strong>Embedding 将离散 ID 映射到连续向量空间，语义相近的词（苹果、香蕉）距离更近。
        </p>
      </div>
    </div>
  </div>
</template>
