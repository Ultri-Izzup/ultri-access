// (async () => {
//   try {
//     const rootDH = await navigator.storage.getDirectory();
//     console.log('OPFS ROOT', rootDH)
//   } catch (e) {
//     console.error('OPFS ERROR')
//   }
// })();

let rootDH;

navigator.storage.getDirectory().then(dirHandle => {
  rootDH = dirHandle;
  console.log('OPFS ROOT', rootDH);


})



self.onmessage = async (msg) => {

  if(msg.data.read_directory) {
    console.log('READ Directory');

    // The message defines the directory and options
    const readConf = msg.data.read_directory;

    console.log('WORKER READ OPTIONS', readConf)

    // self.postMessage({load_manifest: manifest});
  }
}

const readDirectory = async (readConf={}) => {

  console.log('READ DIR OPTIONS', readConf)

}


