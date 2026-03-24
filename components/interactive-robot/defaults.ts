import { Emotion, RobotDialogueConfig, RobotSceneProps } from "./types";

export const DEFAULT_INITIAL_EMOTION: Emotion = "neutral";
export const DEFAULT_POINTER_CHANNEL = "global-cursor";
export const DEFAULT_BUBBLE_MAX_WIDTH = 250;

export const DEFAULT_EMOJIS: Record<Emotion, string[]> = {
  neutral: ["💭", "🤖", "🔋", "⚙️", "🔍"],
  happy: ["✨", "💖", "🎵", "🚀", "🌟", "🌸", "🍰"],
  angry: ["💢", "⚡", "🔥", "❗", "😤", "🛑"],
  sad: ["🌧️", "💤", "💧", "🩹", "🥀", "..."],
  surprised: ["❓", "👀", "💡", "😲", "❗"],
};

export const DEFAULT_DIALOGUE_CONFIG: Required<
  Pick<
    RobotDialogueConfig,
    "initialDelayMs" | "visibleDurationMs" | "minIntervalMs" | "maxIntervalMs" | "retryDelayMs"
  >
> = {
  initialDelayMs: 5000,
  visibleDurationMs: 10000,
  minIntervalMs: 100000,
  maxIntervalMs: 300000,
  retryDelayMs: 30000,
};

export const DEFAULT_CAMERA: NonNullable<RobotSceneProps["camera"]> = {
  position: [0, 2.5, 9],
  fov: 50,
};

export const DEFAULT_CONTAINER_STYLE = {
  width: "100%",
  height: "100%",
  background: "transparent",
} as const;

export const DEFAULT_LIGHTING = {
  ambient: 0.5,
  directional: {
    position: [5, 10, 5] as [number, number, number],
    intensity: 1,
  },
  spots: [
    {
      color: "#ff007f",
      intensity: 50,
      position: [4, 3, 2] as [number, number, number],
      angle: 0.6,
      penumbra: 1,
      distance: 10,
    },
    {
      color: "#7a00ff",
      intensity: 40,
      position: [-4, 3, 2] as [number, number, number],
      angle: 0.6,
      penumbra: 1,
      distance: 10,
    },
  ],
} as const;
