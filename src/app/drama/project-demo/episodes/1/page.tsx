"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import {
  AppShell,
  AssetPlaceholder,
  Badge,
  DraftStatus,
  Panel,
} from "@/components/workspace";
import { useProjectStore } from "@/hooks/useProjectStore";
import type { CharacterAsset, PropAsset, SceneAsset, Shot } from "@/types/project";

type EditableShot = Shot & {
  status: NonNullable<Shot["status"]>;
  characterIds: string[];
  sceneId: string;
};

type BadgeTone = "neutral" | "blue" | "green" | "amber" | "dark" | "red";

export default function EpisodeShotsPage() {
  const {
    project,
    saveStatus,
    updateShot,
    setShotStatus,
    resetProject,
  } = useProjectStore();
  const params = useParams<{ episodeNumber?: string }>();
  const episodeNumber = Number(params.episodeNumber ?? "1");
  const episode =
    project.episodes.find((item) => item.episodeNumber === episodeNumber) ??
    project.episodes[0];
  const characters = project.characters;
  const scenes = project.scenes ?? [];
  const props = project.props ?? [];
  const shots: EditableShot[] = episode.shots.map((shot) => ({
    ...shot,
    status: shot.status ?? "未生成",
    characterIds: shot.characterIds ?? [characters[0]?.id].filter(Boolean),
    sceneId: shot.sceneId ?? scenes[0]?.id ?? "",
  }));
  const [selectedShotId, setSelectedShotId] = useState(shots[0]?.id ?? "");
  const [copied, setCopied] = useState<string | null>(null);
  const selectedShot = shots.find((shot) => shot.id === selectedShotId) ?? shots[0];

  function updateCurrentShot(patch: Partial<Shot>) {
    updateShot(episode.id, selectedShot.id, patch);
  }

  function addCharacterToShot(characterId: string) {
    const characterIds = selectedShot.characterIds.includes(characterId)
      ? selectedShot.characterIds
      : [...selectedShot.characterIds, characterId];
    updateCurrentShot({ characterIds });
  }

  function addSceneToShot(scene: SceneAsset) {
    updateCurrentShot({ sceneId: scene.id, scene: scene.name });
  }

  function regeneratePrompts() {
    setShotStatus(episode.id, selectedShot.id, "提示词生成中");
    window.setTimeout(() => {
      updateShot(episode.id, selectedShot.id, {
        imagePrompt: `${selectedShot.imagePrompt}, refreshed keyframe prompt, variation ${Date.now() % 1000}`,
        videoPrompt: `${selectedShot.videoPrompt}, refreshed camera motion prompt, variation ${Date.now() % 1000}`,
        status: "提示词已生成",
      });
    }, 1500);
  }

  function generateImage() {
    setShotStatus(episode.id, selectedShot.id, "图片生成中");
    window.setTimeout(() => setShotStatus(episode.id, selectedShot.id, "图片已生成"), 1500);
  }

  function generateVideo() {
    setShotStatus(episode.id, selectedShot.id, "视频生成中");
    window.setTimeout(() => setShotStatus(episode.id, selectedShot.id, "视频已生成"), 1500);
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
      <div className="mx-auto flex min-h-screen w-full max-w-[1800px] flex-col gap-4 px-5 py-5">
        <TopBar
          projectTitle={project.project.title}
          episodeNumber={episode.episodeNumber}
          episodeTitle={episode.title}
          status={deriveEpisodeProductionStatus(episode.status, shots)}
          saveStatus={saveStatus}
          onReset={resetProject}
        />

        <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[270px_minmax(0,1fr)_390px]">
          <ProjectAssetRail
            characters={characters}
            scenes={scenes}
            props={props}
            selectedShot={selectedShot}
            onAddCharacter={addCharacterToShot}
            onAddScene={addSceneToShot}
          />

          <ShotEditor
            shot={selectedShot}
            characters={characters}
            scenes={scenes}
            onUpdate={updateCurrentShot}
          />

          <ShotPreviewPanel
            episodeNumber={episode.episodeNumber}
            shot={selectedShot}
            copied={copied}
            onGenerateImage={generateImage}
            onGenerateVideo={generateVideo}
            onRegeneratePrompts={regeneratePrompts}
            onCopyImage={() => copyText(selectedShot.imagePrompt, `${selectedShot.id}-image`)}
            onCopyVideo={() => copyText(selectedShot.videoPrompt, `${selectedShot.id}-video`)}
          />
        </div>

        <ShotTimeline
          shots={shots}
          selectedShotId={selectedShot.id}
          onSelect={setSelectedShotId}
        />
      </div>
    </AppShell>
  );
}

function TopBar({
  projectTitle,
  episodeNumber,
  episodeTitle,
  status,
  saveStatus,
  onReset,
}: {
  projectTitle: string;
  episodeNumber: number;
  episodeTitle: string;
  status: string;
  saveStatus: "idle" | "saving" | "saved";
  onReset: () => void;
}) {
  return (
    <Panel className="p-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <p className="section-kicker">SHOT PRODUCTION DESK</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge tone="dark">EP {String(episodeNumber).padStart(2, "0")}</Badge>
            <Badge tone={status === "已完成" ? "green" : status === "生产中" ? "blue" : "amber"}>
              {status}
            </Badge>
          </div>
          <h1 className="cn-title mt-3 truncate text-xl">{projectTitle}</h1>
          <p className="body-copy mt-1 truncate">{episodeTitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/one-click/project-demo/episodes" className="tool-btn">
            返回分集列表
          </Link>
          <DraftStatus saveStatus={saveStatus} onReset={onReset} />
        </div>
      </div>
    </Panel>
  );
}

function ProjectAssetRail({
  characters,
  scenes,
  props,
  selectedShot,
  onAddCharacter,
  onAddScene,
}: {
  characters: CharacterAsset[];
  scenes: SceneAsset[];
  props: PropAsset[];
  selectedShot: EditableShot;
  onAddCharacter: (characterId: string) => void;
  onAddScene: (scene: SceneAsset) => void;
}) {
  return (
    <aside className="min-h-0 space-y-3 xl:overflow-y-auto">
      <Panel className="p-4">
        <p className="section-kicker">PROJECT ASSETS</p>
        <h2 className="cn-title mt-2 text-lg">当前项目引用栏</h2>
        <p className="body-copy mt-1">
          点击资产即可 mock 添加到当前 Shot 引用。
        </p>
      </Panel>
      <AssetSection title="角色">
        {characters.map((character) => (
          <AssetMiniCard
            key={character.id}
            label={character.name}
            meta={character.role}
            status={character.status ?? "待确认"}
            active={selectedShot.characterIds.includes(character.id)}
            variant="blue"
            onClick={() => onAddCharacter(character.id)}
          />
        ))}
      </AssetSection>
      <AssetSection title="场景">
        {scenes.map((scene) => (
          <AssetMiniCard
            key={scene.id}
            label={scene.name}
            meta="场景"
            status={scene.status}
            active={selectedShot.sceneId === scene.id}
            variant="slate"
            onClick={() => onAddScene(scene)}
          />
        ))}
      </AssetSection>
      <AssetSection title="道具">
        {props.map((prop) => (
          <AssetMiniCard
            key={prop.id}
            label={prop.name}
            meta="道具"
            status={prop.status}
            active={false}
            variant="amber"
            onClick={() => undefined}
          />
        ))}
      </AssetSection>
    </aside>
  );
}

function AssetSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Panel className="p-3">
      <p className="section-kicker">{title}</p>
      <div className="mt-3 space-y-2">{children}</div>
    </Panel>
  );
}

function AssetMiniCard({
  label,
  meta,
  status,
  active,
  variant,
  onClick,
}: {
  label: string;
  meta: string;
  status: string;
  active: boolean;
  variant: "blue" | "slate" | "amber";
  onClick: () => void;
}) {
  const locked = status === "已锁定";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`grid w-full grid-cols-[58px_minmax(0,1fr)] gap-3 rounded-lg border bg-[#fffaf0] p-2 text-left transition hover:-translate-y-0.5 hover:border-[#f28c6a]/60 ${
        active ? "border-[#f28c6a] shadow-sm" : "border-[#184b52]/12"
      }`}
    >
      <AssetPlaceholder label={label.slice(0, 4)} variant={variant} />
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-[#173f47]">{label}</span>
        <span className="meta-text mt-1 block truncate">{meta}</span>
        <span className="mt-2 flex flex-wrap gap-1">
          <Badge tone={locked ? "green" : "neutral"}>{locked ? "已锁定" : status}</Badge>
        </span>
      </span>
    </button>
  );
}

function ShotEditor({
  shot,
  characters,
  scenes,
  onUpdate,
}: {
  shot: EditableShot;
  characters: CharacterAsset[];
  scenes: SceneAsset[];
  onUpdate: (patch: Partial<Shot>) => void;
}) {
  return (
    <Panel className="min-w-0 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#184b52]/15 pb-4">
        <div>
          <p className="section-kicker">CURRENT SHOT EDITOR</p>
          <h2 className="mt-2 font-mono text-3xl font-semibold tracking-[0.14em] text-[#f28c6a]">
            SHOT {String(shot.index).padStart(2, "0")}
          </h2>
        </div>
        <Badge tone={shotTone(shot.status)}>{shot.status}</Badge>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <label className="block rounded-md border border-[#184b52]/12 bg-[#fff7ea]/70 px-3 py-2">
          <span className="meta-text">DURATION</span>
          <input
            value={shot.duration}
            onChange={(event) => onUpdate({ duration: event.target.value })}
            className="body-copy mt-1 h-9 w-full rounded-md border border-transparent bg-transparent p-0 outline-none focus:border-[#f28c6a]/60 focus:bg-[#fffaf0]"
          />
        </label>
        <label className="block rounded-md border border-[#184b52]/12 bg-[#fff7ea]/70 px-3 py-2">
          <span className="meta-text">SCENE</span>
          <select
            value={shot.sceneId}
            onChange={(event) => {
              const scene = scenes.find((item) => item.id === event.target.value);
              onUpdate({
                sceneId: event.target.value,
                scene: scene?.name ?? shot.scene,
              });
            }}
            className="body-copy mt-1 h-9 w-full rounded-md border border-transparent bg-transparent p-0 outline-none focus:border-[#f28c6a]/60 focus:bg-[#fffaf0]"
          >
            {scenes.map((scene) => (
              <option key={scene.id} value={scene.id}>
                {scene.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block rounded-md border border-[#184b52]/12 bg-[#fff7ea]/70 px-3 py-2 lg:col-span-2">
          <span className="meta-text">CHARACTERS</span>
          <select
            value={shot.characterIds[0] ?? ""}
            onChange={(event) => onUpdate({ characterIds: [event.target.value] })}
            className="body-copy mt-1 h-9 w-full rounded-md border border-transparent bg-transparent p-0 outline-none focus:border-[#f28c6a]/60 focus:bg-[#fffaf0]"
          >
            {characters.map((character) => (
              <option key={character.id} value={character.id}>
                {character.name}
              </option>
            ))}
          </select>
          <div className="mt-2 flex flex-wrap gap-1">
            {shot.characterIds.map((id) => {
              const character = characters.find((item) => item.id === id);
              return character ? (
                <Badge key={id} tone="neutral">
                  {character.name}
                </Badge>
              ) : null;
            })}
          </div>
        </label>
        <PromptEditor
          label="画面描述"
          value={shot.action}
          onChange={(value) => onUpdate({ action: value })}
        />
        <PromptEditor
          label="IMAGE PROMPT"
          value={shot.imagePrompt}
          onChange={(value) => onUpdate({ imagePrompt: value })}
        />
        <PromptEditor
          label="VIDEO PROMPT"
          value={shot.videoPrompt}
          onChange={(value) => onUpdate({ videoPrompt: value })}
        />
      </div>
    </Panel>
  );
}

function PromptEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const technical = label.includes("PROMPT");
  return (
    <label className="block rounded-lg border border-[#184b52]/14 bg-[#fff7ea] p-3 shadow-sm lg:col-span-2">
      <span className={technical ? "section-kicker" : "meta-text"}>{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-3 min-h-28 w-full resize-y rounded-md border border-[#184b52]/12 bg-[#f9efdf] p-3 text-[#173f47] outline-none transition focus:border-[#f28c6a]/70 focus:bg-[#fffaf0] ${
          technical ? "prompt-text leading-7" : "body-copy"
        }`}
      />
    </label>
  );
}

function ShotPreviewPanel({
  episodeNumber,
  shot,
  copied,
  onGenerateImage,
  onGenerateVideo,
  onRegeneratePrompts,
  onCopyImage,
  onCopyVideo,
}: {
  episodeNumber: number;
  shot: EditableShot;
  copied: string | null;
  onGenerateImage: () => void;
  onGenerateVideo: () => void;
  onRegeneratePrompts: () => void;
  onCopyImage: () => void;
  onCopyVideo: () => void;
}) {
  return (
    <aside className="right-preview">
      <Panel className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="section-kicker">VERTICAL PREVIEW</p>
            <h2 className="cn-title mt-2 text-lg">9:16 竖屏监看器</h2>
          </div>
          <Badge tone={shotTone(shot.status)}>{shot.status}</Badge>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-[#184b52] bg-[#173f47] p-2 shadow-sm">
          <div className="aspect-[9/16] rounded-lg bg-[radial-gradient(circle_at_30%_12%,rgba(242,140,106,.55),transparent_22%),linear-gradient(160deg,#173f47_0%,#6f8ca0_50%,#0d2d34_100%)] p-5 text-[#fff7ea]">
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="dark">EP {String(episodeNumber).padStart(2, "0")}</Badge>
                  <Badge tone="neutral">SHOT {String(shot.index).padStart(2, "0")}</Badge>
                </div>
                <h3 className="cn-title mt-5 text-2xl text-[#fff7ea]">{shot.scene}</h3>
                <p className="mt-3 text-sm leading-7 text-[#efe7d8]">{shot.action}</p>
              </div>
              <div className="rounded-lg border border-[#fff7ea]/15 bg-[#fff7ea]/10 p-4">
                <p className="section-kicker text-[#f7a083]">{previewStatusLabel(shot.status)}</p>
                <p className="prompt-text mt-3 text-[#fff7ea]">{shot.videoPrompt}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-2">
          <button type="button" onClick={onGenerateImage} className="tool-btn tool-btn-primary">
            {shot.status === "图片生成中" ? "图片生成中..." : "生成图片 →"}
          </button>
          <button type="button" onClick={onGenerateVideo} className="tool-btn">
            {shot.status === "视频生成中" ? "视频生成中..." : "生成视频"}
          </button>
          <button type="button" onClick={onRegeneratePrompts} className="tool-btn">
            {shot.status === "提示词生成中" ? "提示词生成中..." : "重新生成提示词"}
          </button>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <button type="button" onClick={onCopyImage} className="tool-btn">
              {copied === `${shot.id}-image` ? "已复制" : "复制图片提示词"}
            </button>
            <button type="button" onClick={onCopyVideo} className="tool-btn">
              {copied === `${shot.id}-video` ? "已复制" : "复制视频提示词"}
            </button>
          </div>
        </div>
      </Panel>
    </aside>
  );
}

function ShotTimeline({
  shots,
  selectedShotId,
  onSelect,
}: {
  shots: EditableShot[];
  selectedShotId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <Panel className="overflow-hidden">
      <div className="border-b border-[#184b52]/15 bg-[#fff7ea]/55 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="section-kicker">SHOT TIMELINE</p>
            <p className="body-copy mt-1">点击片段切换当前镜头。</p>
          </div>
          <p className="meta-text text-[#607880]">{shots.length} SHOTS</p>
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto bg-[#f8eddc]/45 p-3">
        {shots.map((shot) => {
          const active = shot.id === selectedShotId;
          return (
            <button
              key={shot.id}
              type="button"
              onClick={() => onSelect(shot.id)}
              className={`min-w-[190px] rounded-lg border bg-[#fffaf0] p-3 text-left transition hover:-translate-y-0.5 hover:border-[#f28c6a]/60 ${
                active ? "border-[#f28c6a] shadow-sm" : "border-[#184b52]/12"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm font-semibold tracking-[0.16em] text-[#f28c6a]">
                  SHOT {String(shot.index).padStart(2, "0")}
                </span>
                <span className={`h-2.5 w-2.5 rounded-full ${statusDot(shot.status)}`} />
              </div>
              <div className="mt-3 h-16 rounded-md border border-[#184b52]/12 bg-[linear-gradient(135deg,#173f47,#78919a,#f1c3a8)]" />
              <p className="meta-text mt-2">{shot.duration}</p>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#607880]">{shot.action}</p>
            </button>
          );
        })}
      </div>
    </Panel>
  );
}

function shotTone(status: EditableShot["status"]): BadgeTone {
  if (status.includes("生成中")) return "blue";
  if (status.includes("已生成") || status === "已生成") return "green";
  if (status === "失败") return "red";
  if (status === "提示词已生成") return "amber";
  return "neutral";
}

function statusDot(status: EditableShot["status"]) {
  if (status.includes("生成中")) return "bg-[#6f8ca0]";
  if (status.includes("已生成") || status === "已生成") return "bg-[#6f8f7d]";
  if (status === "失败") return "bg-[#a45348]";
  if (status === "提示词已生成") return "bg-[#f28c6a]";
  return "bg-[#c6b9a7]";
}

function previewStatusLabel(status: EditableShot["status"]) {
  if (status === "提示词生成中") return "PROMPT RENDERING";
  if (status === "提示词已生成") return "PROMPT READY";
  if (status === "图片生成中") return "MOCK IMAGE RENDERING";
  if (status === "图片已生成") return "MOCK IMAGE READY";
  if (status === "视频生成中") return "MOCK VIDEO RENDERING";
  if (status === "视频已生成") return "MOCK VIDEO READY";
  if (status === "失败") return "GENERATION FAILED";
  return "WAITING FOR GENERATION";
}

function deriveEpisodeProductionStatus(
  episodeStatus: string | undefined,
  shots: EditableShot[],
) {
  if (episodeStatus === "已完成" || shots.every((shot) => shot.status === "视频已生成")) {
    return "已完成";
  }
  if (shots.some((shot) => shot.status.includes("生成中"))) {
    return "生产中";
  }
  return episodeStatus ?? "分镜已生成";
}
