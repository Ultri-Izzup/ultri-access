self.onmessage = async (msg) => {

  // Root of OPFS
  const root = await navigator.storage.getDirectory();

  const spaceManifest = await root.getFileHandle('spaceManifest.json', { create: true });
  console.log(spaceManifest)

  const spaceDir = await root.getDirectoryHandle('spaces', { create: true });
  console.log(spaceDir)

  if(msg.data.load_spaces) {
      console.log('Loading Spaces w msg:', msg);
      const spaceMap = new Map();
      console.log(await spaceDir.entries())
      self.postMessage(msg.data);
  }
}

