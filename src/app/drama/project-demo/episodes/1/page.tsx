"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  AppShell,
  AssetPlaceholder,
  Badge,
  PageHeader,
  Panel,
} from "@/components/workspace";
import mockProject from "@/data/mock-project.json";
import type { AiGenerationResult, Shot } from "@/types/project";

const data = mockProject as AiGenerationResult;
const characters = data.characters;
const scenes = data.scenes ?? [];
const props = data.props ?? [];

type EditableShot = Shot & {
  status: "未生成" | "生成中" | "已生成" | "失败";
  characterIds: string[];
  sceneId: string;
};

export default function EpisodeShotsPage() {
  const params = useParams<{ episodeNumber?: string }>();
  const episodeNumber = Number(params.episodeNumber ?? "1");
  const episode =
    data.episodes.find((item) => item.episodeNumber === episodeNumber) ??
    data.episodes[0];
  const [shots, setShots] = useState<EditableShot[]>(
    episode.shots.map((shot) => ({
      ...shot,
      status: shot.status ?? "未生成",
      characterIds: shot.characterIds ?? [characters[0]?.id].filter(Boolean),
      sceneId: shot.sceneId ?? scenes[0]?.id ?? "",
    })),
  );
  const [selectedShotId, setSelectedShotId] = useState(shots[0]?.id ?? "");
  const [copied, setCopied] = useState<string | null>(null);
  const selectedShot = shots.find((shot) => shot.id === selectedShotId) ?? shots[0];

  function updateShot(id: string, patch: Partial<EditableShot>) {
    setShots((current) =>
      current.map((shot) => (shot.id === id ? { ...shot, ...patch } : shot)),
    );
  }

  function generateShot(id: string) {
    updateShot(id, { status: "生成中" });
    window.setTimeout(() => updateShot(id, { status: "已生成" }), 1200);
  }

  async function copyText(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(key);
    window.setTimeout(() => setCopied((current) => (current === key ? null : current)), 1200);
  }

  return (
    <AppShell>
      <div className="mx-auto grid w-full max-w-[1760px] gap-5 px-5 py-5 xl:grid-cols-[260px_minmax(0,1fr)_380px]">
        <aside className="space-y-4">
          <Panel className="p-4">
            <h2 className="text-sm font-semibold text-slate-950">项目资产库</h2>
            <p className="body-copy mt-1">
              已确认角色、场景和道具可被镜头引用。
            </p>
          </Panel>
          <AssetGroup title="角色">
            {characters.map((character) => (
              <div key={character.id} className="rounded-lg border border-slate-200 bg-white p-3">
                <AssetPlaceholder label={character.name} />
                <p className="mt-2 text-sm font-semibold text-slate-950">{character.name}</p>
                <p className="text-xs text-slate-500">{character.role}</p>
              </div>
            ))}
          </AssetGroup>
          <AssetGroup title="场景">
            {scenes.map((scene) => (
              <div key={scene.id} className="rounded-lg border border-slate-200 bg-white p-3">
                <AssetPlaceholder label={scene.name} variant="slate" />
                <p className="mt-2 text-sm font-semibold text-slate-950">{scene.name}</p>
              </div>
            ))}
          </AssetGroup>
          <AssetGroup title="道具">
            {props.map((prop) => (
              <div key={prop.id} className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-sm font-semibold text-slate-950">{prop.name}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                  {prop.description}
                </p>
              </div>
            ))}
          </AssetGroup>
        </aside>

        <div className="min-w-0 space-y-5">
          <PageHeader
            title={`第 ${episode.episodeNumber} 集逐镜头生成`}
            description={episode.synopsis}
            currentStep={3}
          />
          <div className="space-y-4">
            {shots.map((shot) => (
              <ShotEditor
                key={shot.id}
                shot={shot}
                active={shot.id === selectedShot.id}
                onSelect={() => setSelectedShotId(shot.id)}
                onUpdate={(patch) => updateShot(shot.id, patch)}
                onGenerateImage={() => generateShot(shot.id)}
                onGenerateVideo={() => generateShot(shot.id)}
                onCopyImage={() => copyText(shot.imagePrompt, `${shot.id}-image`)}
                onCopyVideo={() => copyText(shot.videoPrompt, `${shot.id}-video`)}
                copied={copied}
              />
            ))}
          </div>
        </div>

        <aside className="right-preview">
          <Panel className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-950">9:16 竖屏预览</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Shot {selectedShot.index} · {selectedShot.duration}
                </p>
              </div>
              <Badge tone={selectedShot.status === "已生成" ? "green" : selectedShot.status === "生成中" ? "blue" : "neutral"}>
                {selectedShot.status}
              </Badge>
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-900 bg-slate-950 p-2">
              <div className="aspect-[9/16] rounded-lg bg-[radial-gradient(circle_at_30%_12%,rgba(14,165,233,.7),transparent_24%),linear-gradient(160deg,#111827_0%,#334155_50%,#020617_100%)] p-5 text-white">
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <Badge tone="dark">EP 01 · Shot {selectedShot.index}</Badge>
                    <h3 className="cn-title mt-5 text-2xl text-[#fff7ea]">{selectedShot.scene}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#e8dcca]">{selectedShot.action}</p>
                  </div>
                  <div className="rounded-lg bg-white/12 p-4 backdrop-blur-md ring-1 ring-white/15">
                    <p className="text-xs font-semibold text-slate-300">Video Prompt</p>
                    <p className="prompt-text mt-2 text-[#fff7ea]">{selectedShot.videoPrompt}</p>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </aside>
      </div>
    </AppShell>
  );
}

function AssetGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Panel className="p-4">
      <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
      <div className="mt-3 space-y-3">{children}</div>
    </Panel>
  );
}

function ShotEditor({
  shot,
  active,
  copied,
  onSelect,
  onUpdate,
  onGenerateImage,
  onGenerateVideo,
  onCopyImage,
  onCopyVideo,
}: {
  shot: EditableShot;
  active: boolean;
  copied: string | null;
  onSelect: () => void;
  onUpdate: (patch: Partial<EditableShot>) => void;
  onGenerateImage: () => void;
  onGenerateVideo: () => void;
  onCopyImage: () => void;
  onCopyVideo: () => void;
}) {
  return (
    <Panel className={`p-4 transition ${active ? "border-sky-300 ring-4 ring-sky-100" : ""}`}>
      <button type="button" onClick={onSelect} className="w-full text-left">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge tone={active ? "blue" : "neutral"}>Shot {shot.index}</Badge>
            <Badge tone={shot.status === "已生成" ? "green" : shot.status === "生成中" ? "blue" : "neutral"}>
              {shot.status}
            </Badge>
          </div>
          <span className="text-xs font-medium text-slate-500">{shot.duration}</span>
        </div>
      </button>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold text-slate-500">时长</span>
          <input
            value={shot.duration}
            onChange={(event) => onUpdate({ duration: event.target.value })}
            className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-sky-300 focus:bg-white"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-slate-500">引用场景</span>
          <select
            value={shot.sceneId}
            onChange={(event) => onUpdate({ sceneId: event.target.value })}
            className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-sky-300 focus:bg-white"
          >
            {scenes.map((scene) => (
              <option key={scene.id} value={scene.id}>
                {scene.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block lg:col-span-2">
          <span className="text-xs font-semibold text-slate-500">出场角色</span>
          <select
            value={shot.characterIds[0] ?? ""}
            onChange={(event) => onUpdate({ characterIds: [event.target.value] })}
            className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-sky-300 focus:bg-white"
          >
            {characters.map((character) => (
              <option key={character.id} value={character.id}>
                {character.name}
              </option>
            ))}
          </select>
        </label>
        <PromptArea
          label="画面描述"
          value={shot.action}
          onChange={(value) => onUpdate({ action: value })}
        />
        <PromptArea
          label="图片提示词"
          value={shot.imagePrompt}
          onChange={(value) => onUpdate({ imagePrompt: value })}
        />
        <PromptArea
          label="视频提示词"
          value={shot.videoPrompt}
          onChange={(value) => onUpdate({ videoPrompt: value })}
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <ShotButton onClick={onGenerateImage}>生成图片</ShotButton>
        <ShotButton onClick={onGenerateVideo}>生成视频</ShotButton>
        <ShotButton onClick={() => onUpdate({ status: "未生成" })}>重新生成提示词</ShotButton>
        <ShotButton onClick={onCopyImage}>{copied === `${shot.id}-image` ? "已复制" : "复制图片提示词"}</ShotButton>
        <ShotButton onClick={onCopyVideo}>{copied === `${shot.id}-video` ? "已复制" : "复制视频提示词"}</ShotButton>
      </div>
    </Panel>
  );
}

function PromptArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block lg:col-span-2">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="prompt-text prompt-box mt-1 min-h-20 w-full rounded-lg p-3 outline-none"
      />
    </label>
  );
}

function ShotButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
    >
      {children}
    </button>
  );
}
