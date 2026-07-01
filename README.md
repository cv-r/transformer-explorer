# 🧠 Transformer Explorer

**30 分钟，看懂 AI 的大脑。**

一个交互式的 Transformer 可视化教学项目。将一句话输入模型，跟随动画逐步观察：文字如何变成数字 → 向量如何捕获语义 → Attention 如何理解上下文 → 最终如何预测下一个词。

**零 AI 依赖** — 所有数学计算（矩阵乘法、Softmax、Attention、位置编码…）全部手写实现，每一行代码你都能看懂。

---

## 🎯 为什么做这个项目？

GPT、Claude、Gemini、DeepSeek、Qwen…所有大语言模型都基于 Transformer 架构。但大多数人对它的理解停留在"矩阵乘法 + 注意力"的模糊概念上。

这个项目让你**亲眼看到**数据在 Transformer 内部的流转过程：

- 不是看论文公式，而是**看动画演示**
- 不是读源码，而是**看数据变换**
- 不是抽象的数学，而是**可视化的热力图和连线图**

---

## 🚀 快速开始

```bash
npm install
npm run dev
```

打开浏览器，点击「苹果发布了新手机」，然后点「下一步」，一步一步走完 11 个步骤。

---

## 📚 学习路径（11 步）

| 步骤 | 名称 | 你会看到什么 | 核心问题 |
|:---:|------|------------|----------|
| 1 | **Tokenizer** ✂️ | 文字逐词切分动画，Token → ID 映射 | AI 不认识文字，怎么把文字变成数字？ |
| 2 | **Embedding** 🔢 | 向量空间散点图，语义相似度条形图 | 数字 ID 没有含义，怎么让它有语义？ |
| 3 | **Position** 📍 | 正弦波位置编码，向量加法拆解 | Attention 是无序的，怎么让模型知道词序？ |
| 4 | **QKV** 🔑 | Q/K/V 三列并排对比，角色卡片 | 每个词怎么同时扮演"提问者"和"被查者"？ |
| 5 | **Attention** 👁️ | SVG 连线图 + 权重条形图，选中词看关注度 | 一个词怎么"关注"到其他所有词？ |
| 6 | **Attention Matrix** 📊 | 可点击热力图，选中行柱状图 | 怎么一眼看懂所有词之间的注意力分布？ |
| 7 | **Multi-Head** 🧠 | 2×2 四宫格热力图对比，点击放大 | 一个 Attention 不够，多个并行会怎样？ |
| 8 | **Feed Forward** ⚡ | Linear→ReLU→Linear 数据流管线 | Attention 负责交互，谁负责每个词的"独立思考"？ |
| 9 | **LayerNorm** ⚖️ | 归一化前后对比 + 开关演示 | 深层网络数值会爆炸，怎么稳定？ |
| 10 | **Residual** 🔗 | 跳过连接的 SVG 动画流程图 | 网络越深梯度越弱，怎么让信息直达？ |
| 11 | **Output** 🎯 | 概率条形图，预测结果高亮 | 模型怎么从向量回到文字，预测下一个词？ |

每一步都有：
- 🎬 **自动播放动画** — 数据流动可视化
- 📖 **右侧解释面板** — 为什么需要这个？解决了什么问题？如果没有会怎样？通俗类比
- 🖱️ **交互操作** — 点击 Token 选择、拖拽查看、热力图点击放大

---

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| **Vue 3** + Composition API | 响应式 UI，`<component :is>` 动态渲染步骤组件 |
| **TypeScript** | 所有数据流有类型约束 |
| **Pinia** | 单一 Store 管理全部状态（输入文本、11 步计算结果、动画状态） |
| **Vite** | 开发服务器 + 构建 |
| **UnoCSS** | 原子化 CSS + Lucide 图标 + 自定义主题色 |
| **SVG** | 散点图、热力图、连线图、波形图 — 全部手写 SVG，无图表库依赖 |

---

## 📁 架构

```
src/
├── types/index.ts           # 所有 TS 类型定义（Token, Vector, QKVMatrix, AttentionMatrix...）
├── stores/transformer.ts    # Pinia Store：单一状态源，11 步计算编排
├── utils/                   # 纯计算工具（零副作用）
│   ├── math.ts              # 矩阵乘法、Softmax、ReLU、LayerNorm、Attention、位置编码
│   ├── tokenizer.ts         # 中文最大匹配分词器
│   ├── embedding.ts         # 8 维预训练向量查找
│   ├── qkv.ts               # Q/K/V 权重矩阵 × Embedding
│   ├── feedforward.ts       # 8→16→8 双层 MLP
│   └── prediction.ts        # 模拟词表预测
├── composables/useAnimation.ts  # 动画控制（播放/暂停/帧步进/速度）
└── components/
    ├── layout/              # 布局组件（StepperNav / InputPanel / VisualizationPanel / ExplanationPanel / StepControls）
    └── steps/               # 11 个步骤组件，每个独立负责一个 Step 的可视化
```

### 设计原则

1. **计算与展示完全分离** — `utils/` 只做纯数学计算，`components/steps/` 只做可视化渲染
2. **Store 是唯一的数据通道** — 所有组件只读 Store，不传 props
3. **步骤可跳跃** — `goToStep(n)` 自动计算 0..n 全部前置步骤，保证数据依赖完整
4. **教学优先** — Feed Forward、QKV 等模块返回完整的中间状态，便于可视化

---

## 🧪 技术细节

### 为什么手写数学运算？

市面上的 AI 教程大多只展示概念图，或者直接调用 PyTorch。这个项目选择了第三条路：

- 每一个数学运算都是可读、可调试的 TypeScript 函数
- 你可以打断点、console.log 中间值、修改参数看效果
- `src/utils/math.ts` 里的 `scaledDotProductAttention()` 函数完整实现了 Attention 公式，大约 20 行代码

### 数据是模拟的，逻辑是真实的

- Tokenizer 用的是硬编码中文词汇表（不是真实 BPE），但**分词逻辑**是真实的最大匹配法
- Embedding 用的是预设向量（不是训练出来的），但**向量空间语义聚类的效果**是真实体现的
- QKV 权重矩阵是随机生成的（不是训练好的），但**矩阵乘法计算过程**是真实的
- 最终预测结果是硬编码的"合理答案"，但**输出层映射逻辑**是真实的

> 这个项目教的是 **Transformer 怎么工作**，不是怎么训练一个 GPT。

---

## 🤝 贡献

欢迎任何形式的贡献：

- 🐛 **Bug 修复** — 发现计算错误或显示问题，直接提 PR
- 🎨 **可视化改进** — 让某一步的动画更清晰、更直观
- 📖 **教学内容补充** — 改进右侧解释面板的文字，让概念更容易理解
- 🌐 **英文翻译** — 帮助更多语言的学习者
- ✨ **新功能** — 比如：支持英文输入、真实的 BPE Tokenizer、Attention 权重 Mask 演示

### 开发约定

- 新步骤组件放在 `src/components/steps/StepXxx.vue`
- 在 `VisualizationPanel.vue` 的 `stepComponents` 中注册
- 在 `stores/transformer.ts` 的 `STEPS` 数组和 `executeStep` 中添加
- 计算逻辑放 `src/utils/`，可视化逻辑放 `components/steps/`

---

## 📖 学完之后

完成这 11 步，你将对以下概念有**直观理解**（不只是背定义）：

- 为什么 Tokenizer 是 AI 理解语言的第一步
- Embedding 空间为什么能捕获语义相似性
- Attention 的本质是"根据相关性加权求和"
- Multi-Head 为什么比 Single-Head 更强
- 残差连接为什么是深层网络的关键

如果你想继续深入：
- [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/) — Jay Alammar 的经典图解
- [Attention Is All You Need](https://arxiv.org/abs/1706.03762) — Transformer 原始论文
- [Let's build GPT: from scratch, in code, spelled out](https://www.youtube.com/watch?v=kCc8FmEb1nY) — Andrej Karpathy 的视频教程

---

## 📝 License

MIT © 2025
