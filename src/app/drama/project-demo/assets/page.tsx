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
        <PageHeader
          title="角色与场景确认"
          description="确认当前剧本被 AI 拆解出的临时资产。这里不是完整资产库，只服务本次一键直出。"
          currentStep={2}
        />

        <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
          {(["角色", "场景", "道具", "风格"] as AssetTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`h-9 rounded-md px-4 text-sm font-semibold transition ${
                activeTab === tab
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "角色" ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {characters.map((character) => (
              <Panel key={character.id} className="p-4">
                <div className="grid gap-4 md:grid-cols-[180px_1fr]">
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
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-semibold text-slate-950">
                        {character.name}
                      </h2>
                      <Badge tone="neutral">{character.role}</Badge>
                      <Badge tone={character.status === "已锁定" ? "green" : "amber"}>
                        {character.status}
                      </Badge>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
                      <p className="text-slate-600">年龄：{character.age}</p>
                      <p className="text-slate-600">性格：{character.archetype}</p>
                      <p className="text-slate-600 md:col-span-2">
                        外貌：{character.visualStyle}
                      </p>
                      <p className="text-slate-600 md:col-span-2">
                        来源：{character.source}
                      </p>
                    </div>
                    <textarea
                      value={character.portraitPrompt ?? character.costumePrompt}
                      onChange={(event) =>
                        updateCharacter(character.id, {
                          portraitPrompt: event.target.value,
                          status: "已编辑",
                        })
                      }
                      className="mt-3 min-h-20 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-700 outline-none focus:border-sky-300 focus:bg-white"
                    />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <AssetButton onClick={() => updateCharacter(character.id, { source: "AI 生成", status: "已编辑", imageState: "ai" })}>AI 生成设定图</AssetButton>
                  <AssetButton onClick={() => updateCharacter(character.id, { source: "本地上传", status: "已编辑", imageState: "local" })}>从本地上传</AssetButton>
                  <AssetButton onClick={() => setLibraryPicker({ kind: "character", id: character.id })}>从资产库引用</AssetButton>
                  <AssetButton onClick={() => updateCharacter(character.id, { status: "已编辑" })}>编辑文字设定</AssetButton>
                  <AssetButton onClick={() => updateCharacter(character.id, { source: "AI 生成", status: "已编辑", imageState: "ai" })}>重新生成</AssetButton>
                  <AssetButton onClick={() => updateCharacter(character.id, { status: "已锁定" })}>锁定角色</AssetButton>
                </div>
              </Panel>
            ))}
          </div>
        ) : null}

        {activeTab === "场景" ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {scenes.map((scene) => (
              <Panel key={scene.id} className="p-4">
                <div className="grid gap-4 md:grid-cols-[180px_1fr]">
                  <AssetPlaceholder
                    label={scene.imageState === "local" ? "本地场景图" : scene.imageState === "library" ? "资产库场景" : scene.name}
                    variant={scene.imageState === "local" ? "green" : "slate"}
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-semibold text-slate-950">{scene.name}</h2>
                      <Badge tone="neutral">{scene.source}</Badge>
                      <Badge tone={scene.status === "已锁定" ? "green" : "amber"}>
                        {scene.status}
                      </Badge>
                    </div>
                    <textarea
                      value={scene.description}
                      onChange={(event) => updateScene(scene.id, { description: event.target.value, status: "已编辑" })}
                      className="mt-3 min-h-20 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700 outline-none focus:border-sky-300 focus:bg-white"
                    />
                    <textarea
                      value={scene.visualPrompt}
                      onChange={(event) => updateScene(scene.id, { visualPrompt: event.target.value, status: "已编辑" })}
                      className="mt-3 min-h-20 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-700 outline-none focus:border-sky-300 focus:bg-white"
                    />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
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
            className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            返回剧本大纲
          </Link>
          <Link
            href="/one-click/project-demo/episodes"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            确认角色与场景，生成分集
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

function AssetButton({
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
