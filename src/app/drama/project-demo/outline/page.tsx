"use client";

import Link from "next/link";
import { useState } from "react";
import { AppShell, Badge, PageHeader, Panel } from "@/components/workspace";
import mockProject from "@/data/mock-project.json";
import type { AiGenerationResult } from "@/types/project";

const data = mockProject as AiGenerationResult;

export default function OutlinePage() {
  const outline = data.outline;
  const [analyzing, setAnalyzing] = useState(false);
  const [fields, setFields] = useState({
    summary: outline?.summary ?? "",
    genre: outline?.genre ?? data.project.genre,
    mainConflict: outline?.mainConflict ?? "",
    relationships: outline?.relationships ?? "",
    episodeSuggestions: outline?.episodeSuggestions.join("\n") ?? "",
  });

  function updateField(key: keyof typeof fields, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  function reanalyze() {
    setAnalyzing(true);
    window.setTimeout(() => setAnalyzing(false), 1200);
  }

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-6xl space-y-5 px-5 py-5">
        <PageHeader
          title="剧本大纲确认"
          description="编辑 Agent 拆解出的故事信息，确认后进入角色与场景资产生成。"
          currentStep={1}
          action={<Badge tone="blue">字段可编辑</Badge>}
        />

        <Panel className="p-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="block lg:col-span-2">
              <span className="text-sm font-semibold text-slate-700">故事简介</span>
              <textarea
                value={fields.summary}
                onChange={(event) => updateField("summary", event.target.value)}
                className="mt-2 min-h-28 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-sky-300 focus:bg-white"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">题材</span>
              <input
                value={fields.genre}
                onChange={(event) => updateField("genre", event.target.value)}
                className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-sky-300 focus:bg-white"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">主要冲突</span>
              <textarea
                value={fields.mainConflict}
                onChange={(event) => updateField("mainConflict", event.target.value)}
                className="mt-2 min-h-24 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-sky-300 focus:bg-white"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">人物关系</span>
              <textarea
                value={fields.relationships}
                onChange={(event) => updateField("relationships", event.target.value)}
                className="mt-2 min-h-32 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-sky-300 focus:bg-white"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">分集建议</span>
              <textarea
                value={fields.episodeSuggestions}
                onChange={(event) => updateField("episodeSuggestions", event.target.value)}
                className="mt-2 min-h-32 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-sky-300 focus:bg-white"
              />
            </label>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={reanalyze}
              disabled={analyzing}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-70"
            >
              {analyzing ? "重新分析中..." : "重新分析"}
            </button>
            <Link
              href="/drama/project-demo/assets"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              确认大纲，提取角色与场景
            </Link>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
