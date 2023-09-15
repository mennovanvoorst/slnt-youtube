const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
const videoRegex =
  /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
const playlistRegex = /^.*(youtu.be\/|list=)([^#&?]*).*/;

export const isPlaylist = (url: string): null | string => {
  if (!url.match(youtubeRegex)) return null;

  if (!url.includes("playlist")) return null;

  const match = url.match(playlistRegex);
  return match && match[2] && match[2];
};

export const isVideo = (url: string): null | string => {
  if (!url.match(youtubeRegex)) return null;

  const match = url.match(videoRegex);
  if (!match) return null;

  return match[7];
};

export const shuffleArray = (array: any[]): any[] => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};
