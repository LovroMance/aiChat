# aiChat

基于 Vue 3 的实时聊天应用，支持私聊、群聊和 AI 对话。

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 安装依赖

```bash
pnpm install
```

### 配置环境变量

在项目根目录创建 `.env.development`：

```env
VITE_APP_TITLE=aiChat Dev
VITE_APP_API_BASE=http://your-server-ip
VITE_APP_WS_BASE=ws://your-server-ip
```

将 `your-server-ip` 替换为后端服务器地址。

### 启动开发服务器

```bash
pnpm dev
```

访问 `http://localhost:5173`。

### 构建生产版本

```bash
pnpm build
```

产物输出到 `dist/` 目录。

### 代码检查与格式化

```bash
pnpm lint      # ESLint 检查并修复
pnpm format    # Prettier 格式化
```

## 项目结构

```
src/
├── api/            # 后端接口
├── components/     # 通用组件
├── composables/    # 组合式函数
├── core/           # 核心业务逻辑
├── layout/         # 布局组件
├── plugins/        # 消息插件
├── router/         # 路由
├── stores/         # Pinia 状态管理
├── utils/          # 工具函数
└── views/          # 页面
```

## 技术栈

Vue 3 + Vite + Pinia + Vue Router + Element Plus + Axios + WebSocket + IndexedDB
