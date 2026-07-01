/**
 * 解释面板
 *
 * 右侧教学内容区域
 * - h-full 填满父容器
 * - overflow-y-auto 内容超出时独立滚动
 */

<script setup lang="ts">
import { computed } from 'vue'
import { useTransformerStore } from '@/stores/transformer'
import type { TeachingContent } from '@/types'

const store = useTransformerStore()

const teachingContent: Record<string, TeachingContent> = {
  tokenizer: {
    title: '什么是 Token？',
    whyExists: 'AI 模型不认识文字，只认识数字。所以我们需要把文字"翻译"成数字。',
    solvesProblem: 'Tokenizer 将一句话切分成一个个小单元（Token），每个 Token 对应一个数字 ID。',
    withoutIt: '没有 Tokenizer，模型根本无法处理文字输入。',
    analogy: '就像把一句话切成一个个词牌，每个词牌上写着一个数字。',
  },
  embedding: {
    title: '什么是 Embedding？',
    whyExists: 'Token ID 只是一个编号（苹果=18），没有语义信息。数字 18 和 19 之间没有特殊含义。',
    solvesProblem: 'Embedding 将 ID 映射到一个高维向量空间，让语义相近的词距离更近。',
    withoutIt: '没有 Embedding，模型无法理解词与词之间的关系。',
    analogy: '就像给每个词在地图上标一个位置，意思相近的词会靠得很近。',
  },
  position: {
    title: '为什么需要位置编码？',
    whyExists: 'Transformer 的 Attention 机制是"无序"的，它不知道词的先后顺序。',
    solvesProblem: 'Position Encoding 给每个词加上位置信息，让模型知道"苹果发布了"和"发布了苹果"是不同的。',
    withoutIt: '没有位置编码，"我吃了苹果"和"苹果吃了我"对模型来说是一样的。',
    analogy: '就像给排队的人发号码牌，模型就知道谁在前谁在后了。',
  },
  qkv: {
    title: '什么是 Q, K, V？',
    whyExists: '每个词在不同场景下扮演不同角色：有时是"提问者"，有时是"被查询者"。',
    solvesProblem: 'Q(Query) 是问题，K(Key) 是标签，V(Value) 是内容。Attention 通过 Q 和 K 的匹配来决定从 V 中提取什么信息。',
    withoutIt: '没有 QKV，模型无法动态地"关注"输入中不同位置的信息。',
    analogy: '在图书馆找书：你带着问题(Q)去匹配书的标签(K)，然后取出书的内容(V)。',
  },
  attention: {
    title: 'Attention 是怎么工作的？',
    whyExists: '一个词的意思往往取决于上下文。"苹果"在"苹果发布手机"中是公司，在"吃苹果"中是水果。',
    solvesProblem: 'Attention 让每个词都能"看到"其他所有词，并根据相关性加权聚合信息。',
    withoutIt: '没有 Attention，每个词都是孤立的，无法理解上下文。',
    analogy: '就像在一个会议上，每个人都在听别人说话，但会特别关注和自己相关的内容。',
  },
  matrix: {
    title: 'Attention 矩阵',
    whyExists: '我们需要可视化地看到每个词关注了哪些词。',
    solvesProblem: '热力图展示了所有词之间的注意力权重，颜色越深表示关注度越高。',
    withoutIt: '没有矩阵视图，我们无法直观理解模型的"注意力"分布。',
    analogy: '就像一张关注度地图，一目了然地看到谁在关注谁。',
  },
  multihead: {
    title: '什么是多头注意力？',
    whyExists: '一个 Attention 只能关注一种模式，但语言有很多层面（语法、语义、位置等）。',
    solvesProblem: '多个 Head 并行工作，每个 Head 关注不同的模式，最后合并结果。',
    withoutIt: '只有一个 Head，模型只能学到一种注意力模式，表达能力有限。',
    analogy: '就像同时派出多个侦探，每个侦探负责调查不同的线索，最后汇总所有线索。',
  },
  feedforward: {
    title: '为什么需要 Feed Forward？',
    whyExists: 'Attention 负责"词与词之间的交互"，但每个词还需要自己的"深度思考"。',
    solvesProblem: 'Feed Forward 是一个小型神经网络，让每个词独立地进行非线性变换。',
    withoutIt: '没有 FFN，模型只能做线性变换，无法学到复杂的模式。',
    analogy: 'Attention 像开会讨论，FFN 像独自思考。讨论完之后，每个人还要消化信息。',
  },
  layernorm: {
    title: '什么是 LayerNorm？',
    whyExists: '深层网络中，数值范围会不断变化（内部协变量偏移），导致训练不稳定。',
    solvesProblem: 'LayerNorm 将每一层的输出归一化到稳定的范围，让训练更稳定、更快。',
    withoutIt: '没有 LayerNorm，深层网络的数值可能会爆炸或消失，导致训练失败。',
    analogy: '就像给每个学生打分时，先将分数标准化，避免某次考试太难或太简单影响评判。',
  },
  residual: {
    title: '什么是残差连接？',
    whyExists: '网络层数增加后，梯度会消失，深层网络很难训练。',
    solvesProblem: '残差连接让信息可以"跳过"某些层直接传递，解决了梯度消失问题。',
    withoutIt: '没有残差连接，几十层的网络几乎无法训练。',
    analogy: '就像高速公路的匝道，如果某段路堵了，你可以从匝道直接绕过去。',
  },
  output: {
    title: '最终输出',
    whyExists: '我们想知道模型对下一个词的预测。',
    solvesProblem: '输出层将向量映射回词汇表大小，再用 Softmax 得到概率分布。',
    withoutIt: '没有输出层，模型无法给出预测结果。',
    analogy: '就像考试结束后，老师把你的答案转换成分数和排名。',
  },
}

const currentContent = computed(() => {
  return teachingContent[store.currentStepInfo.id] || {
    title: '',
    whyExists: '',
    solvesProblem: '',
    withoutIt: '',
    analogy: '',
  }
})
</script>

<template>
  <div class="h-full bg-white rounded-xl shadow-sm border border-surface-200 overflow-y-auto p-4">
    <!-- 标题 -->
    <h2 class="text-sm font-bold text-surface-800 mb-3 flex items-center gap-2">
      <span class="i-lucide-book-open text-base"></span> 解释
    </h2>

    <!-- 步骤标题 -->
    <h3 class="text-lg font-bold text-surface-800 mb-3">{{ currentContent.title }}</h3>

    <!-- 为什么存在 -->
    <div class="mb-3">
      <div class="flex items-center gap-1.5 mb-1">
        <span class="i-lucide-help-circle text-sm text-primary"></span>
        <span class="text-xs font-semibold text-surface-600">为什么需要这个？</span>
      </div>
      <p class="text-xs text-surface-500 leading-relaxed">{{ currentContent.whyExists }}</p>
    </div>

    <!-- 解决什么问题 -->
    <div class="mb-3">
      <div class="flex items-center gap-1.5 mb-1">
        <span class="i-lucide-check-circle text-sm text-success"></span>
        <span class="text-xs font-semibold text-surface-600">解决什么问题？</span>
      </div>
      <p class="text-xs text-surface-500 leading-relaxed">{{ currentContent.solvesProblem }}</p>
    </div>

    <!-- 如果没有会怎样 -->
    <div class="mb-3">
      <div class="flex items-center gap-1.5 mb-1">
        <span class="i-lucide-alert-triangle text-sm text-danger"></span>
        <span class="text-xs font-semibold text-surface-600">如果没有会怎样？</span>
      </div>
      <p class="text-xs text-surface-500 leading-relaxed">{{ currentContent.withoutIt }}</p>
    </div>

    <!-- 类比 -->
    <div v-if="currentContent.analogy">
      <div class="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <div class="flex items-center gap-1.5 mb-1">
          <span class="i-lucide-lightbulb text-sm text-accent"></span>
          <span class="text-xs font-semibold text-amber-700">通俗理解</span>
        </div>
        <p class="text-xs text-amber-600 leading-relaxed">{{ currentContent.analogy }}</p>
      </div>
    </div>
  </div>
</template>
