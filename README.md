# 🧠 Transformer Explorer

一个交互式的 Transformer 可视化教学项目，帮助前端工程师在 30 分钟内理解 AI 的核心算法。

## 🎯 项目目标

让用户能够看到**一句话如何一步一步变成 AI 可以理解的数据**。

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📚 学习路径

整个项目像一个互动课程，共 11 个步骤：

| 步骤 | 名称 | 核心概念 |
|------|------|----------|
| 1 | Tokenizer ✂️ | 将文本切分为 Token |
| 2 | Embedding 🔢 | Token 变成向量 |
| 3 | Position Encoding 📍 | 添加位置信息 |
| 4 | QKV 🔑 | 生成 Query, Key, Value |
| 5 | Attention 👁️ | 计算注意力分数 |
| 6 | Attention Matrix 📊 | 注意力矩阵可视化 |
| 7 | Multi-Head 🧠 | 多头注意力 |
| 8 | Feed Forward ⚡ | 前馈神经网络 |
| 9 | LayerNorm ⚖️ | 层归一化 |
| 10 | Residual 🔗 | 残差连接 |
| 11 | Output 🎯 | 预测下一个 Token |

## 🛠️ 技术栈

- **Vue 3** - 响应式 UI 框架
- **Vite** - 构建工具
- **TypeScript** - 类型安全
- **Pinia** - 状态管理
- **UnoCSS** - 原子化 CSS

## 📁 项目结构

```
src/
├── types/           # TypeScript 类型定义
├── utils/           # 数学计算工具
│   ├── math.ts      # 矩阵运算、softmax、attention
│   ├── tokenizer.ts # 分词器
│   ├── embedding.ts # Embedding 工具
│   ├── qkv.ts       # QKV 计算
│   ├── feedforward.ts # FFN 计算
│   └── prediction.ts  # 预测输出
├── stores/          # Pinia 状态管理
├── composables/     # Vue 组合式函数
└── components/      # Vue 组件
    ├── layout/      # 布局组件
    └── steps/       # 每个步骤的组件
```

## 💡 教学特色

- **零依赖**：不使用任何 AI 库，所有数学计算自己实现
- **逐步动画**：每一步都有可视化动画
- **交互式**：支持拖拽、Hover、点击查看
- **类比说明**：用通俗的类比解释复杂概念

## 📖 核心理解

完成本课程后，你将理解：

1. **Tokenizer**：AI 如何将文字转换为数字
2. **Embedding**：如何让数字拥有语义
3. **Position Encoding**：如何让 AI 理解词序
4. **QKV**：Attention 机制的核心
5. **Attention**：AI 如何"关注"重要信息
6. **Multi-Head**：如何同时理解多种模式
7. **Feed Forward**：每个词的独立思考
8. **LayerNorm**：训练稳定性的保证
9. **Residual**：深层网络的关键
10. **Output**：AI 如何预测下一个词

## 📝 License

MIT
