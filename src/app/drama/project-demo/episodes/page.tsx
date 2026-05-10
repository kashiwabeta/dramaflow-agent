"use client";

import Link from "next/link";
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

export default function EpisodesPage() {
  const {
    project,
    saveStatus,
    updateEpisode,
    setEpisodeStatus,
    resetProject,
  } = useProjectStore();
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

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl space-y-5 px-5 py-5">
        <PageHeader
          title="分集视频"
          description="按集管理剧情摘要和分镜生成状态，先生成本集分镜，再进入逐镜头页面。"
          currentStep={3}
        />
        <DraftStatus saveStatus={saveStatus} onReset={resetProject} />
        <div className="grid gap-4 lg:grid-cols-2">
          {episodes.map((episode) => (
            <EpisodeCard
              key={episode.id}
              episode={episode}
              onUpdate={(patch) => updateEpisode(episode.id, patch)}
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
  onUpdate,
  onGenerate,
}: {
  episode: Episode;
  onUpdate: (patch: Partial<Episode>) => void;
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
          <input
            value={episode.title}
            onChange={(event) => onUpdate({ title: event.target.value })}
            className="cn-title mt-3 w-full rounded-md border border-transparent bg-transparent px-0 py-1 text-lg outline-none focus:border-[#f28c6a]/60 focus:bg-[#fff7ea]/60"
          />
          <textarea
            value={episode.synopsis}
            onChange={(event) => onUpdate({ synopsis: event.target.value })}
            className="body-copy mt-2 min-h-20 w-full resize-none rounded-md border border-transparent bg-transparent p-0 outline-none focus:border-[#f28c6a]/60 focus:bg-[#fff7ea]/60"
          />
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
