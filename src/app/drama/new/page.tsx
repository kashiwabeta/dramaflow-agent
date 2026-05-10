"use client";

import Link from "next/link";
import { useState } from "react";
import { AppShell, Badge, Icon, PageHeader, Panel } from "@/components/workspace";
import mockProject from "@/data/mock-project.json";
import type { AiGenerationResult } from "@/types/project";

const data = mockProject as AiGenerationResult;
const tabs = ["上传文件", "粘贴文本", "AI 生成"] as const;

export default function NewDramaPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("上传文件");
  const [status, setStatus] = useState<"idle" | "analyzing" | "done">("idle");

  function startAnalyze() {
    setStatus("analyzing");
    window.setTimeout(() => setStatus("done"), 1400);
  }

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-6xl space-y-5 px-5 py-5">
        <PageHeader
          title="剧本输入"
          description="导入剧本素材，先让 Agent 生成可确认的大纲，再进入角色与场景资产阶段。"
          currentStep={1}
        />

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

          <div className="mt-5 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center transition hover:border-sky-300 hover:bg-sky-50/40">
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

        {status !== "idle" ? (
          <Panel className="p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <Badge tone={status === "done" ? "green" : "blue"}>
                  {status === "done" ? "剧本摘要已生成" : "Agent 分析中"}
                </Badge>
                <h2 className="mt-3 text-base font-semibold text-slate-950">
                  {data.project.title}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  {data.outline?.summary}
                </p>
              </div>
              {status === "done" ? (
                <Link
                  href="/drama/project-demo/outline"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  确认大纲，提取角色与场景
                </Link>
              ) : null}
            </div>
          </Panel>
        ) : null}
      </div>
    </AppShell>
  );
}
