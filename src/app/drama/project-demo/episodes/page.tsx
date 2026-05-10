"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AppShell,
  AssetPlaceholder,
  Badge,
  DraftStatus,
  PageHeader,
  Panel,
} from "@/components/workspace";
import { useProjectStore } from "@/hooks/useProjectStore";
import type { Episode } from "@/types/project";

type EpisodeStatus = NonNullable<Episode["status"]>;

export default function EpisodesPage() {
  const {
    project,
    saveStatus,
    updateEpisode,
    setEpisodeStatus,
    resetProject,
  } = useProjectStore();
  const [editingEpisodeId, setEditingEpisodeId] = useState<string | null>(null);
  const episodes = project.episodes.map((episode) => ({
    ...episode,
    status: episode.status ?? "待生成分镜",
  }));

  function generateStoryboard(episodeId: string) {
    setEpisodeStatus(episodeId, "分镜生成中");
    window.setTimeout(() => {
      setEpisodeStatus(episodeId, "分镜已生成");
    }, 1500);
  }

  function resetEpisode(episode: Episode) {
    updateEpisode(episode.id, {
      status: "待生成分镜",
      synopsis: episode.synopsis.includes("分镜状态已重置")
        ? episode.synopsis
        : `${episode.synopsis}（分镜状态已重置，可重新生成提示词。）`,
    });
    setEditingEpisodeId(null);
  }

  function updateDraft(episodeId: string, patch: Partial<Episode>) {
    updateEpisode(episodeId, {
      ...patch,
      status: "部分待修改",
    });
  }

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl space-y-5 px-5 py-5">
        <PageHeader
          title="分集视频规划"
          description="按集管理剧情、镜头数量和分镜提示词生成状态。每一集需要单独生成分镜提示词后，再进入逐镜头生产页。"
          currentStep={3}
        />
        <DraftStatus saveStatus={saveStatus} onReset={resetProject} />

        <Panel className="overflow-hidden">
          <div className="border-b border-[#184b52]/15 bg-[#fff7ea]/55 px-4 py-4">
            <p className="section-kicker">EPISODE PRODUCTION QUEUE</p>
            <div className="mt-2 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="cn-title text-xl">AI 拆解分集任务</h2>
                <p className="body-copy mt-1 max-w-3xl">
                  每张卡片代表一集短剧生产任务。先确认剧情摘要，再单独生成该集分镜提示词。
                </p>
              </div>
              <p className="meta-text text-[#607880]">
                {episodes.filter((episode) => episode.status === "分镜已生成" || episode.status === "已完成").length}
                /{episodes.length} STORYBOARDS READY
              </p>
            </div>
          </div>

          <div className="grid gap-4 bg-[#f8eddc]/35 p-4 lg:grid-cols-2">
            {episodes.map((episode) => (
              <EpisodeCard
                key={episode.id}
                episode={episode}
                editing={editingEpisodeId === episode.id}
                onEdit={() =>
                  setEditingEpisodeId((current) =>
                    current === episode.id ? null : episode.id,
                  )
                }
                onUpdate={(patch) => updateDraft(episode.id, patch)}
                onGenerate={() => generateStoryboard(episode.id)}
                onReset={() => resetEpisode(episode)}
              />
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}

function EpisodeCard({
  episode,
  editing,
  onEdit,
  onUpdate,
  onGenerate,
  onReset,
}: {
  episode: Episode & { status: EpisodeStatus };
  editing: boolean;
  onEdit: () => void;
  onUpdate: (patch: Partial<Episode>) => void;
  onGenerate: () => void;
  onReset: () => void;
}) {
  const canView = episode.status === "分镜已生成" || episode.status === "已完成";
  const isGenerating = episode.status === "分镜生成中";
  const isComplete = canView;

  return (
    <section
      className={`paper-card overflow-hidden rounded-lg border bg-[#fffaf0] shadow-sm transition hover:-translate-y-0.5 hover:border-[#f28c6a]/45 ${
        isComplete ? "border-[#6f8f7d]/45" : ""
      }`}
    >
      <div className="h-1.5 bg-[#184b52]">
        <div
          className={`h-full transition-all duration-500 ${
            isGenerating
              ? "w-2/3 animate-pulse bg-[#f28c6a]"
              : isComplete
                ? "w-full bg-[#6f8f7d]"
                : "w-1/4 bg-[#f28c6a]"
          }`}
        />
      </div>

      <div className="grid gap-4 p-4 md:grid-cols-[150px_minmax(0,1fr)]">
        <div>
          <div className="rounded-lg border border-[#184b52]/15 bg-[#fff7ea] p-2 shadow-sm">
            <AssetPlaceholder
              label={`EP ${String(episode.episodeNumber).padStart(2, "0")}`}
              variant={isComplete ? "green" : isGenerating ? "amber" : "slate"}
            />
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-[#184b52]/15 pt-3">
            <span className="font-mono text-3xl font-semibold tracking-[0.14em] text-[#f28c6a]">
              EP {String(episode.episodeNumber).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="dark">EPISODE TASK</Badge>
            <Badge tone={episodeStatusTone(episode.status)}>{episode.status}</Badge>
          </div>

          {editing ? (
            <div className="mt-3 space-y-3">
              <label className="block">
                <span className="meta-text">TITLE</span>
                <input
                  value={episode.title}
                  onChange={(event) => onUpdate({ title: event.target.value })}
                  className="cn-title mt-1 h-10 w-full rounded-md border border-[#184b52]/12 bg-[#fff7ea]/70 px-3 text-lg outline-none transition focus:border-[#f28c6a]/70"
                />
              </label>
              <label className="block">
                <span className="meta-text">SYNOPSIS</span>
                <textarea
                  value={episode.synopsis}
                  onChange={(event) => onUpdate({ synopsis: event.target.value })}
                  className="body-copy mt-1 min-h-28 w-full resize-y rounded-md border border-[#184b52]/12 bg-[#fff7ea]/70 p-3 outline-none transition focus:border-[#f28c6a]/70"
                />
              </label>
            </div>
          ) : (
            <>
              <h3 className="cn-title mt-3 text-xl">{episode.title}</h3>
              <p className="body-copy mt-2 line-clamp-4">{episode.synopsis}</p>
            </>
          )}

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <Metric label="场景数" value={String(episode.sceneCount ?? episode.shots.length)} />
            <Metric
              label="预计镜头数"
              value={String(episode.estimatedShotCount ?? episode.shots.length)}
            />
            <Metric label="预计时长" value={episode.estimatedDuration} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-[#184b52]/15 bg-[#f8eddc]/65 p-3">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating}
          className="tool-btn tool-btn-primary disabled:cursor-wait disabled:opacity-70"
        >
          {isGenerating ? "分镜生成中..." : "生成分镜提示词 →"}
        </button>
        <Link
          href={`/one-click/project-demo/episodes/${episode.episodeNumber}`}
          aria-disabled={!canView}
          className={`tool-btn ${canView ? "tool-btn-primary" : "pointer-events-none opacity-45"}`}
        >
          查看分镜 →
        </Link>
        <button type="button" onClick={onEdit} className="tool-btn">
          {editing ? "收起编辑" : "编辑本集剧情"}
        </button>
        <button type="button" onClick={onReset} className="tool-btn">
          重新生成本集
        </button>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#184b52]/12 bg-[#fff7ea]/70 p-2">
      <p className="font-mono text-sm font-semibold tracking-[0.08em] text-[#184b52]">
        {value}
      </p>
      <p className="meta-text mt-1">{label}</p>
    </div>
  );
}

function episodeStatusTone(status: EpisodeStatus): "neutral" | "blue" | "green" | "amber" {
  if (status === "分镜生成中") return "blue";
  if (status === "分镜已生成" || status === "已完成") return "green";
  if (status === "部分待修改") return "amber";
  return "neutral";
}
