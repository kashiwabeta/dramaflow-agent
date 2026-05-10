"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AppShell,
  AssetPlaceholder,
  Badge,
  PageHeader,
  Panel,
} from "@/components/workspace";
import mockProject from "@/data/mock-project.json";
import type { AiGenerationResult, Episode } from "@/types/project";

const data = mockProject as AiGenerationResult;

export default function EpisodesPage() {
  const [episodes, setEpisodes] = useState(
    data.episodes.map((episode) => ({
      ...episode,
      status: episode.status ?? "待生成分镜",
    })),
  );

  function generateStoryboard(episodeId: string) {
    setEpisodes((current) =>
      current.map((episode) =>
        episode.id === episodeId ? { ...episode, status: "分镜生成中" } : episode,
      ),
    );
    window.setTimeout(() => {
      setEpisodes((current) =>
        current.map((episode) =>
          episode.id === episodeId ? { ...episode, status: "分镜已生成" } : episode,
        ),
      );
    }, 2000);
  }

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl space-y-5 px-5 py-5">
        <PageHeader
          title="分集视频"
          description="按集管理剧情摘要和分镜生成状态，先生成本集分镜，再进入逐镜头页面。"
          currentStep={3}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {episodes.map((episode) => (
            <EpisodeCard
              key={episode.id}
              episode={episode}
              onGenerate={() => generateStoryboard(episode.id)}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function EpisodeCard({
  episode,
  onGenerate,
}: {
  episode: Episode;
  onGenerate: () => void;
}) {
  const canView = episode.status === "分镜已生成" || episode.status === "已完成";
  return (
    <Panel className="overflow-hidden">
      <div className="grid gap-4 p-4 md:grid-cols-[180px_1fr]">
        <AssetPlaceholder label={`EP ${episode.episodeNumber}`} variant="slate" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="dark">第 {episode.episodeNumber} 集</Badge>
            <Badge tone={episode.status === "分镜生成中" ? "blue" : canView ? "green" : "amber"}>
              {episode.status}
            </Badge>
          </div>
          <h2 className="mt-3 text-base font-semibold text-slate-950">{episode.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{episode.synopsis}</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <Metric label="场景数" value={String(episode.sceneCount ?? episode.shots.length)} />
            <Metric label="预计镜头数" value={String(episode.estimatedShotCount ?? episode.shots.length)} />
            <Metric label="预计时长" value={episode.estimatedDuration} />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-slate-200 bg-slate-50 p-3">
        <button
          type="button"
          onClick={onGenerate}
          disabled={episode.status === "分镜生成中"}
          className="inline-flex h-9 items-center justify-center rounded-lg bg-slate-950 px-3 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-70"
        >
          {episode.status === "分镜生成中" ? "生成中..." : "生成分镜提示词"}
        </button>
        {canView ? (
          <Link
            href={`/one-click/project-demo/episodes/${episode.episodeNumber}`}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            查看分镜
          </Link>
        ) : null}
        <button className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
          编辑本集剧情
        </button>
        <button
          type="button"
          onClick={onGenerate}
          className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          重新生成本集
        </button>
      </div>
    </Panel>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-2">
      <p className="text-sm font-semibold text-slate-950">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
