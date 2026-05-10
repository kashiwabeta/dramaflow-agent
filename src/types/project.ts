export type CharacterAsset = {
  id: string;
  name: string;
  role: string;
  age: string;
  archetype: string;
  visualStyle: string;
  motivation: string;
  costumePrompt: string;
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
};

export type Episode = {
  id: string;
  episodeNumber: number;
  title: string;
  hook: string;
  synopsis: string;
  conflict: string;
  estimatedDuration: string;
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
  input: {
    theme: string;
    requirement: string;
    format: string;
  };
  characters: CharacterAsset[];
  episodes: Episode[];
  preview: {
    selectedEpisodeId: string;
    selectedShotId: string;
    imagePrompt: string;
    videoPrompt: string;
    productionNotes: string[];
  };
};
