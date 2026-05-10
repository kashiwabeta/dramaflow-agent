# HANDOFF

## 1. 项目定位

DramaFlow Agent 是一个 AI 短剧生产工作台前端 MVP。当前重点不是接真实 AI / 视频 API，而是做一个可编辑、可保存的前端 demo，模拟“一键直出”工作流：

1. 输入剧本或主题
2. 确认 AI 拆解出的角色、场景、道具、风格
3. 生成分集视频计划
4. 进入单集逐镜头生成页面，编辑 shot 和 prompt

当前 MVP 的核心主线是“一键直出”。“资产库”是独立模块，不是一键直出流程里的下一页。

## 2. 当前技术栈

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS v4
- 本地 mock JSON 数据
- React hooks + `localStorage` 状态持久化

不要引入复杂状态管理库，当前约定是继续使用 React hooks。

## 3. 当前已完成的路由和页面

主流程：

- `/`
  - 首页，只展示三个入口：一键直出、资产库、最近项目
- `/one-click/new`
  - 一键直出开始页
  - 上传文件 / 粘贴文本 / AI 生成 tab
  - mock 剧本摘要
- `/one-click/project-demo/assets`
  - 一键直出第二步：当前项目临时资产确认页
  - 复用实现来自 `/drama/project-demo/assets`
- `/one-click/project-demo/episodes`
  - 一键直出第三步：分集列表页
  - 复用实现来自 `/drama/project-demo/episodes`
- `/one-click/project-demo/episodes/1`
  - 单集逐镜头生成页
  - 复用实现来自 `/drama/project-demo/episodes/1`
- `/one-click/project-demo/episodes/[episodeNumber]`
  - 动态集数分镜页

独立模块：

- `/assets`
  - 独立资产库 mock 页面
  - 不属于一键直出流程

历史/兼容路由仍存在：

- `/drama/new`
- `/drama/project-demo/outline`
- `/drama/project-demo/assets`
- `/drama/project-demo/episodes`
- `/drama/project-demo/episodes/1`
- `/drama/project-demo/episodes/[episodeNumber]`

不要删除这些路由，除非用户明确要求清理旧路由。

## 4. 当前视觉风格：EchoSight-inspired

当前视觉方向参考 EchoSight，但不要照抄布局和功能。核心规范：

- 低饱和蓝灰背景
- 暖白 / 米白纸感卡片
- 珊瑚橙细节
- 深蓝绿细线
- 轻微纸张颗粒和印刷感
- 日系 City Pop / 唱片封套感
- 克制、安静、复古，但仍然清晰可用
- 不要赛博风
- 不要玻璃拟态
- 不要回到普通黑白 SaaS 后台

全局样式主要在：

- `src/app/globals.css`

重要 CSS utility：

- `display-title`
- `section-kicker`
- `cn-title`
- `body-copy`
- `meta-text`
- `prompt-text`
- `prompt-box`
- `echo-tab`
- `echo-tab-active`
- `tool-btn`
- `tool-btn-primary`
- `paper-card`
- `echo-primary-btn`
- `echo-secondary-btn`

共享 UI 主要在：

- `src/components/workspace.tsx`

其中包括：

- `AppShell`
- `Panel`
- `Badge`
- `ButtonLink`
- `StepBar`
- `PageHeader`
- `AssetPlaceholder`
- `DraftStatus`

## 5. 当前数据结构和 mock 数据位置

mock 数据位置：

- `src/data/mock-project.json`

类型定义位置：

- `src/types/project.ts`

主要数据结构：

- `AiGenerationResult`
- `CharacterAsset`
- `SceneAsset`
- `PropAsset`
- `StyleAsset`
- `Episode`
- `Shot`

当前 mock 数据包含：

- `project`
- `outline`
- `input`
- `characters`
- `scenes`
- `props`
- `styles`
- `assetLibrary`
- `episodes`
- `preview`

不要删除已有 mock 数据。可以在需要视觉展示或前端交互时补充字段，但要保持兼容。

## 6. 当前 localStorage 状态管理实现情况

统一状态 hook：

- `src/hooks/useProjectStore.ts`

localStorage key：

- `dramaflow-project-state`

行为：

- 默认从 `src/data/mock-project.json` 初始化
- 如果 localStorage 有 `dramaflow-project-state`，优先读取本地状态
- 所有修改自动保存到 localStorage
- 顶部/右上区域可显示：
  - `正在保存...`
  - `本地草稿已保存`
- `resetProject()` 会清空 localStorage 并恢复 mock 数据

hook 暴露的方法：

- `updateCharacter(characterId, patch)`
- `updateScene(sceneId, patch)`
- `updateEpisode(episodeId, patch)`
- `updateShot(episodeId, shotId, patch)`
- `setCharacterStatus(characterId, status)`
- `setSceneStatus(sceneId, status)`
- `setEpisodeStatus(episodeId, status)`
- `setShotStatus(episodeId, shotId, status)`
- `resetProject()`

已接入 store 的页面：

- `/one-click/project-demo/assets`
  - 实际实现文件：`src/app/drama/project-demo/assets/page.tsx`
- `/one-click/project-demo/episodes`
  - 实际实现文件：`src/app/drama/project-demo/episodes/page.tsx`
- `/one-click/project-demo/episodes/1`
  - 实际实现文件：`src/app/drama/project-demo/episodes/1/page.tsx`

注意：`/one-click/...` 下有若干 re-export 页面，实际逻辑目前复用 `/drama/...` 实现文件。

## 7. 哪些文件最重要

核心状态：

- `src/hooks/useProjectStore.ts`

核心视觉系统：

- `src/app/globals.css`
- `src/components/workspace.tsx`

核心数据和类型：

- `src/data/mock-project.json`
- `src/types/project.ts`

核心产品页面：

- `src/app/page.tsx`
- `src/app/one-click/new/page.tsx`
- `src/app/drama/project-demo/assets/page.tsx`
- `src/app/drama/project-demo/episodes/page.tsx`
- `src/app/drama/project-demo/episodes/1/page.tsx`
- `src/app/assets/page.tsx`

one-click re-export 页面：

- `src/app/one-click/project-demo/assets/page.tsx`
- `src/app/one-click/project-demo/episodes/page.tsx`
- `src/app/one-click/project-demo/episodes/1/page.tsx`
- `src/app/one-click/project-demo/episodes/[episodeNumber]/page.tsx`

## 8. 当前已完成的功能

已完成：

- 多页面 App Router 工作流
- 首页入口信息架构
- 一键直出开始页
- 当前项目临时资产确认页
- 独立资产库 mock 页
- 分集列表页
- 单集逐镜头生成页
- EchoSight-inspired 视觉系统
- 统一字体系统和信息层级
- 角色字段编辑
  - 姓名
  - 身份
  - 年龄
  - 性格
  - 外貌
  - 视觉提示词
- 场景字段编辑
  - 名称
  - 描述
  - 视觉提示词
- 分集字段编辑
  - 标题
  - 剧情摘要
- shot 字段编辑
  - 画面描述
  - 时长
  - 图片提示词
  - 视频提示词
  - 出场角色
  - 场景
- mock 状态流转
  - 分集生成分镜提示词
  - shot 生成图片 / 视频
  - 角色 / 场景锁定
  - 本地上传 / 资产库引用 mock 状态
- prompt 复制按钮
- localStorage 自动保存
- 重置项目

最近一次校验通过：

- `npm run lint`
- `npm run build`

## 9. 下一步要做什么

建议下一步 Milestone：

1. 明确哪些页面还需要接入 `useProjectStore`
   - `/one-click/new` 当前仍是 mock 摘要交互，没有保存 input/outline 编辑态
   - `/assets` 当前是独立 mock 展示页，还没有完整增删改查
2. 增加 dirty state / last saved time
3. 给资产确认页增加更清晰的“全部锁定后才能进入下一步”的前端校验
4. 给分集页增加更多 episode 状态筛选
5. 给单集分镜页增加批量生成/批量复制 mock 操作
6. 整理 `/drama/...` 旧路由是否继续保留为兼容路径
7. 组件进一步拆分
   - 当前资产页和单集页仍较大，可以拆到 `src/components` 下

## 10. 禁止事项

除非用户明确要求，否则不要：

- 不要重建项目
- 不要改现有路由结构
- 不要把多页面流程合并回单页 Dashboard
- 不要破坏 EchoSight-inspired 视觉风格
- 不要改回普通黑白 SaaS 风格
- 不要接真实视频 API
- 不要接真实 AI API
- 不要引入复杂状态管理库
- 不要删除 `src/data/mock-project.json`
- 不要删除 `useProjectStore`
- 不要清空用户 localStorage，除非用户点击或要求 reset

下一次 Codex 会话建议先读：

1. `AGENTS.md`
2. `HANDOFF.md`
3. `src/hooks/useProjectStore.ts`
4. `src/components/workspace.tsx`
5. 当前要改的具体页面文件
