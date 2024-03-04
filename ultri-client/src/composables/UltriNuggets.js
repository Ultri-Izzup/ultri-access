export default function useUltriNuggets() {

  // Add a new workspace, returns id
  const addWorkspace = async (name, description) => {
    try {
      // const id = await db.workspaces.add({
      //   name: name,
      //   description: description
      // });

      // return id;
    } catch (error) {
      return error;
    }
  };

  const getWorkspaces = async () => {
    // return useObservable(
    //   liveQuery(() => db.workspaces.toArray())
    // );
  };

  return {
    addWorkspace,
    getWorkspaces,
  };
}
