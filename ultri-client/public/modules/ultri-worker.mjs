const opfsRootDH = await navigator.storage.getDirectory();
console.log('OPFS ROOT DIR HANDLE', opfsRootDH);

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

// Cache directory and file handles in a Map
const dirHandles = new Map();
const fileHandles = new Map();

const topLevelPaths = ['workspaces'];

const fileExtensions = ['json'];

const trimLeadingSlashRegex = /\//;

const nameSafeRegex = /[^a-zA-Z0-9]\s/g;

const parsePath = (path) => {

  // Remove leading slash
  const cleanPath = path.replace(trimLeadingSlashRegex, '');

  // Split on slashes
  const segments = cleanPath.split('/');
  console.log('SEGMENTS', segments)

  // Validate first segment is a defined top level path.
  const topLevel = segments[0];
  if(topLevelPaths.includes(topLevel)) {

    // Last segment is the file
    const fileSegment = segments.pop();

    // Split file on dot
    const fileParts = fileSegment.split('.');

    // Verify supported file extension
    const ext = fileParts.pop();
    if(fileExtensions.includes(ext)) {
      // Scrub filename
      let namePart = '';

      for (const element of fileParts) {
        console.log('FILE PART ELEMENT', element);
        namePart = namePart + element.replace(nameSafeRegex);
      }

      // Recreate validated file name
      const validFilename = `${namePart}.${ext}`

      // Check each additional segment for directory name safety
      const scrubbedSegments = [];
      for (const element of segments) {
        console.log('SEGMENTS ELEMENT', element);
        console.log('CLEAN SEGMENTS ELEMENT', element.replace(nameSafeRegex, ''));
        scrubbedSegments.push(element.replace(nameSafeRegex, ''));
      }

      // Return segments and valid filename
      return {dirSegments: scrubbedSegments, filename: validFilename }

    }
  }

  return {dirSegments: null, filename: null }



}

const writeFile = async (dirSegments, filename,  data) => {

  console.log('ATTEMPT WRITE FILE', `/${dirSegments.join('/')}/${filename}`)
  console.log('WITH DATA', data)

  // Get the file handle
  const accessFH = await getFileHandle(dirSegments, filename);

  // Write the file
  // writeableFH = getFileHandle(dirSegments, filename);
  // Initialize this variable for the size of the file.
  let size;
  // The current size of the file, initially `0`.
  size = accessFH.getSize();
  // Encode content to write to the file.
  const content = textEncoder.encode(data);
  console.log('CONTENT', content)
  // Write the content at the beginning of the file.
  accessFH.write(content, {at: size});
  // Flush the changes.
  accessFH.flush();
}

const getFileHandle = async (dirSegments, filename) => {

  console.log('GET  FILEHANDLE', `/${dirSegments.join('/')}/${filename}`);

  // get the directory handle for parent directory

  const dirHandle = await getDirHandle(dirSegments);

  console.log('FILE DIRHANDLE', dirHandle);

  const fileHandle = await dirHandle.getFileHandle(filename, {create: true});

  const accessHandle = await fileHandle.createSyncAccessHandle();

  return accessHandle;
}

const getDirHandle = async (dirSegments) => {

    const targetHandleName = `/${dirSegments.join("/")}`;

    console.log(`LOADING ${targetHandleName}`);

    // If we already have the desired handle, return it.
    if (dirHandles.has(targetHandleName)) {
      console.log('USING CACHED DIRHANDLE', targetHandleName);
      return dirHandles.get(targetHandleName);
    }

    let currDirHandle = opfsRootDH;
    let currDirName ="/";

    for (const segment of dirSegments) {
      currDirName = `${currDirName}${segment}/`;
      console.log(`RECURSED TO ${currDirName}`)
      if (dirHandles.has(currDirName)) {
        console.log('USING CACHED DIRHANDLE', currDirName);
        currDirHandle = dirHandles.get(currDirName)
      } else {
        console.log('LOADING DIRHANDLE', currDirName);
        currDirHandle = await currDirHandle.getDirectoryHandle(segment, {create: true});
        dirHandles.set(currDirName, currDirHandle)
      }
    }

    console.log('RETURING DIRHANDLE', currDirHandle)
    return currDirHandle;

    // //

    // // Keep track of the current path segments to save the dirHandles as we recurse.
    // const currHandleSegments = [];

    //

    // for (const segment of dirSegments) {

    //   currHandleSegments.push(segment);

    //   const dirPath = currHandleSegments.join("/");

    //   console.log('CURRENT DIR PATH', dirPath);

    //   if (dirHandles.has(dirPath)) {
    //     console.log(`USING CACHED DIRHANDLE FOR ${dirPath}`);
    //     currDirHandle = dirHandles.get(dirPath);
    //   } else {
    //     console.log(`LOADING DIRHANDLE ${dirPath}`);

    //     // dirHandles.set(dirPath, currDirHandle);
    //   }
    // }



};

self.onmessage = async (msg) => {
  console.log('WORKER MESSAGE RECEIVED 4', msg)

  // Read a directory
  if(msg.data.read_directory) {
    console.log('READ DIRECTORY USING CONFIG:', msg.data.read_directory);

    self.postMessage({read_directory: {result: 'ok'}});
  }

  // Write one or more files
  if(msg.data.write_files) {
    console.log('WRITE FILES:', msg.data.write_files);

    for (const [path, value] of msg.data.write_files) { // Using the default iterator (could be `map.entries()` instead)
      console.log(`Writing a/an ${typeof value} to ${path}`);
      let writeable = value;

      // Stringify objects for writing
      if(typeof value === 'object') {
        writeable = JSON.stringify(value)
      }

      // Break path into parts and filename
      const { dirSegments, filename } = parsePath(path);
      console.log('DIR SEGMENTS', dirSegments)
      console.log('FILENAME', filename)

      // Write the file, await?
     writeFile(dirSegments, filename, writeable);
    }
  }

}




