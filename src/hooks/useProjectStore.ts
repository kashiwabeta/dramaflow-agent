"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import mockProject from "@/data/mock-project.json";
import type {
  AiGenerationResult,
  AssetStatus,
  CharacterAsset,
  Episode,
  SceneAsset,
  Shot,
} from "@/types/project";

const STORAGE_KEY = "dramaflow-project-state";
const initialProject = mockProject as AiGenerationResult;

type SaveStatus = "idle" | "saving" | "saved";

function cloneProject(project: AiGenerationResult): AiGenerationResult {
  return JSON.parse(JSON.stringify(project)) as AiGenerationResult;
}

export function useProjectStore() {
  const [project, setProject] = useState<AiGenerationResult>(() =>
    cloneProject(initialProject),
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [hydrated, setHydrated] = useState(false);
  const saveTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setProject(JSON.parse(stored) as AiGenerationResult);
        }
      } catch {
        setProject(cloneProject(initialProject));
      } finally {
        setHydrated(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }
    window.setTimeout(() => setSaveStatus("saving"), 0);
    saveTimerRef.current = window.setTimeout(() => {
      setSaveStatus("saved");
      saveTimerRef.current = null;
    }, 500);
  }, [hydrated, project]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  const updateCharacter = useCallback(
    (characterId: string, patch: Partial<CharacterAsset>) => {
      setProject((current) => ({
        ...current,
        characters: current.characters.map((character) =>
          character.id === characterId ? { ...character, ...patch } : character,
        ),
      }));
    },
    [],
  );

  const updateScene = useCallback((sceneId: string, patch: Partial<SceneAsset>) => {
    setProject((current) => ({
      ...current,
      scenes: (current.scenes ?? []).map((scene) =>
        scene.id === sceneId ? { ...scene, ...patch } : scene,
      ),
    }));
  }, []);

  const updateEpisode = useCallback((episodeId: string, patch: Partial<Episode>) => {
    setProject((current) => ({
      ...current,
      episodes: current.episodes.map((episode) =>
        episode.id === episodeId ? { ...episode, ...patch } : episode,
      ),
    }));
  }, []);

  const updateShot = useCallback(
    (episodeId: string, shotId: string, patch: Partial<Shot>) => {
      setProject((current) => ({
        ...current,
        episodes: current.episodes.map((episode) =>
          episode.id === episodeId
            ? {
                ...episode,
                shots: episode.shots.map((shot) =>
                  shot.id === shotId ? { ...shot, ...patch } : shot,
                ),
              }
            : episode,
        ),
      }));
    },
    [],
  );

  const setCharacterStatus = useCallback(
    (characterId: string, status: AssetStatus) => {
      updateCharacter(characterId, { status });
    },
    [updateCharacter],
  );

  const setSceneStatus = useCallback(
    (sceneId: string, status: AssetStatus) => {
      updateScene(sceneId, { status });
    },
    [updateScene],
  );

  const setEpisodeStatus = useCallback(
    (episodeId: string, status: NonNullable<Episode["status"]>) => {
      updateEpisode(episodeId, { status });
    },
    [updateEpisode],
  );

  const setShotStatus = useCallback(
    (episodeId: string, shotId: string, status: NonNullable<Shot["status"]>) => {
      updateShot(episodeId, shotId, { status });
    },
    [updateShot],
  );

  const resetProject = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setProject(cloneProject(initialProject));
    setSaveStatus("saving");
  }, []);

  return {
    project,
    saveStatus,
    updateCharacter,
    updateScene,
    updateEpisode,
    updateShot,
    setCharacterStatus,
    setSceneStatus,
    setEpisodeStatus,
    setShotStatus,
    resetProject,
  };
}
