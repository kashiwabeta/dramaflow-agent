# AI 短剧 Agent 工作台 MVP

一个基于 Next.js + Tailwind CSS 的短剧创作工作台前端原型。当前不接真实 AI / 生图 API，使用 `src/data/mock-project.json` 模拟角色资产、分集大纲、分镜脚本、图片提示词和视频提示词。

## 本地运行

```bash
npm install
npm run dev
```

## 目录结构

```text
src/
  app/
    globals.css
    layout.tsx
    page.tsx
  data/
    mock-project.json
  types/
    project.ts
```

后续接入真实接口时，可以将 `mock-project.json` 替换为 API 返回结果，并保持 `AiGenerationResult` 数据结构不变。
