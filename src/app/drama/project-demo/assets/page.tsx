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
import type {
  AssetSource,
  AssetStatus,
  CharacterAsset,
  PropAsset,
  SceneAsset,
  StyleAsset,
} from "@/types/project";

type AssetTab = "角色" | "场景" | "道具" | "风格";

type CharacterState = CharacterAsset & {
  source: AssetSource;
  status: AssetStatus;
  imageState: "ai" | "local" | "library" | "missing";
};

type SceneState = SceneAsset & {
  status: AssetStatus;
  imageState: "ai" | "local" | "library";
};

const tabs: AssetTab[] = ["角色", "场景", "道具", "风格"];

const fallbackLibrary = {
  characters: [
    {
      id: "fallback-char-01",
      name: "雨夜女主档案",
      prompt: "library character portrait, rain noir heroine, sharp eyes, black trench coat",
    },
    {
      id: "fallback-char-02",
      name: "克制投资人档案",
      prompt: "library character portrait, restrained investor, charcoal suit, premium office",
    },
    {
      id: "fallback-char-03",
      name: "甜美反派档案",
      prompt: "library character portrait, ivory knit suit, pearl earrings, ambiguous smile",
    },
  ],
  scenes: [
    {
      id: "fallback-scene-01",
      name: "雨夜会议室",
      prompt: "library scene, glass boardroom, rainy city reflections, projection screen glow",
    },
    {
      id: "fallback-scene-02",
      name: "地下车库",
      prompt: "library scene, underground parking exit, wet concrete, cinematic headlights",
    },
    {
      id: "fallback-scene-03",
      name: "高层办公室",
      prompt: "library scene, executive office at night, muted wood, skyline, suspense lighting",
    },
  ],
};

export default function AssetsPage() {
  const [activeTab, setActiveTab] = useState<AssetTab>("角色");
  const [expandedCharacterId, setExpandedCharacterId] = useState<string | null>(null);
  const [expandedSceneId, setExpandedSceneId] = useState<string | null>(null);
  const [libraryPicker, setLibraryPicker] = useState<
    | { kind: "character"; id: string }
    | { kind: "scene"; id: string }
    | null
  >(null);
  const {
    project,
    saveStatus,
    updateCharacter,
    updateScene,
    setCharacterStatus,
    setSceneStatus,
    resetProject,
  } = useProjectStore();

  const characters: CharacterState[] = project.characters.map((character) => ({
    ...character,
    source: character.source ?? "AI 生成",
    status: character.status ?? "待确认",
    imageState:
      character.status === "缺少设定图"
        ? "missing"
        : character.source === "本地上传"
          ? "local"
          : character.source === "资产库引用" || character.source === "从资产库引用"
            ? "library"
            : "ai",
  }));

  const scenes: SceneState[] = (project.scenes ?? []).map((scene) => ({
    ...scene,
    status: scene.status ?? "待确认",
    imageState:
      scene.source === "本地上传"
        ? "local"
        : scene.source === "资产库引用" || scene.source === "从资产库引用"
          ? "library"
          : "ai",
  }));

  const primaryAssetsReady =
    characters
      .slice(0, 2)
      .some((character) => character.status === "已编辑" || character.status === "已锁定") &&
    scenes
      .slice(0, 2)
      .some((scene) => scene.status === "已编辑" || scene.status === "已锁定");

  function chooseLibraryAsset(prompt: string) {
    if (!libraryPicker) return;
    if (libraryPicker.kind === "character") {
      updateCharacter(libraryPicker.id, {
        portraitPrompt: prompt,
        source: "资产库引用",
        status: "已编辑",
        imageStatus: "已生成",
      });
      setExpandedCharacterId(libraryPicker.id);
    } else {
      updateScene(libraryPicker.id, {
        visualPrompt: prompt,
        source: "资产库引用",
        status: "已编辑",
        imageStatus: "已生成",
      });
      setExpandedSceneId(libraryPicker.id);
    }
    setLibraryPicker(null);
  }

  function generateCharacterImage(character: CharacterState) {
    updateCharacter(character.id, {
      source: "AI 生成",
      status: "生成中",
      imageStatus: "生成中",
    });
    window.setTimeout(() => {
      updateCharacter(character.id, {
        portraitPrompt: `${character.portraitPrompt ?? character.costumePrompt}, generated character key visual`,
        source: "AI 生成",
        status: "待确认",
        imageStatus: "已生成",
      });
      setExpandedCharacterId(character.id);
    }, 1500);
  }

  function generateSceneImage(scene: SceneState) {
    updateScene(scene.id, {
      source: "AI 生成",
      status: "生成中",
      imageStatus: "生成中",
    });
    window.setTimeout(() => {
      updateScene(scene.id, {
        visualPrompt: `${scene.visualPrompt}, generated environment key visual`,
        source: "AI 生成",
        status: "待确认",
        imageStatus: "已生成",
      });
      setExpandedSceneId(scene.id);
    }, 1500);
  }

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl space-y-5 px-5 py-5">
        <PageHeader
          title="角色与场景确认"
          description="确认 AI 从剧本中拆解出的角色、场景、道具与风格资产，之后用于分集与分镜生成。"
          currentStep={2}
        />
        <DraftStatus saveStatus={saveStatus} onReset={resetProject} />

        <Panel className="p-3">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`echo-tab ${activeTab === tab ? "echo-tab-active" : ""}`}
              >
                <span className="mr-2 font-mono text-[#f28c6a]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {tab}
              </button>
            ))}
          </div>
        </Panel>

        {activeTab === "角色" ? (
          <AssetListShell
            kicker="CHARACTER ASSETS"
            title="当前项目角色确认列表"
            description="逐项确认角色设定图、人物定位和视觉提示词。点击编辑展开字段，锁定后进入分集与分镜引用。"
          >
            {characters.map((character, index) => (
              <CharacterAssetRow
                key={character.id}
                character={character}
                index={index}
                expanded={expandedCharacterId === character.id}
                onToggle={() =>
                  setExpandedCharacterId((current) =>
                    current === character.id ? null : character.id,
                  )
                }
                onUpdate={(patch) => updateCharacter(character.id, patch)}
                onGenerateImage={() => generateCharacterImage(character)}
                onLocalUpload={() => {
                  updateCharacter(character.id, {
                    source: "本地上传",
                    status: "已编辑",
                    imageStatus: "已生成",
                  });
                  setExpandedCharacterId(character.id);
                }}
                onPickLibrary={() => setLibraryPicker({ kind: "character", id: character.id })}
                onLock={() => setCharacterStatus(character.id, "已锁定")}
              />
            ))}
          </AssetListShell>
        ) : null}

        {activeTab === "场景" ? (
          <AssetListShell
            kicker="SCENE ASSETS"
            title="当前项目场景确认列表"
            description="确认剧本拆解出的核心空间，后续镜头会引用这里的视觉提示词和场景图状态。"
          >
            {scenes.map((scene, index) => (
              <SceneAssetRow
                key={scene.id}
                scene={scene}
                index={index}
                expanded={expandedSceneId === scene.id}
                onToggle={() =>
                  setExpandedSceneId((current) =>
                    current === scene.id ? null : scene.id,
                  )
                }
                onUpdate={(patch) => updateScene(scene.id, patch)}
                onGenerateImage={() => generateSceneImage(scene)}
                onLocalUpload={() => {
                  updateScene(scene.id, {
                    source: "本地上传",
                    status: "已编辑",
                    imageStatus: "已生成",
                  });
                  setExpandedSceneId(scene.id);
                }}
                onPickLibrary={() => setLibraryPicker({ kind: "scene", id: scene.id })}
                onLock={() => setSceneStatus(scene.id, "已锁定")}
              />
            ))}
          </AssetListShell>
        ) : null}

        {activeTab === "道具" ? (
          <CompactMockGrid
            kicker="PROP ASSETS"
            items={project.props ?? []}
            renderMeta={(prop) => prop.source}
          />
        ) : null}

        {activeTab === "风格" ? (
          <CompactMockGrid
            kicker="STYLE TEMPLATES"
            items={project.styles ?? []}
            renderMeta={(style) => style.status}
          />
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Link href="/one-click/new" className="tool-btn">
            返回上一步
          </Link>
          <Link
            href="/one-click/project-demo/episodes"
            className={`tool-btn ${primaryAssetsReady ? "tool-btn-primary" : ""}`}
          >
            确认角色与场景，生成分集 →
          </Link>
        </div>

        {libraryPicker ? (
          <AssetPickerModal
            kind={libraryPicker.kind}
            assets={
              libraryPicker.kind === "character"
                ? [
                    ...(project.assetLibrary?.characters ?? []),
                    ...fallbackLibrary.characters,
                  ].slice(0, 3)
                : [
                    ...(project.assetLibrary?.scenes ?? []),
                    ...fallbackLibrary.scenes,
                  ].slice(0, 3)
            }
            onChoose={chooseLibraryAsset}
            onClose={() => setLibraryPicker(null)}
          />
        ) : null}
      </div>
    </AppShell>
  );
}

function AssetListShell({
  kicker,
  title,
  description,
  children,
}: {
  kicker: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Panel className="overflow-hidden">
      <div className="border-b border-[#184b52]/15 bg-[#fff7ea]/55 px-4 py-4">
        <p className="section-kicker">{kicker}</p>
        <div className="mt-2 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="cn-title text-xl">{title}</h2>
            <p className="body-copy mt-1 max-w-3xl">{description}</p>
          </div>
          <p className="meta-text text-[#607880]">PROJECT TEMPORARY ASSETS</p>
        </div>
      </div>
      <div className="divide-y divide-[#184b52]/12">{children}</div>
    </Panel>
  );
}

function CharacterAssetRow({
  character,
  index,
  expanded,
  onToggle,
  onUpdate,
  onGenerateImage,
  onLocalUpload,
  onPickLibrary,
  onLock,
}: {
  character: CharacterState;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onUpdate: (patch: Partial<CharacterAsset>) => void;
  onGenerateImage: () => void;
  onLocalUpload: () => void;
  onPickLibrary: () => void;
  onLock: () => void;
}) {
  const prompt = character.portraitPrompt ?? character.costumePrompt;
  return (
    <div className={`bg-[#fffaf0]/70 transition ${character.status === "已锁定" ? "bg-[#f5f0df]" : ""}`}>
      <div className="grid gap-4 px-4 py-4 lg:grid-cols-[96px_minmax(0,1fr)_auto] lg:items-center">
        <Thumbnail
          label={assetImageLabel(character.name, character.imageState, character.imageStatus)}
          variant={character.imageState === "local" ? "green" : "blue"}
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f28c6a]">
              CHAR {String(index + 1).padStart(2, "0")}
            </span>
            <Badge tone={statusTone(character.status)}>{character.status}</Badge>
            <Badge tone="neutral">{character.source}</Badge>
          </div>
          <div className="mt-2 flex flex-col gap-1 md:flex-row md:items-baseline md:gap-3">
            <h3 className="cn-title text-lg">{character.name}</h3>
            <p className="meta-text text-[#607880]">
              {character.role} · {character.age} 岁
            </p>
          </div>
          <p className="body-copy mt-2 line-clamp-2">
            {character.motivation || character.archetype}
          </p>
        </div>
        <RowActions
          generating={character.status === "生成中" || character.imageStatus === "生成中"}
          generateLabel="AI 生成设定图"
          editLabel={expanded ? "收起" : "编辑"}
          onGenerate={onGenerateImage}
          onLocalUpload={onLocalUpload}
          onPickLibrary={onPickLibrary}
          onToggle={onToggle}
          onLock={onLock}
        />
      </div>

      {expanded ? (
        <div className="border-t border-[#184b52]/12 bg-[#f8eddc]/45 px-4 py-5">
          <div className="grid gap-3 lg:grid-cols-3">
            <EditableField
              label="NAME"
              value={character.name}
              onChange={(value) => onUpdate({ name: value, status: "已编辑" })}
            />
            <EditableField
              label="ROLE"
              value={character.role}
              onChange={(value) => onUpdate({ role: value, status: "已编辑" })}
            />
            <EditableField
              label="AGE"
              value={character.age}
              onChange={(value) => onUpdate({ age: value, status: "已编辑" })}
            />
            <EditableField
              label="PERSONALITY"
              value={character.archetype}
              onChange={(value) => onUpdate({ archetype: value, status: "已编辑" })}
            />
            <EditableField
              label="LOOK"
              value={character.visualStyle}
              multiline
              className="lg:col-span-2"
              onChange={(value) => onUpdate({ visualStyle: value, status: "已编辑" })}
            />
            <PromptScriptCard
              value={prompt}
              onChange={(value) => onUpdate({ portraitPrompt: value, status: "已编辑" })}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SceneAssetRow({
  scene,
  index,
  expanded,
  onToggle,
  onUpdate,
  onGenerateImage,
  onLocalUpload,
  onPickLibrary,
  onLock,
}: {
  scene: SceneState;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onUpdate: (patch: Partial<SceneAsset>) => void;
  onGenerateImage: () => void;
  onLocalUpload: () => void;
  onPickLibrary: () => void;
  onLock: () => void;
}) {
  return (
    <div className={`bg-[#fffaf0]/70 transition ${scene.status === "已锁定" ? "bg-[#f5f0df]" : ""}`}>
      <div className="grid gap-4 px-4 py-4 lg:grid-cols-[96px_minmax(0,1fr)_auto] lg:items-center">
        <Thumbnail
          label={assetImageLabel(scene.name, scene.imageState, scene.imageStatus)}
          variant={scene.imageState === "local" ? "green" : "slate"}
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f28c6a]">
              SCENE {String(index + 1).padStart(2, "0")}
            </span>
            <Badge tone={statusTone(scene.status)}>{scene.status}</Badge>
            <Badge tone="neutral">{scene.source}</Badge>
          </div>
          <h3 className="cn-title mt-2 text-lg">{scene.name}</h3>
          <p className="body-copy mt-2 line-clamp-2">{scene.description}</p>
        </div>
        <RowActions
          generating={scene.status === "生成中" || scene.imageStatus === "生成中"}
          generateLabel="AI 生成场景图"
          editLabel={expanded ? "收起" : "编辑"}
          onGenerate={onGenerateImage}
          onLocalUpload={onLocalUpload}
          onPickLibrary={onPickLibrary}
          onToggle={onToggle}
          onLock={onLock}
        />
      </div>

      {expanded ? (
        <div className="border-t border-[#184b52]/12 bg-[#f8eddc]/45 px-4 py-5">
          <div className="grid gap-3 lg:grid-cols-2">
            <EditableField
              label="SCENE NAME"
              value={scene.name}
              onChange={(value) => onUpdate({ name: value, status: "已编辑" })}
            />
            <EditableField
              label="DESCRIPTION"
              value={scene.description}
              multiline
              onChange={(value) => onUpdate({ description: value, status: "已编辑" })}
            />
            <PromptScriptCard
              value={scene.visualPrompt}
              onChange={(value) => onUpdate({ visualPrompt: value, status: "已编辑" })}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function RowActions({
  generating,
  generateLabel,
  editLabel,
  onGenerate,
  onLocalUpload,
  onPickLibrary,
  onToggle,
  onLock,
}: {
  generating: boolean;
  generateLabel: string;
  editLabel: string;
  onGenerate: () => void;
  onLocalUpload: () => void;
  onPickLibrary: () => void;
  onToggle: () => void;
  onLock: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 lg:max-w-[360px] lg:justify-end">
      <AssetButton primary onClick={onGenerate}>
        {generating ? "生成中..." : generateLabel}
      </AssetButton>
      <AssetButton onClick={onLocalUpload}>本地上传</AssetButton>
      <AssetButton onClick={onPickLibrary}>从资产库引用</AssetButton>
      <AssetButton onClick={onToggle}>{editLabel}</AssetButton>
      <AssetButton onClick={onLock}>锁定</AssetButton>
    </div>
  );
}

function Thumbnail({
  label,
  variant,
}: {
  label: string;
  variant: "blue" | "green" | "amber" | "slate";
}) {
  return (
    <div className="w-24 rounded-lg border border-[#184b52]/15 bg-[#fff7ea] p-2 shadow-sm">
      <AssetPlaceholder label={label} variant={variant} />
    </div>
  );
}

function EditableField({
  label,
  value,
  onChange,
  multiline = false,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  className?: string;
}) {
  return (
    <label className={`block rounded-md border border-[#184b52]/12 bg-[#fff7ea]/70 px-3 py-2 ${className}`}>
      <span className="meta-text">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="body-copy mt-1 min-h-20 w-full resize-none rounded-md border border-transparent bg-transparent p-0 outline-none focus:border-[#f28c6a]/50 focus:bg-[#fff7ea]/80"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="body-copy mt-1 h-8 w-full rounded-md border border-transparent bg-transparent p-0 outline-none focus:border-[#f28c6a]/50 focus:bg-[#fff7ea]/80"
        />
      )}
    </label>
  );
}

function PromptScriptCard({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-lg border border-[#184b52]/18 bg-[#fff7ea] p-3 shadow-sm lg:col-span-full">
      <span className="section-kicker">VISUAL PROMPT</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="prompt-text mt-3 min-h-28 w-full resize-y rounded-md border border-[#184b52]/12 bg-[#f9efdf] p-3 leading-7 text-[#173f47] outline-none transition focus:border-[#f28c6a]/70 focus:bg-[#fffaf0]"
      />
    </label>
  );
}

function CompactMockGrid<T extends PropAsset | StyleAsset>({
  kicker,
  items,
  renderMeta,
}: {
  kicker: string;
  items: T[];
  renderMeta: (item: T) => string;
}) {
  return (
    <Panel className="p-4">
      <p className="section-kicker">{kicker}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="rounded-lg border border-[#184b52]/12 bg-[#fffaf0]/70 p-4 transition hover:-translate-y-0.5 hover:border-[#f28c6a]/45"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="font-mono text-xl font-semibold tracking-[0.14em] text-[#f28c6a]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <Badge tone="neutral">{renderMeta(item)}</Badge>
            </div>
            <h3 className="cn-title mt-3 text-lg">{item.name}</h3>
            <p className="body-copy mt-2">{item.description}</p>
            <p className="prompt-text mt-3 rounded-md border border-[#184b52]/12 bg-[#f9efdf] p-3">
              {item.visualPrompt}
            </p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function AssetPickerModal({
  kind,
  assets,
  onChoose,
  onClose,
}: {
  kind: "character" | "scene";
  assets: Array<{ id: string; name: string; prompt: string }>;
  onChoose: (prompt: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#173f47]/35 p-4">
      <Panel className="w-full max-w-2xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-kicker">ASSET LIBRARY REFERENCE</p>
            <h2 className="cn-title mt-2 text-xl">
              {kind === "character" ? "选择角色资产" : "选择场景资产"}
            </h2>
            <p className="body-copy mt-1">
              当前为 mock 选择面板，选择后会写入本地草稿并关闭弹窗。
            </p>
          </div>
          <button type="button" onClick={onClose} className="tool-btn">
            关闭
          </button>
        </div>
        <div className="mt-5 grid gap-3">
          {assets.map((asset, index) => (
            <button
              key={asset.id}
              type="button"
              onClick={() => onChoose(asset.prompt)}
              className="rounded-lg border border-[#184b52]/12 bg-[#fffaf0] p-4 text-left transition hover:-translate-y-0.5 hover:border-[#f28c6a]/60 hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-lg font-semibold tracking-[0.14em] text-[#f28c6a]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="cn-title text-base">{asset.name}</p>
              </div>
              <p className="prompt-text mt-3 rounded-md border border-[#184b52]/12 bg-[#f9efdf] p-3">
                {asset.prompt}
              </p>
            </button>
          ))}
        </div>
      </Panel>
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

function statusTone(status: AssetStatus): "neutral" | "blue" | "green" | "amber" | "red" {
  if (status === "已锁定") return "green";
  if (status === "生成中") return "blue";
  if (status === "缺少设定图") return "red";
  if (status === "已编辑") return "amber";
  return "neutral";
}

function assetImageLabel(
  name: string,
  imageState: "ai" | "local" | "library" | "missing",
  imageStatus?: "未生成" | "生成中" | "已生成" | "失败",
) {
  if (imageStatus === "生成中") return "生成中...";
  if (imageStatus === "已生成" && imageState === "local") return "本地上传";
  if (imageStatus === "已生成" && imageState === "library") return "资产库引用";
  if (imageStatus === "已生成") return "Mock 设定图";
  if (imageState === "missing") return "缺少设定图";
  if (imageState === "local") return "本地上传";
  if (imageState === "library") return "资产库引用";
  return name;
}
