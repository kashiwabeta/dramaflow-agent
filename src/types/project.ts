export type CharacterAsset = {
  id: string;
  name: string;
  role: string;
  age: string;
  archetype: string;
  visualStyle: string;
  motivation: string;
  costumePrompt: string;
  portraitPrompt?: string;
  source?: AssetSource;
  status?: AssetStatus;
  imageStatus?: MockGenerationStatus;
};

export type AssetSource = "AI 生成" | "本地上传" | "资产库引用" | "从资产库引用" | "角色资产库" | "场景资产库";

export type AssetStatus = "待确认" | "生成中" | "已编辑" | "已锁定" | "缺少设定图";

export type MockGenerationStatus = "未生成" | "生成中" | "已生成" | "失败";

export type SceneAsset = {
  id: string;
  name: string;
  description: string;
  visualPrompt: string;
  source: AssetSource;
  status: AssetStatus;
  imageStatus?: MockGenerationStatus;
};

export type PropAsset = {
  id: string;
  name: string;
  description: string;
  visualPrompt: string;
  source: AssetSource;
  status: AssetStatus;
};

export type StyleAsset = {
  id: string;
  name: string;
  description: string;
  visualPrompt: string;
  status: AssetStatus;
};

export type Shot = {
  id: string;
  index: number;
  duration: string;
  camera: string;
  scene: string;
  action: string;
  dialogue: string;
  imagePrompt: string;
  videoPrompt: string;
  characterIds?: string[];
  sceneId?: string;
  status?: "未生成" | "生成中" | "已生成" | "失败" | "图片生成中" | "图片已生成" | "视频生成中" | "视频已生成";
};

export type Episode = {
  id: string;
  episodeNumber: number;
  title: string;
  hook: string;
  synopsis: string;
  conflict: string;
  estimatedDuration: string;
  sceneCount?: number;
  estimatedShotCount?: number;
  status?: "待生成分镜" | "分镜生成中" | "分镜已生成" | "部分待修改" | "已完成";
  shots: Shot[];
};

export type AiGenerationResult = {
  project: {
    title: string;
    genre: string;
    logline: string;
    tone: string;
    audience: string;
    status: string;
  };
  outline?: {
    summary: string;
    genre: string;
    mainConflict: string;
    relationships: string;
    episodeSuggestions: string[];
  };
  oneClick?: {
    analysisStatus: "idle" | "analyzing" | "done";
    analysisStep: 0 | 1 | 2 | 3;
  };
  input: {
    theme: string;
    requirement: string;
    format: string;
  };
  characters: CharacterAsset[];
  scenes?: SceneAsset[];
  props?: PropAsset[];
  styles?: StyleAsset[];
  assetLibrary?: {
    characters: Array<{
      id: string;
      name: string;
      prompt: string;
    }>;
    scenes: Array<{
      id: string;
      name: string;
      prompt: string;
    }>;
  };
  episodes: Episode[];
  preview: {
    selectedEpisodeId: string;
    selectedShotId: string;
    imagePrompt: string;
    videoPrompt: string;
    productionNotes: string[];
  };
};
