"use client";

import { useMemo, useState } from "react";
import mockProject from "@/data/mock-project.json";
import type {
  AiGenerationResult,
  CharacterAsset,
  Episode,
  Shot,
} from "@/types/project";

const data = mockProject as AiGenerationResult;

type GenerationStatus = "idle" | "running" | "generated";
type InputTab = "上传文件" | "粘贴文本" | "AI 生成";

const inputTabs: InputTab[] = ["上传文件", "粘贴文本", "AI 生成"];

const navItems = [
  { label: "首页", icon: "home" },
  { label: "剧本创作", icon: "script" },
  { label: "资产库", icon: "asset" },
  { label: "回收站", icon: "trash" },
  { label: "同步", icon: "sync" },
];

const workflowSteps = [
  { label: "剧本大纲", meta: "结构拆解" },
  { label: "角色与场景", meta: "一致性资产" },
  { label: "分集视频", meta: "镜头会话" },
];

const entryCards = [
  {
    title: "从空白画布开始",
    desc: "创建题材、人物关系和爆点结构，再逐步推进到分镜。",
    action: "新建画布",
    icon: "spark",
  },
  {
    title: "剧本模式",
    desc: "导入现有剧本，自动抽取角色、场景、对白与镜头意图。",
    action: "导入剧本",
    icon: "doc",
  },
  {
    title: "一键直出",
    desc: "用 mock Agent 流程直接生成角色资产、分集和分镜草案。",
    action: "一键生成",
    icon: "bolt",
  },
];

const workflowNodes = [
  { title: "剧本解析", type: "Input", status: "success", meta: "1.2s" },
  { title: "角色记忆", type: "Agent", status: "success", meta: "3 assets" },
  { title: "场景拆解", type: "Agent", status: "running", meta: "镜头语言" },
  { title: "分集视频", type: "Output", status: "queued", meta: "9:16" },
];

const runEvents = [
  "解析剧本主题与主冲突",
  "锁定角色外观与口吻变量",
  "生成分集钩子和镜头节奏",
  "输出图片提示词与视频提示词",
];

const variants = [
  { id: "v1", label: "主版本", model: "Storyboard Agent", time: "刚刚", status: "已设为主版本" },
  { id: "v2", label: "冷雨夜版本", model: "Video Agent", time: "2 分钟前", status: "可延展" },
  { id: "v3", label: "高冲突版本", model: "Rewrite Agent", time: "5 分钟前", status: "待审核" },
];

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: string;
  className?: string;
}) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "home":
      return (
        <svg {...common}>
          <path d="m3 11 9-8 9 8" />
          <path d="M5 10v10h14V10" />
          <path d="M10 20v-6h4v6" />
        </svg>
      );
    case "script":
      return (
        <svg {...common}>
          <path d="M7 3h8l4 4v14H7z" />
          <path d="M15 3v5h5" />
          <path d="M10 12h6" />
          <path d="M10 16h5" />
        </svg>
      );
    case "asset":
      return (
        <svg {...common}>
          <path d="M4 7h16" />
          <path d="M6 7v13h12V7" />
          <path d="m9 7 1-3h4l1 3" />
          <path d="M9 12h6" />
          <path d="M9 16h4" />
        </svg>
      );
    case "trash":
      return (
        <svg {...common}>
          <path d="M4 7h16" />
          <path d="m6 7 1 14h10l1-14" />
          <path d="m9 7 1-4h4l1 4" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
        </svg>
      );
    case "sync":
      return (
        <svg {...common}>
          <path d="M20 7h-5a5 5 0 0 0-8.2-2" />
          <path d="m17 4 3 3-3 3" />
          <path d="M4 17h5a5 5 0 0 0 8.2 2" />
          <path d="m7 20-3-3 3-3" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common}>
          <path d="M12 3v4" />
          <path d="M12 17v4" />
          <path d="M3 12h4" />
          <path d="M17 12h4" />
          <path d="m6.5 6.5 2.8 2.8" />
          <path d="m14.7 14.7 2.8 2.8" />
          <path d="m17.5 6.5-2.8 2.8" />
          <path d="m9.3 14.7-2.8 2.8" />
        </svg>
      );
    case "doc":
      return (
        <svg {...common}>
          <path d="M6 3h9l3 3v15H6z" />
          <path d="M15 3v4h4" />
          <path d="M9 12h6" />
          <path d="M9 16h6" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...common}>
          <path d="M13 2 4 14h7l-1 8 10-13h-7z" />
        </svg>
      );
    case "upload":
      return (
        <svg {...common}>
          <path d="M12 16V4" />
          <path d="m7 9 5-5 5 5" />
          <path d="M5 16v4h14v-4" />
        </svg>
      );
    case "play":
      return (
        <svg {...common}>
          <path d="M8 5v14l11-7z" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      );
    case "more":
      return (
        <svg {...common}>
          <path d="M5 12h.01" />
          <path d="M12 12h.01" />
          <path d="M19 12h.01" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 2" />
        </svg>
      );
  }
}

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}>
      {children}
    </section>
  );
}

function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "blue" | "green" | "amber" | "dark";
}) {
  const tones = {
    neutral: "bg-slate-100 text-slate-600 ring-slate-200",
    blue: "bg-sky-50 text-sky-700 ring-sky-100",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    dark: "bg-slate-950 text-white ring-slate-950",
  };

  return (
    <span className={`rounded-md px-2 py-1 text-xs font-semibold ring-1 ${tones[tone]}`}>
      {children}
    </span>
  );
}

function SectionTitle({
  title,
  desc,
  action,
}: {
  title: string;
  desc?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-sm font-semibold text-slate-950">{title}</h2>
        {desc ? <p className="mt-1 text-sm leading-6 text-slate-500">{desc}</p> : null}
      </div>
      {action}
    </div>
  );
}

function SidebarNav() {
  return (
    <nav className="hidden w-[88px] shrink-0 border-r border-slate-200 bg-white px-3 py-5 lg:flex lg:flex-col lg:items-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
        DF
      </div>
      <div className="mt-8 flex flex-1 flex-col items-center gap-2">
        {navItems.map((item, index) => (
          <button
            key={item.label}
            type="button"
            title={item.label}
            className={`group flex w-full flex-col items-center gap-1 rounded-lg px-2 py-3 text-[11px] font-medium transition ${
              index === 0
                ? "bg-slate-950 text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

function WorkflowProgress({ status }: { status: GenerationStatus }) {
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 xl:min-w-[520px]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-slate-500">工作流进度</p>
        <Badge tone={status === "running" ? "blue" : status === "generated" ? "green" : "neutral"}>
          {status === "running" ? "运行中" : status === "generated" ? "已生成" : "待运行"}
        </Badge>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {workflowSteps.map((step, index) => {
          const active = status !== "idle" || index === 0;
          return (
            <div key={step.label} className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  active ? "bg-slate-950 text-white" : "bg-white text-slate-400 ring-1 ring-slate-200"
                }`}
              >
                {index + 1}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">{step.label}</p>
                <p className="truncate text-xs text-slate-500">{step.meta}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Header({
  status,
  onGenerate,
}: {
  status: GenerationStatus;
  onGenerate: () => void;
}) {
  return (
    <Panel className="p-4">
      <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="dark">DramaFlow Agent</Badge>
            <Badge tone="blue">{data.project.genre}</Badge>
            <Badge tone={status === "generated" ? "green" : "neutral"}>
              {data.project.status}
            </Badge>
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-normal text-slate-950">
            AI 短剧 Agent 工作台
          </h1>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
            多 Agent 驱动的短剧剧本、角色、分镜与视频资产生成工作流
          </p>
        </div>
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <WorkflowProgress status={status} />
          <button
            type="button"
            onClick={onGenerate}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-70"
            disabled={status === "running"}
          >
            {status === "running" ? "生成中..." : status === "generated" ? "重新生成" : "一键生成"}
          </button>
        </div>
      </div>
    </Panel>
  );
}

function ProjectRail({
  selectedEpisode,
  selectedShot,
  onEpisodeSelect,
  onShotSelect,
}: {
  selectedEpisode: Episode;
  selectedShot: Shot;
  onEpisodeSelect: (episode: Episode) => void;
  onShotSelect: (shot: Shot) => void;
}) {
  return (
    <aside className="space-y-4">
      <Panel className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Project
            </p>
            <h2 className="mt-1 text-sm font-semibold text-slate-950">{data.project.title}</h2>
          </div>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-800"
            title="更多"
          >
            <Icon name="more" className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-500">{data.project.logline}</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-slate-50 p-2">
            <p className="text-sm font-semibold text-slate-950">{data.episodes.length}</p>
            <p className="text-xs text-slate-500">分集</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-2">
            <p className="text-sm font-semibold text-slate-950">{data.characters.length}</p>
            <p className="text-xs text-slate-500">角色</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-2">
            <p className="text-sm font-semibold text-slate-950">{selectedEpisode.shots.length}</p>
            <p className="text-xs text-slate-500">镜头</p>
          </div>
        </div>
      </Panel>

      <Panel className="p-4">
        <SectionTitle title="剧本结构" desc="按集数和镜头组织生成会话。" />
        <div className="mt-4 space-y-2">
          {data.episodes.map((episode) => (
            <button
              key={episode.id}
              type="button"
              onClick={() => onEpisodeSelect(episode)}
              className={`w-full rounded-lg border p-3 text-left transition ${
                episode.id === selectedEpisode.id
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold">
                  EP {String(episode.episodeNumber).padStart(2, "0")}
                </span>
                <span className="text-xs opacity-70">{episode.estimatedDuration}</span>
              </div>
              <p className="mt-1 line-clamp-1 text-sm font-semibold">{episode.title}</p>
            </button>
          ))}
        </div>
      </Panel>

      <Panel className="p-4">
        <SectionTitle title="镜头会话" desc="同一镜头的多次生成会被归档。" />
        <div className="mt-4 space-y-2">
          {selectedEpisode.shots.map((shot) => (
            <button
              key={shot.id}
              type="button"
              onClick={() => onShotSelect(shot)}
              className={`w-full rounded-lg border p-3 text-left transition ${
                shot.id === selectedShot.id
                  ? "border-sky-300 bg-sky-50"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-500">Shot {shot.index}</span>
                <Badge tone={shot.id === selectedShot.id ? "blue" : "neutral"}>
                  {shot.id === selectedShot.id ? "当前" : "可用"}
                </Badge>
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-700">{shot.scene}</p>
            </button>
          ))}
        </div>
      </Panel>
    </aside>
  );
}

function CommandBar() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500">
        <Icon name="search" className="h-4 w-4" />
        <span className="truncate text-sm">搜索角色、分集、镜头或 Agent 动作</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge tone="neutral">Ctrl K</Badge>
        <Badge tone="green">角色一致性已锁定</Badge>
      </div>
    </div>
  );
}

function EntryModeGrid({ onGenerate }: { onGenerate: () => void }) {
  return (
    <section className="grid gap-3 lg:grid-cols-3">
      {entryCards.map((card) => {
        const direct = card.title === "一键直出";
        return (
          <article
            key={card.title}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <Icon name={card.icon} />
              </div>
              <Badge tone={direct ? "blue" : "neutral"}>{direct ? "推荐" : "入口"}</Badge>
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-950">{card.title}</h3>
            <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">{card.desc}</p>
            <button
              type="button"
              onClick={direct ? onGenerate : undefined}
              className={`mt-4 inline-flex h-9 w-full items-center justify-center rounded-lg text-sm font-semibold transition ${
                direct
                  ? "bg-slate-950 text-white hover:bg-slate-800"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {card.action}
            </button>
          </article>
        );
      })}
    </section>
  );
}

function ScriptInputPanel({
  activeTab,
  status,
  onTabChange,
  onGenerate,
}: {
  activeTab: InputTab;
  status: GenerationStatus;
  onTabChange: (tab: InputTab) => void;
  onGenerate: () => void;
}) {
  return (
    <Panel className="p-4">
      <SectionTitle
        title="剧本输入区"
        desc="上传原始剧本、粘贴文本，或让 Agent 根据主题生成第一版。"
        action={<Badge tone={status === "generated" ? "green" : "neutral"}>{activeTab}</Badge>}
      />
      <div className="mt-4 flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
        {inputTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`h-9 rounded-md px-4 text-sm font-medium transition ${
              activeTab === tab
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-9 text-center hover:border-sky-300 hover:bg-sky-50/40">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm ring-1 ring-slate-200">
          <Icon name={activeTab === "AI 生成" ? "bolt" : "upload"} />
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-950">
          {activeTab === "AI 生成" ? data.input.theme : "拖拽文件到此处，或点击选择"}
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {activeTab === "AI 生成"
            ? data.input.requirement
            : "支持 .txt .docx .pdf，当前为 mock 演示，不会真实上传文件"}
        </p>
        <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {activeTab === "AI 生成" ? "编辑主题" : "选择文件"}
          </button>
          <button
            type="button"
            onClick={onGenerate}
            disabled={status === "running"}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-wait disabled:opacity-70"
          >
            {status === "running" ? "Agent 运行中" : "一键生成"}
          </button>
        </div>
      </div>
    </Panel>
  );
}

function WorkflowCanvas({ status }: { status: GenerationStatus }) {
  return (
    <Panel className="p-4">
      <SectionTitle
        title="Agent Workflow"
        desc="用节点表达短剧生产路径，运行状态沿流程高亮。"
        action={<Badge tone={status === "running" ? "blue" : "neutral"}>Trace enabled</Badge>}
      />
      <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex min-w-[760px] items-center gap-3">
          {workflowNodes.map((node, index) => {
            const running = status === "running" && node.status === "running";
            const success = status === "generated" || node.status === "success";
            return (
              <div key={node.title} className="flex flex-1 items-center gap-3">
                <div
                  className={`relative min-h-28 flex-1 rounded-lg border bg-white p-4 shadow-sm ${
                    running
                      ? "border-sky-300 ring-4 ring-sky-100"
                      : success
                        ? "border-emerald-200"
                        : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge tone={node.type === "Agent" ? "blue" : "neutral"}>{node.type}</Badge>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        running
                          ? "bg-sky-500"
                          : success
                            ? "bg-emerald-500"
                            : "bg-slate-300"
                      }`}
                    />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-slate-950">{node.title}</h3>
                  <p className="mt-2 text-xs text-slate-500">{node.meta}</p>
                  {running ? (
                    <div className="absolute inset-x-4 bottom-3 h-1 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full w-2/3 rounded-full bg-sky-500" />
                    </div>
                  ) : null}
                </div>
                {index < workflowNodes.length - 1 ? (
                  <div className="h-px w-8 border-t border-dashed border-slate-300" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-4 grid gap-2 md:grid-cols-4">
        {runEvents.map((event, index) => (
          <div key={event} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-400">Step {index + 1}</p>
            <p className="mt-1 text-sm leading-5 text-slate-700">{event}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function CharacterAssetRow({ character }: { character: CharacterAsset }) {
  return (
    <article className="flex gap-4 rounded-lg border border-slate-200 bg-white p-3 transition hover:border-sky-200 hover:bg-slate-50">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[linear-gradient(135deg,#111827_0%,#475569_56%,#0ea5e9_100%)]">
        <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-white">
          {character.name.slice(0, 1)}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-950">{character.name}</h3>
          <Badge tone="neutral">{character.role}</Badge>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge tone="blue">{character.archetype}</Badge>
          <Badge tone="green">{character.age} 岁</Badge>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-500">
          {character.motivation}
        </p>
      </div>
    </article>
  );
}

function EpisodeCard({
  episode,
  active,
  onSelect,
}: {
  episode: Episode;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`overflow-hidden rounded-lg border bg-white text-left shadow-sm transition hover:border-sky-200 hover:shadow-md ${
        active ? "border-sky-300 ring-4 ring-sky-100" : "border-slate-200"
      }`}
    >
      <div className="relative aspect-video bg-[linear-gradient(135deg,#0f172a_0%,#334155_52%,#0f766e_100%)]">
        <div className="absolute left-3 top-3">
          <Badge tone="dark">EP {String(episode.episodeNumber).padStart(2, "0")}</Badge>
        </div>
        <div className="absolute bottom-3 left-3 right-3 rounded-lg bg-black/25 p-3 text-white backdrop-blur">
          <p className="line-clamp-1 text-sm font-semibold">{episode.hook}</p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-950">{episode.title}</h3>
          <Badge tone={active ? "blue" : "amber"}>{active ? "编辑中" : "已生成"}</Badge>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-slate-50 p-2">
            <p className="text-sm font-semibold text-slate-950">{episode.shots.length}</p>
            <p className="text-xs text-slate-500">场景数</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-2">
            <p className="text-sm font-semibold text-slate-950">{episode.shots.length}</p>
            <p className="text-xs text-slate-500">镜头数</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-2">
            <p className="text-sm font-semibold text-slate-950">{episode.estimatedDuration}</p>
            <p className="text-xs text-slate-500">时长</p>
          </div>
        </div>
      </div>
    </button>
  );
}

function ShotRow({
  shot,
  active,
  onSelect,
}: {
  shot: Shot;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`grid w-full gap-4 rounded-lg border p-4 text-left transition md:grid-cols-[88px_1fr] ${
        active ? "border-sky-300 bg-sky-50" : "border-slate-200 bg-white hover:bg-slate-50"
      }`}
    >
      <div>
        <Badge tone={active ? "blue" : "neutral"}>Shot {shot.index}</Badge>
        <p className="mt-2 text-xs font-medium text-slate-500">{shot.duration}</p>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-950">{shot.scene}</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">{shot.action}</p>
        <div className="mt-3 grid gap-2 lg:grid-cols-2">
          <p className="rounded-lg bg-white px-3 py-2 text-xs leading-5 text-slate-600 ring-1 ring-slate-200">
            镜头：{shot.camera}
          </p>
          <p className="rounded-lg bg-white px-3 py-2 text-xs leading-5 text-slate-600 ring-1 ring-slate-200">
            对白：{shot.dialogue}
          </p>
        </div>
      </div>
    </button>
  );
}

function ResultsWorkspace({
  status,
  selectedEpisode,
  selectedShot,
  onGenerate,
  onEpisodeSelect,
  onShotSelect,
}: {
  status: GenerationStatus;
  selectedEpisode: Episode;
  selectedShot: Shot;
  onGenerate: () => void;
  onEpisodeSelect: (episode: Episode) => void;
  onShotSelect: (shot: Shot) => void;
}) {
  if (status === "idle") {
    return (
      <Panel className="p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
          <Icon name="bolt" />
        </div>
        <h2 className="mt-4 text-sm font-semibold text-slate-950">等待 Agent 生成结果</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
          点击一键生成后，将使用 mock 数据进入角色资产、分集视频和分镜会话状态。
        </p>
        <button
          type="button"
          onClick={onGenerate}
          className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          一键生成
        </button>
      </Panel>
    );
  }

  return (
    <div className="space-y-4">
      <Panel className="p-4">
        <SectionTitle
          title="角色与场景区"
          desc="资产库式列表，角色设定可被拖入镜头提示词。"
          action={<Badge tone="green">{data.characters.length} 个角色资产</Badge>}
        />
        <div className="mt-4 grid gap-3 xl:grid-cols-2">
          {data.characters.map((character) => (
            <CharacterAssetRow key={character.id} character={character} />
          ))}
        </div>
      </Panel>

      <Panel className="p-4">
        <SectionTitle
          title="分集视频区"
          desc="选择某一集后，下方显示该集分镜和当前镜头会话。"
          action={<Badge tone="neutral">{data.episodes.length} 集 mock 草案</Badge>}
        />
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {data.episodes.map((episode) => (
            <EpisodeCard
              key={episode.id}
              episode={episode}
              active={episode.id === selectedEpisode.id}
              onSelect={() => onEpisodeSelect(episode)}
            />
          ))}
        </div>
        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-950">{selectedEpisode.title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">{selectedEpisode.conflict}</p>
            </div>
            <Badge tone="blue">当前镜头：Shot {selectedShot.index}</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {selectedEpisode.shots.map((shot) => (
              <ShotRow
                key={shot.id}
                shot={shot}
                active={shot.id === selectedShot.id}
                onSelect={() => onShotSelect(shot)}
              />
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
}

function PreviewPanel({
  status,
  episode,
  shot,
  onGenerate,
}: {
  status: GenerationStatus;
  episode: Episode;
  shot: Shot;
  onGenerate: () => void;
}) {
  return (
    <aside className="right-preview space-y-4">
      <Panel className="p-4">
        <SectionTitle
          title="导演控制台"
          desc="当前镜头的生成模式、参数和输出。"
          action={<Badge tone="dark">9:16</Badge>}
        />
        <div className="mt-4 grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1">
          {["生成", "角色", "输出"].map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={`h-8 rounded-md text-sm font-medium ${
                index === 0 ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-slate-900 bg-slate-950 p-2 shadow-inner">
          <div className="aspect-[9/16] overflow-hidden rounded-lg bg-[radial-gradient(circle_at_28%_12%,rgba(14,165,233,.68),transparent_24%),linear-gradient(160deg,#111827_0%,#334155_48%,#020617_100%)] p-5 text-white">
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <Badge tone="dark">
                    EP {String(episode.episodeNumber).padStart(2, "0")} · Shot {shot.index}
                  </Badge>
                  <span
                    className={`rounded-md px-2 py-1 text-xs font-semibold ring-1 ${
                      status === "running"
                        ? "bg-sky-400/20 text-sky-100 ring-sky-200/20"
                        : "bg-emerald-400/20 text-emerald-100 ring-emerald-200/20"
                    }`}
                  >
                    {status === "running" ? "生成中" : "可预览"}
                  </span>
                </div>
                <h3 className="mt-5 text-2xl font-semibold leading-8">{episode.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-200">{episode.hook}</p>
              </div>
              <div className="rounded-lg bg-white/12 p-4 backdrop-blur-md ring-1 ring-white/15">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                  Scene
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-white">{shot.scene}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{shot.action}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {["图生视频", "9:16", "10s"].map((item) => (
            <div key={item} className="rounded-lg bg-slate-50 p-2 text-center ring-1 ring-slate-200">
              <p className="text-xs font-semibold text-slate-700">{item}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-500">图片提示词</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{shot.imagePrompt}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-500">视频提示词</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{shot.videoPrompt}</p>
          </div>
          <button
            type="button"
            onClick={onGenerate}
            disabled={status === "running"}
            className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-wait disabled:opacity-70"
          >
            {status === "running" ? "重新生成中..." : "重新生成"}
          </button>
        </div>
      </Panel>

      <Panel className="p-4">
        <SectionTitle title="镜头版本带" desc="按镜头会话沉淀每次尝试。" />
        <div className="mt-4 space-y-2">
          {variants.map((variant, index) => (
            <div key={variant.id} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-md bg-slate-900 text-xs font-semibold text-white">
                V{index + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-slate-950">{variant.label}</p>
                  <span className="text-xs text-slate-400">{variant.time}</span>
                </div>
                <p className="mt-1 truncate text-xs text-slate-500">{variant.model}</p>
                <p className="mt-2 text-xs text-slate-600">{variant.status}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </aside>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<InputTab>("上传文件");
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>("idle");
  const [selectedEpisodeId, setSelectedEpisodeId] = useState(data.preview.selectedEpisodeId);
  const [selectedShotId, setSelectedShotId] = useState(data.preview.selectedShotId);

  const selectedEpisode = useMemo(
    () =>
      data.episodes.find((episode) => episode.id === selectedEpisodeId) ??
      data.episodes[0],
    [selectedEpisodeId],
  );

  const selectedShot = useMemo(
    () =>
      selectedEpisode.shots.find((shot) => shot.id === selectedShotId) ??
      selectedEpisode.shots[0],
    [selectedEpisode, selectedShotId],
  );

  function handleGenerate() {
    setGenerationStatus("running");
    setSelectedEpisodeId(data.preview.selectedEpisodeId);
    setSelectedShotId(data.preview.selectedShotId);
    window.setTimeout(() => {
      setGenerationStatus("generated");
    }, 650);
  }

  function handleEpisodeSelect(episode: Episode) {
    setGenerationStatus((status) => (status === "idle" ? "generated" : status));
    setSelectedEpisodeId(episode.id);
    setSelectedShotId(episode.shots[0]?.id ?? "");
  }

  function handleShotSelect(shot: Shot) {
    setGenerationStatus((status) => (status === "idle" ? "generated" : status));
    setSelectedShotId(shot.id);
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <div className="flex min-h-screen">
        <SidebarNav />
        <div className="min-w-0 flex-1">
          <div className="mx-auto grid w-full max-w-[1840px] gap-5 px-4 py-5 xl:grid-cols-[260px_minmax(0,1fr)_380px] 2xl:px-6">
            <ProjectRail
              selectedEpisode={selectedEpisode}
              selectedShot={selectedShot}
              onEpisodeSelect={handleEpisodeSelect}
              onShotSelect={handleShotSelect}
            />

            <div className="min-w-0 space-y-4">
              <Header status={generationStatus} onGenerate={handleGenerate} />
              <CommandBar />
              <EntryModeGrid onGenerate={handleGenerate} />
              <ScriptInputPanel
                activeTab={activeTab}
                status={generationStatus}
                onTabChange={setActiveTab}
                onGenerate={handleGenerate}
              />
              <WorkflowCanvas status={generationStatus} />
              <ResultsWorkspace
                status={generationStatus}
                selectedEpisode={selectedEpisode}
                selectedShot={selectedShot}
                onGenerate={handleGenerate}
                onEpisodeSelect={handleEpisodeSelect}
                onShotSelect={handleShotSelect}
              />
            </div>

            <PreviewPanel
              status={generationStatus}
              episode={selectedEpisode}
              shot={selectedShot}
              onGenerate={handleGenerate}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
