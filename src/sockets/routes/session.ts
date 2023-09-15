import session from "@models/session";

const sessionCreated = async ({ payload }: { payload: any }): Promise<void> => {
  if (!payload) return;

  await session.save(payload);
};

const sessionJoined = async ({ payload }: { payload: any }): Promise<void> => {
  if (!payload) return;

  await session.save(payload);
};

const sessionUpdated = async ({ payload }: { payload: any }): Promise<void> => {
  if (!payload) return;

  await session.save(payload);
};

const sessionStopped = async ({ payload }: { payload: any }): Promise<void> => {
  if (!payload) return;

  await session.save(payload);
};

export default {
  sessionJoined,
  sessionCreated,
  sessionUpdated,
  sessionStopped
};
