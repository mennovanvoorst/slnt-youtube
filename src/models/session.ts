import { Session } from "@interfaces/session";
import { getCache, setCache } from "@services/cache";

const save = async (ses: Session): Promise<void> => {
  await setCache(`session:${ses.hosts[0]}`, ses);
};

const get = async (sessionId: number): Promise<Session> =>
  await getCache(`session:${sessionId}`);

export default {
  save,
  get
};
