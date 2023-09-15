import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 0, checkperiod: 0 });

export const getCache = async (key: string): Promise<any> => {
  if (cache === null) return new Error("Cache not initialized");

  return cache.get(key);
};

export const setCache = async (key: string, value: any): Promise<any> => {
  if (cache === null) return new Error("Cache not initialized");

  await cache.set(key, value);
};

export default cache;
