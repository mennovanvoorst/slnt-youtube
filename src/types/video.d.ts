export interface Thumbnails {
  default: string; // 120*90
  medium: string; // 320*180
  high: string; // 480*360
}

export interface Video {
  id: string;
  title: string;
  duration: number;
  channel: string;
  thumbnails: Thumbnails;
  priority?: string;
}
