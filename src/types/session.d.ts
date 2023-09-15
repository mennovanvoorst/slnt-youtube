import { Video } from "@interfaces/video";

export interface Session {
  isActive: boolean;
  hosts: number[];
  playlist: Video[];
  isPlaying: boolean;
  timestamp: number;
  delay: number;
}
