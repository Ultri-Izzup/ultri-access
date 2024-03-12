const opfsRootDH = await navigator.storage.getDirectory();
console.log('OPFS ROOT DIR HANDLE', opfsRootDH);

self.onmessage = async (msg) => {
  console.log(msg)
  if(msg.data.read_directory) {
    console.log('READ DIRECTORY USING CONFIG:', msg.data.read_directory);

    self.postMessage({read_directory: {result: 'ok'}});
  }
}


