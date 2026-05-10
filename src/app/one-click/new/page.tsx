"use client";

import Link from "next/link";
import { useState } from "react";
import { AppShell, Badge, Icon, PageHeader, Panel } from "@/components/workspace";
import mockProject from "@/data/mock-project.json";
import type { AiGenerationResult } from "@/types/project";

const data = mockProject as AiGenerationResult;
const tabs = ["上传文件", "粘贴文本", "AI 生成"] as const;

export default function OneClickNewPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("上传文件");
  const [status, setStatus] = useState<"idle" | "analyzing" | "done">("idle");

  function startAnalyze() {
    setStatus("analyzing");
    window.setTimeout(() => setStatus("done"), 1400);
  }

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl space-y-5 px-5 py-5">
        <PageHeader
          title="一键直出"
          description="上传剧本、粘贴文本或直接 AI 生成，先完成剧本大纲拆解。"
          currentStep={1}
        />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <Panel className="p-5">
            <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
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

            <div className="mt-5 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center transition hover:border-sky-300 hover:bg-sky-50/40">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm ring-1 ring-slate-200">
                <Icon name={activeTab === "AI 生成" ? "bolt" : "upload"} className="h-6 w-6" />
              </div>
              <p className="mt-5 text-base font-semibold text-slate-950">
                {activeTab === "AI 生成" ? data.input.theme : "拖拽文件到此处，或点击选择"}
              </p>
              <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                {activeTab === "AI 生成"
                  ? data.input.requirement
                  : "支持 .txt .docx .pdf。当前仅模拟上传状态，不会读取真实文件。"}
              </p>
              <button
                type="button"
                onClick={startAnalyze}
                disabled={status === "analyzing"}
                className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-70"
              >
                {status === "analyzing" ? "分析中..." : "开始分析"}
              </button>
            </div>
          </Panel>

          <Panel className="p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-slate-950">剧本摘要</h2>
              <Badge tone={status === "done" ? "green" : status === "analyzing" ? "blue" : "neutral"}>
                {status === "done" ? "已生成" : status === "analyzing" ? "生成中" : "待分析"}
              </Badge>
            </div>
            {status === "idle" ? (
              <p className="mt-4 text-sm leading-6 text-slate-500">
                点击开始分析后，这里会显示 AI 拆解出的故事简介、题材、主冲突和分集建议。
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-400">项目</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">
                    {data.project.title}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400">故事简介</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {data.outline?.summary}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400">主要冲突</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {data.outline?.mainConflict}
                  </p>
                </div>
              </div>
            )}
            {status === "done" ? (
              <Link
                href="/one-click/project-demo/assets"
                className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                确认拆解，进入角色与场景
              </Link>
            ) : null}
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
