# 下一步重构计划

## 阶段目标概览

- 聚焦抽象分层：View → Composables → Core → Store → API/DB 清晰职责
- 提升状态一致性：Store 作为运行时单一数据源，Core 只做编排
- 为后续 TS、测试、性能优化奠定基础

## Sprint 1（P0）

1. Store 结构与方法化

   - messageStore：改为 Map<threadId, messages[]>；提供 loadHistory(threadId)、appendOffline(threadId, list)、addOnline(threadId, msg)、resetThread(threadId)、resetAll()、currentMessages（computed）。
   - threadStore：统一 Map 存线程元信息；提供 setActiveThreadId(id)、getActiveThread()；去除直接暴露 ref 替换的隐患。
   - unreadMessagesStore：仅负责未读计数/最后一条元信息；提供 updateUnread(threadId, payload)、markAsRead(threadId)、clearThread(threadId)。

2. Core/Store 解耦

   - chatWorkflow：调用 store 方法，不直接改内部状态数组；编排“加载历史 + 离线合并 + 已读更新”。
   - unreadMessage：拆为纯函数（取线程信息、构造未读记录、持久化）+ 编排函数；对 Store/DB 的写入集中在编排层。

3. 配置与安全
   - 落地 .env.\*，移除硬编码 baseURL/wsURL。
   - WebSocket 认证方式收敛（避免 token 直接拼接 URL，改头部/子协议或临时签名）。

## Sprint 2（P1）

1. Composables 补全

   - useThreadList：封装线程列表加载/选择/未读合并；View 只关心 UI。
   - useMessageInput：使用 storeToRefs，校验 activeThread，保持返回 ref。
   - useWebSocket（或封装 utils/websocket）：连接/心跳/重连/发送队列抽象，避免模块级状态散落。

2. 组件拆分与复用
   - 拆分 views/ai/index.vue 为容器 + 子组件（Sidebar/Header/MessageList/InputArea）。
   - 将 chat-panel.vue、chat-input.vue 迁移到 components/chat/ 并复用。

## Sprint 3（P1-P2）

1. 路由与命名规范

   - 统一路由为 kebab-case；移除测试路由；添加鉴权守卫与标题管理。

2. 测试与质量护栏
   - 引入 Vitest；为 store 方法和核心纯函数补单测。
   - 配置 lint-staged + husky 预提交检查。

## Sprint 4（P2+）

1. 性能与体验

   - 消息列表虚拟滚动；Element Plus 图标按需导入；代码分割与资源预加载。

2. 文档与规范
   - README 补全；API/组件使用文档；统一命名/常量清单；清理 TODO。

## 验收要点

- Store 不再被 Core/Views 直接写内部状态，均通过方法接口。
- 未读、高亮等 UI 随 Store 状态变化实时响应，无手动同步代码。
- 核心路径（选线程、收消息、发消息）在本地跑通且通过 lint。
