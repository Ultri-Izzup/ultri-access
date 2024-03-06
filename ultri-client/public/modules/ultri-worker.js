self.onmessage = async (msg) => {

  // Root of OPFS
  const root = await navigator.storage.getDirectory();

  const fileHandle = await root.getFileHandle('UltriManifest.json', { create: true });
  console.log('MANIFEST FILE HANDLE', fileHandle);

  const accessHandle = await fileHandle.createSyncAccessHandle();
  console.log('MANIFEST ACCESS HANDLE', accessHandle);

  let fileSize = 0;

  fileSize = accessHandle.getSize();
  console.log('MANIFEST FILE SIZE - 1', fileSize);

  if(fileSize === 0) {
    const fileEncoder = new TextEncoder();
    const initialObj = {
      manifestUid: this.crypto.randomUUID(),
      ultriVersion: "1.0.0",
      createdAt: new Date().toISOString()
    }
    const encodedContent = fileEncoder.encode(JSON.stringify(initialObj, undefined, 2));
    const fileWriteBuffer = accessHandle.write(encodedContent, { at: 0 });
  }

  accessHandle.flush();

  fileSize = accessHandle.getSize();
  console.log('MANIFEST FILE SIZE - 2', fileSize);

  const buffer = new DataView(new ArrayBuffer(fileSize));
  const readBuffer = accessHandle.read(buffer, { at: 0 });

  const fileDecoder = new TextDecoder();
  const decoded = fileDecoder.decode(buffer);
  console.log();

  const manifest = JSON.parse(decoded);

  const spaceDir = await root.getDirectoryHandle('spaces', { create: true });
  console.log('SPACE DIR', spaceDir)

  if(msg.data.load_manifest) {
    console.log('READ MANIFEST');

    // const spaceMap = new Map();
    // console.log('SPACE ENTRIES', await spaceDir.entries())
    self.postMessage({load_manifest: manifest});
  }

  accessHandle.close();
}

