/**
 * 步骤 4: QKV 🔑
 *
 * 生成 Query, Key, Value
 * 紧凑布局
 */

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTransformerStore } from '@/stores/transformer'
import { useAnimation } from '@/composables/useAnimation'

const store = useTransformerStore()
const { play } = useAnimation(15, 500)

onMounted(() => { store.executeStep(3); play() })
</script>

<template>
  <div>
    <h2 class="text-xl font-bold text-surface-800 mb-1">Step 4: QKV 🔑</h2>
    <p class="text-sm text-surface-500 mb-4">每个词变成三种角色</p>

    <!-- 类比 -->
    <div class="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
      <p class="text-xs text-purple-700">
        <strong>图书馆类比：</strong>
        <strong class="text-red-600">Q</strong>（你脑中的问题）→
        <strong class="text-blue-600">K</strong>（书的标签）→
        <strong class="text-green-600">V</strong>（书的内容）
      </p>
    </div>

    <!-- QKV 展示 -->
    <div class="space-y-2 mb-4">
      <div v-for="(token, index) in store.tokens" :key="index" class="bg-surface-50 rounded-lg p-2.5">
        <div class="flex items-center gap-2 mb-2">
          <span class="px-2.5 py-1 rounded text-white text-xs font-bold" :style="{ backgroundColor: token.color }">
            {{ token.text }}
          </span>
          <span class="text-surface-400 text-xs">Embedding →</span>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <div class="bg-red-50 border border-red-100 rounded p-1.5">
            <div class="text-xs font-bold text-red-500 mb-0.5">Q Query</div>
            <div class="font-mono text-xs text-red-700 truncate">
              {{ store.qkv?.query[index]?.slice(0, 3).map(v => v.toFixed(2)).join(',') }}
            </div>
          </div>
          <div class="bg-blue-50 border border-blue-100 rounded p-1.5">
            <div class="text-xs font-bold text-blue-500 mb-0.5">K Key</div>
            <div class="font-mono text-xs text-blue-700 truncate">
              {{ store.qkv?.key[index]?.slice(0, 3).map(v => v.toFixed(2)).join(',') }}
            </div>
          </div>
          <div class="bg-green-50 border border-green-100 rounded p-1.5">
            <div class="text-xs font-bold text-green-500 mb-0.5">V Value</div>
            <div class="font-mono text-xs text-green-700 truncate">
              {{ store.qkv?.value[index]?.slice(0, 3).map(v => v.toFixed(2)).join(',') }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 角色说明 -->
    <div class="grid grid-cols-3 gap-2 mb-4">
      <div class="bg-red-50 rounded-lg p-2.5 text-center">
        <div class="i-lucide-search text-lg text-red-500 mb-0.5 mx-auto"></div>
        <div class="text-xs font-bold text-red-700">Query</div>
        <div class="text-xs text-red-500">"我在找什么？"</div>
      </div>
      <div class="bg-blue-50 rounded-lg p-2.5 text-center">
        <div class="i-lucide-tag text-lg text-blue-500 mb-0.5 mx-auto"></div>
        <div class="text-xs font-bold text-blue-700">Key</div>
        <div class="text-xs text-blue-500">"我是什么？"</div>
      </div>
      <div class="bg-green-50 rounded-lg p-2.5 text-center">
        <div class="i-lucide-package text-lg text-green-500 mb-0.5 mx-auto"></div>
        <div class="text-xs font-bold text-green-700">Value</div>
        <div class="text-xs text-green-500">"我能提供什么？"</div>
      </div>
    </div>

    <!-- 关键信息 -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div class="flex items-start gap-2">
        <span class="i-lucide-lightbulb text-blue-500"></span>
        <p class="text-xs text-blue-700 leading-relaxed">
          <strong>关键：</strong>每个词在不同场景扮演不同角色。Q 是提问者，K 是标签，V 是内容。
        </p>
      </div>
    </div>
  </div>
</template>
