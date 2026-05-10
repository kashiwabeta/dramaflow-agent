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
        <div className="space-y-5">
          <div className="paper-card rounded-lg border px-6 py-7 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="echo-label text-xs text-[#f28c6a]">DRAMAFLOW AGENT</p>
                <h1 className="display-title mt-3 text-[#fff7ea] drop-shadow-[0_2px_0_rgba(24,75,82,.18)]">
                  DRAMAFLOW
                </h1>
                <p className="cn-title mt-4">
                  AI 短剧一键直出工作台
                </p>
              </div>
              <div className="max-w-sm border-t border-[#184b52]/25 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                <p className="echo-label text-[10px] text-[#607880]">45 RPM · STORYBOARD · AI AGENT</p>
                <p className="body-copy mt-3">
                  上传剧本、粘贴文本或直接 AI 生成，先完成剧本大纲拆解。
                </p>
              </div>
            </div>
          </div>
          <PageHeader
            title="剧本大纲"
            description="第一步：输入剧本素材并生成剧本摘要。"
            currentStep={1}
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <Panel className="p-5">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`echo-label h-9 rounded-md border px-4 text-[11px] font-semibold transition ${
                    activeTab === tab
                      ? "border-[#f28c6a] bg-[#fff7ea] text-[#f28c6a] shadow-sm"
                      : "border-[#184b52]/15 bg-[#f6ecdc] text-[#607880] hover:border-[#f28c6a]/50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-6 rounded-lg border border-dashed border-[#184b52]/30 bg-[#fff7ea]/65 px-6 py-12 transition hover:border-[#f28c6a] md:grid-cols-[180px_1fr]">
              <div className="border-b border-[#184b52]/20 pb-5 md:border-b-0 md:border-r md:pb-0 md:pr-6">
                <p className="font-mono text-4xl font-semibold tracking-[0.16em] text-[#f28c6a]">01</p>
                <p className="mt-2 font-serif text-sm italic tracking-[0.12em] text-[#184b52]">
                  Input
                </p>
                <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-md border border-[#184b52]/15 bg-[#fff7ea] text-[#184b52] shadow-sm">
                  <Icon name={activeTab === "AI 生成" ? "bolt" : "upload"} className="h-6 w-6" />
                </div>
              </div>
              <div className="flex min-h-72 flex-col justify-between">
                <div>
                  <p className="echo-label text-[10px] text-[#607880]">SCRIPT SOURCE</p>
                  <p className="mt-5 text-lg font-semibold text-[#173f47]">
                    {activeTab === "AI 生成" ? data.input.theme : "拖拽文件到此处，或点击选择"}
                  </p>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[#59727a]">
                    {activeTab === "AI 生成"
                      ? data.input.requirement
                      : "支持 .txt .docx .pdf。当前仅模拟上传状态，不会读取真实文件。"}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-[#184b52]/15 pt-4">
                  <span className="echo-label text-[10px] text-[#9aa4a6]">DF-001 · PRINTED IN BLUE</span>
                  <button
                    type="button"
                    onClick={startAnalyze}
                    disabled={status === "analyzing"}
                    className="inline-flex h-10 items-center justify-center rounded-md border border-[#f28c6a] px-5 text-sm font-semibold text-[#f28c6a] transition hover:bg-[#f28c6a] hover:text-[#fff7ea] disabled:cursor-wait disabled:opacity-70"
                  >
                    {status === "analyzing" ? "分析中..." : "开始分析 →"}
                  </button>
                </div>
              </div>
            </div>
          </Panel>

          <Panel className="p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="cn-title text-lg">剧本摘要</h2>
              <Badge tone={status === "done" ? "green" : status === "analyzing" ? "blue" : "neutral"}>
                {status === "done" ? "已生成" : status === "analyzing" ? "生成中" : "待分析"}
              </Badge>
            </div>
            {status === "idle" ? (
              <p className="body-copy mt-4">
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
                  <p className="body-copy mt-1">
                    {data.outline?.summary}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400">主要冲突</p>
                  <p className="body-copy mt-1">
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
