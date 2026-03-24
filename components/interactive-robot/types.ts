import { CSSProperties } from "react";

export type Emotion = "neutral" | "happy" | "angry" | "sad" | "surprised";

export type RobotMessage = {
  text?: string;
  emotion?: Emotion;
};

export type RobotMessageResult = string | RobotMessage;

export type RobotMessageSource = () => Promise<RobotMessageResult> | RobotMessageResult;

export type RobotDialogueConfig = {
  initialDelayMs?: number;
  visibleDurationMs?: number;
  minIntervalMs?: number;
  maxIntervalMs?: number;
  retryDelayMs?: number;
  onError?: (error: unknown) => void;
};

export type InteractiveRobotProps = {
  messageSource?: RobotMessageSource;
  dialogueEnabled?: boolean;
  dialogueConfig?: RobotDialogueConfig;
  initialEmotion?: Emotion;
  emojis?: Partial<Record<Emotion, string[]>>;
  bubbleMaxWidth?: number;
  enableElectronCursor?: boolean;
  electronCursorChannel?: string;
  debugTelemetry?: boolean;
  onBotClick?: () => void;
};

export type RobotSceneProps = {
  robotProps?: InteractiveRobotProps;
  containerStyle?: CSSProperties;
  camera?: {
    position: [number, number, number];
    fov: number;
  };
  environmentPreset?:
    | "apartment"
    | "city"
    | "dawn"
    | "forest"
    | "lobby"
    | "night"
    | "park"
    | "studio"
    | "sunset"
    | "warehouse";
  ambientLightIntensity?: number;
  directionalLight?: {
    position: [number, number, number];
    intensity: number;
  };
  spotLights?: Array<{
    color: string;
    intensity: number;
    position: [number, number, number];
    angle: number;
    penumbra: number;
    distance: number;
  }>;
};
