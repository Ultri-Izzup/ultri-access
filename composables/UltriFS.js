import Dexie from "dexie";
import { liveQuery } from "dexie";
import { useObservable } from "@vueuse/rxjs";

const db = new Dexie("workspace");
db.version(1).stores({
  workspaces: "++id, name", // Primary key and indexed props
  nuggets: "++id, workspaceId, type, status, createdAt, modifiedAt"
});

export default function useUltriFS() {
  
  // Add a new workspace, returns id
  const addWorkspace = async (name, description) => {
    try {
      const id = await db.workspaces.add({
        name: name,
        description: description
      });

      return id;
    } catch (error) {
      return error;
    }
  };

  const getWorkspaces = async () => {
    return useObservable(
      liveQuery(() => db.workspaces.toArray())
    );
  };

  return {
    addWorkspace,
    getWorkspaces,
  };
}