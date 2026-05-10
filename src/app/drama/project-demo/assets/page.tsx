"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AppShell,
  AssetPlaceholder,
  Badge,
  Panel,
} from "@/components/workspace";
import mockProject from "@/data/mock-project.json";
import type {
  AiGenerationResult,
  AssetSource,
  AssetStatus,
  CharacterAsset,
  SceneAsset,
} from "@/types/project";

const data = mockProject as AiGenerationResult;
type AssetTab = "角色" | "场景" | "道具" | "风格";

type CharacterState = CharacterAsset & {
  source: AssetSource;
  status: AssetStatus;
  imageState: "ai" | "local" | "library" | "missing";
};

type SceneState = SceneAsset & {
  imageState: "ai" | "local" | "library";
};

export default function AssetsPage() {
  const [activeTab, setActiveTab] = useState<AssetTab>("角色");
  const [characters, setCharacters] = useState<CharacterState[]>(
    data.characters.map((character) => ({
      ...character,
      source: character.source ?? "AI 生成",
      status: character.status ?? "待确认",
      imageState: character.status === "缺少设定图" ? "missing" : "ai",
    })),
  );
  const [scenes, setScenes] = useState<SceneState[]>(
    (data.scenes ?? []).map((scene) => ({ ...scene, imageState: "ai" })),
  );
  const [libraryPicker, setLibraryPicker] = useState<
    | { kind: "character"; id: string }
    | { kind: "scene"; id: string }
    | null
  >(null);

  function updateCharacter(id: string, patch: Partial<CharacterState>) {
    setCharacters((current) =>
      current.map((character) =>
        character.id === id ? { ...character, ...patch } : character,
      ),
    );
  }

  function updateScene(id: string, patch: Partial<SceneState>) {
    setScenes((current) =>
      current.map((scene) => (scene.id === id ? { ...scene, ...patch } : scene)),
    );
  }

  function chooseLibraryAsset(prompt: string) {
    if (!libraryPicker) return;
    if (libraryPicker.kind === "character") {
      updateCharacter(libraryPicker.id, {
        portraitPrompt: prompt,
        source: "从资产库引用",
        status: "已编辑",
        imageState: "library",
      });
    } else {
      updateScene(libraryPicker.id, {
        visualPrompt: prompt,
        source: "从资产库引用",
        status: "已编辑",
        imageState: "library",
      });
    }
    setLibraryPicker(null);
  }

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl space-y-5 px-5 py-5">
        <section className="paper-card rounded-lg border px-5 py-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <p className="section-kicker">DRAMAFLOW AGENT</p>
              <p className="meta-text mt-4 text-[#f28c6a]">02 CHARACTER / SCENE</p>
              <h1 className="cn-title mt-2">角色与场景确认</h1>
              <p className="body-copy mt-2 max-w-3xl">
                确认当前剧本被 AI 拆解出的临时资产。这里不是完整资产库，只服务本次一键直出。
              </p>
            </div>
            <div className="border-t border-[#184b52]/20 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <p className="section-kicker">TEMPORARY ASSETS</p>
              <p className="body-copy mt-2">
                角色、场景、道具和风格会在确认后进入分集视频生成链路。
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap gap-2">
          {(["角色", "场景", "道具", "风格"] as AssetTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`echo-tab ${activeTab === tab ? "echo-tab-active" : ""}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "角色" ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {characters.map((character, index) => (
              <CharacterCard
                key={character.id}
                character={character}
                index={index}
                onUpdate={(patch) => updateCharacter(character.id, patch)}
                onPickLibrary={() => setLibraryPicker({ kind: "character", id: character.id })}
              />
            ))}
          </div>
        ) : null}

        {activeTab === "场景" ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {scenes.map((scene) => (
              <Panel key={scene.id} className="p-5">
                <div className="grid gap-5 md:grid-cols-[180px_1fr]">
                  <AssetPlaceholder
                    label={scene.imageState === "local" ? "本地场景图" : scene.imageState === "library" ? "资产库场景" : scene.name}
                    variant={scene.imageState === "local" ? "green" : "slate"}
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="cn-title text-lg">{scene.name}</h2>
                      <Badge tone="neutral">{scene.source}</Badge>
                      <Badge tone={scene.status === "已锁定" ? "green" : "amber"}>
                        {scene.status}
                      </Badge>
                    </div>
                    <textarea
                      value={scene.description}
                      onChange={(event) => updateScene(scene.id, { description: event.target.value, status: "已编辑" })}
                      className="body-copy mt-3 min-h-20 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 outline-none focus:border-sky-300 focus:bg-white"
                    />
                    <p className="section-kicker mt-3">VISUAL PROMPT</p>
                    <textarea
                      value={scene.visualPrompt}
                      onChange={(event) => updateScene(scene.id, { visualPrompt: event.target.value, status: "已编辑" })}
                      className="prompt-text prompt-box mt-2 min-h-24 w-full rounded-lg p-3 outline-none"
                    />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-[#184b52]/15 pt-4">
                  <AssetButton onClick={() => updateScene(scene.id, { source: "AI 生成", status: "已编辑", imageState: "ai" })}>AI 生成场景图</AssetButton>
                  <AssetButton onClick={() => updateScene(scene.id, { source: "本地上传", status: "已编辑", imageState: "local" })}>本地上传</AssetButton>
                  <AssetButton onClick={() => setLibraryPicker({ kind: "scene", id: scene.id })}>从资产库引用</AssetButton>
                  <AssetButton onClick={() => updateScene(scene.id, { status: "已编辑" })}>编辑</AssetButton>
                  <AssetButton onClick={() => updateScene(scene.id, { status: "已锁定" })}>锁定</AssetButton>
                </div>
              </Panel>
            ))}
          </div>
        ) : null}

        {activeTab === "道具" ? (
          <div className="grid gap-4 md:grid-cols-2">
            {(data.props ?? []).map((prop) => (
              <Panel key={prop.id} className="p-4">
                <AssetPlaceholder label={prop.name} variant="amber" />
                <h2 className="mt-4 text-base font-semibold text-slate-950">{prop.name}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{prop.description}</p>
                <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                  {prop.visualPrompt}
                </p>
              </Panel>
            ))}
          </div>
        ) : null}

        {activeTab === "风格" ? (
          <div className="grid gap-4 md:grid-cols-2">
            {(data.styles ?? []).map((style) => (
              <Panel key={style.id} className="p-4">
                <AssetPlaceholder label={style.name} variant="slate" />
                <h2 className="mt-4 text-base font-semibold text-slate-950">{style.name}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{style.description}</p>
                <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                  {style.visualPrompt}
                </p>
              </Panel>
            ))}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Link
            href="/one-click/new"
            className="tool-btn"
          >
            返回剧本大纲
          </Link>
          <Link
            href="/one-click/project-demo/episodes"
            className="tool-btn tool-btn-primary"
          >
            确认角色与场景，生成分集 →
          </Link>
        </div>

        {libraryPicker ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4">
            <Panel className="w-full max-w-xl p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-950">选择资产库素材</h2>
                <button
                  type="button"
                  onClick={() => setLibraryPicker(null)}
                  className="text-sm font-semibold text-slate-500 hover:text-slate-900"
                >
                  关闭
                </button>
              </div>
              <div className="mt-4 grid gap-3">
                {(libraryPicker.kind === "character"
                  ? data.assetLibrary?.characters
                  : data.assetLibrary?.scenes
                )?.map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => chooseLibraryAsset(asset.prompt)}
                    className="rounded-lg border border-slate-200 bg-white p-4 text-left transition hover:border-sky-200 hover:bg-slate-50"
                  >
                    <p className="text-sm font-semibold text-slate-950">{asset.name}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{asset.prompt}</p>
                  </button>
                ))}
              </div>
            </Panel>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}

function CharacterCard({
  character,
  index,
  onUpdate,
  onPickLibrary,
}: {
  character: CharacterState;
  index: number;
  onUpdate: (patch: Partial<CharacterState>) => void;
  onPickLibrary: () => void;
}) {
  return (
    <Panel className="p-5">
      <div className="grid gap-5 md:grid-cols-[190px_1fr]">
        <div>
          <div className="rounded-lg border border-[#184b52]/15 bg-[#fff7ea] p-3 shadow-sm">
            <AssetPlaceholder
              label={
                character.imageState === "missing"
                  ? "缺少设定图"
                  : character.imageState === "local"
                    ? "本地图片"
                    : character.imageState === "library"
                      ? "资产库图"
                      : character.name
              }
              variant={character.imageState === "local" ? "green" : "blue"}
            />
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-[#184b52]/20 pt-3">
            <span className="font-mono text-3xl font-semibold tracking-[0.14em] text-[#f28c6a]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="section-kicker text-[#607880]">CHARACTER FILE</span>
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="cn-title text-xl">{character.name}</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge tone="neutral">{character.role}</Badge>
                <Badge tone={character.status === "已锁定" ? "green" : "amber"}>
                  {character.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-2 md:grid-cols-2">
            <MetaItem label="AGE" value={character.age} />
            <MetaItem label="PERSONALITY" value={character.archetype} />
            <MetaItem label="SOURCE" value={character.source} />
            <MetaItem label="LOOK" value={character.visualStyle} wide />
          </div>

          <div className="mt-4">
            <p className="section-kicker">VISUAL PROMPT</p>
            <textarea
              value={character.portraitPrompt ?? character.costumePrompt}
              onChange={(event) =>
                onUpdate({
                  portraitPrompt: event.target.value,
                  status: "已编辑",
                })
              }
              className="prompt-text prompt-box mt-2 min-h-28 w-full rounded-lg p-3 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-[#184b52]/15 pt-4">
        <AssetButton primary onClick={() => onUpdate({ source: "AI 生成", status: "已编辑", imageState: "ai" })}>AI 生成设定图</AssetButton>
        <AssetButton onClick={() => onUpdate({ source: "本地上传", status: "已编辑", imageState: "local" })}>从本地上传</AssetButton>
        <AssetButton onClick={onPickLibrary}>从资产库引用</AssetButton>
        <AssetButton onClick={() => onUpdate({ status: "已编辑" })}>编辑文字设定</AssetButton>
        <AssetButton onClick={() => onUpdate({ source: "AI 生成", status: "已编辑", imageState: "ai" })}>重新生成</AssetButton>
        <AssetButton onClick={() => onUpdate({ status: "已锁定" })}>锁定角色</AssetButton>
      </div>
    </Panel>
  );
}

function MetaItem({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={`rounded-md border border-[#184b52]/12 bg-[#fff7ea]/45 px-3 py-2 ${wide ? "md:col-span-2" : ""}`}>
      <p className="meta-text">{label}</p>
      <p className="body-copy mt-1 text-sm leading-6">{value}</p>
    </div>
  );
}

function AssetButton({
  children,
  onClick,
  primary = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`tool-btn ${primary ? "tool-btn-primary" : ""}`}
    >
      {children}
    </button>
  );
}
