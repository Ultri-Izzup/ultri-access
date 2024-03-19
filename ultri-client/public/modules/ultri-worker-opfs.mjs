const opfsRootDH = await navigator.storage.getDirectory();
console.log("OPFS ROOT DIR HANDLE", opfsRootDH);

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

// Cache directory and file handles in a Map
const dirHandles = new Map();
const fileHandles = new Map();

const topLevelPaths = ["workspaces"];

const fileExtensions = ["json"];

const trimLeadingSlashRegex = /\//;

const nameSafeRegex = /[^a-zA-Z0-9]\s/g;

const parseFilePath = (path) => {
  // Remove leading slash
  const cleanPath = path.replace(trimLeadingSlashRegex, "");

  // Split on slashes
  const segments = cleanPath.split("/");
  console.log("SEGMENTS", segments);

  // Validate first segment is a defined top level path.
  const topLevel = segments[0];
  if (topLevelPaths.includes(topLevel)) {
    // Last segment is the file
    const fileSegment = segments.pop();

    // Split file on dot
    const fileParts = fileSegment.split(".");

    // Verify supported file extension
    const ext = fileParts.pop();
    if (fileExtensions.includes(ext)) {
      // Scrub filename
      let namePart = "";

      for (const element of fileParts) {
        console.log("FILE PART ELEMENT", element);
        namePart = namePart + element.replace(nameSafeRegex);
      }

      // Recreate validated file name
      const validFilename = `${namePart}.${ext}`;

      // Check each additional segment for directory name safety
      const scrubbedSegments = [];
      for (const element of segments) {
        console.log("SEGMENTS ELEMENT", element);
        console.log(
          "CLEAN SEGMENTS ELEMENT",
          element.replace(nameSafeRegex, "")
        );
        scrubbedSegments.push(element.replace(nameSafeRegex, ""));
      }

      // Return segments and valid filename
      return { dirSegments: scrubbedSegments, filename: validFilename };
    }
  }

  return { dirSegments: null, filename: null };
};

const parseDirPath = (path) => {
  // Remove leading slash
  const cleanPath = path.replace(trimLeadingSlashRegex, "");

  // Split on slashes
  const segments = cleanPath.split("/");
  console.log("SEGMENTS", segments);

  // Validate first segment is a defined top level path.
  const topLevel = segments[0];
  if (topLevelPaths.includes(topLevel)) {
    const scrubbedSegments = [];
    for (const element of segments) {
      console.log("SEGMENTS ELEMENT", element);
      console.log("CLEAN SEGMENTS ELEMENT", element.replace(nameSafeRegex, ""));
      scrubbedSegments.push(element.replace(nameSafeRegex, ""));
    }

    // Return segments and valid filename
    return { dirSegments: scrubbedSegments };
  }

  return { dirSegments: null };
};

const writeFile = async (dirSegments, filename, data, handler) => {
  const filePath = `/${dirSegments.join("/")}/${filename}`;

  console.log("ATTEMPT WRITE FILE", filePath);
  console.log("WITH DATA", data);

  // Get the file handle
  const accessFH = await getFileHandle(dirSegments, filename);

  // Write the file
  // writeableFH = getFileHandle(dirSegments, filename);
  // Initialize this variable for the size of the file.
  let size;
  // The current size of the file, initially `0`.
  //size = accessFH.getSize();
  // Encode content to write to the file.
  const content = textEncoder.encode(data);
  console.log("CONTENT", content);
  // Write the content at the beginning of the file.
  accessFH.write(content, { at: 0 });
  // Flush the changes.
  accessFH.flush();

  const resultMap = new Map([[filePath, data]]);
  self.postMessage({ savedFile: resultMap, handler: handler });
};

const getFileHandle = async (dirSegments, filename) => {
  console.log("GET  FILEHANDLE", `/${dirSegments.join("/")}/${filename}`);

  // get the directory handle for parent directory

  const dirHandle = await getDirHandle(dirSegments);

  console.log("FILE DIRHANDLE", dirHandle);

  const fileHandle = await dirHandle.getFileHandle(filename, { create: true });

  console.log("FileHandle", fileHandle);

  return fileHandle;

};

const getDirHandle = async (dirSegments) => {
  const targetHandleName = `/${dirSegments.join("/")}`;

  console.log(`LOADING ${targetHandleName}`);

  // If we already have the desired handle, return it.
  if (dirHandles.has(targetHandleName)) {
    console.log("USING CACHED DIRHANDLE", targetHandleName);
    return dirHandles.get(targetHandleName);
  }

  let currDirHandle = opfsRootDH;
  let currDirName = "/";

  for (const segment of dirSegments) {
    currDirName = `${currDirName}${segment}/`;
    console.log(`RECURSED TO ${currDirName}`);
    if (dirHandles.has(currDirName)) {
      console.log("USING CACHED DIRHANDLE", currDirName);
      currDirHandle = dirHandles.get(currDirName);
    } else {
      console.log("LOADING DIRHANDLE", currDirName);
      currDirHandle = await currDirHandle.getDirectoryHandle(segment, {
        create: true
      });
      dirHandles.set(currDirName, currDirHandle);
    }
  }

  console.log("RETURING DIRHANDLE", currDirHandle);
  return currDirHandle;
};

const readDirectory = async (dirSegments, handler, options = {}) => {
  const targetHandleName = `/${dirSegments.join("/")}`;

  console.log(`READING DIRECTORY ${targetHandleName}`);

  // The object that will hold the properties and collected data
  const dirObj = {path: targetHandleName};
  const dirFiles = new Map();
  const subDirs = new Map();
  const fileData = new Map();

  // Get the directory handle
  const dirHandle = await getDirHandle(dirSegments);

  for await (const [name, handle] of dirHandle.entries()) {
    const currPath = `${targetHandleName}${handle.name}`;
    // FILES
    if(handle.kind === 'file') {
      if(!fileHandles.has(currPath)) {
        fileHandles.set(currPath, handle)
      }
      dirFiles.set(handle.name, { fullPath: currPath })
    }
    // DIRECTORIES
    if(handle.kind === 'directories') {
      if(!dirHandles.has(currPath)) {
        dirHandles.set(currPath, handle)
      }
      subDirs.set(handle.name, { fullPath: currPath })
    }
  }
  // Load the requested files if found.
  console.log('OPTIONS', options)

  if(options.loadFiles && options.loadFiles.length > 0) {
    for (const fileName of options.loadFiles) {
      console.log(`LOAD FILE CONTENT FOR ${fileName}`);

      const fileHandle = await getFileHandle(dirSegments, fileName);

      const accessHandle = await fileHandle.createSyncAccessHandle();

      console.log('ACCESS HANDLE', accessHandle)

      const size = accessHandle.getSize();

      // Prepare a data view of the length of the file.
      const dataView = new DataView(new ArrayBuffer(size));

      // Read the entire file into the data view.
      accessHandle.read(dataView);

      // Decode data into an string
      const decoded = textDecoder.decode(dataView)

      // Parse the string as JSON
      const currData = JSON.parse(decoded);

      // Store JSON in fileData Map
      fileData.set(fileName, currData)

      accessHandle.close()

    }
  }


  dirObj.files = dirFiles;
  dirObj.subDirs = subDirs;
  dirObj.fileData = fileData;

  self.postMessage({ directoryRead: dirObj, handler: handler });
};

self.onmessage = async (msg) => {
  console.log("WORKER MESSAGE RECEIVED", msg);

  // Read a directory
  if (msg.data.readDirectory) {
    console.log("READ DIRECTORY USING CONFIG:", msg.data.readDirectory);
    const { dirSegments } = parseDirPath(msg.data.readDirectory.path);
    const options  = msg.data.readDirectory.opts;

    readDirectory(dirSegments, msg.data.handler, options)
  }

  // Write one or more files
  if (msg.data.writeFiles) {
    console.log("WRITE FILES:", msg.data.writeFiles);

    for (const [path, value] of msg.data.writeFiles) {
      console.log(`WRITING a/an ${typeof value} TO ${path}`);
      let writeable = value;

      let isObject = false;

      // Stringify objects for writing
      if (typeof value === "object") {
        writeable = JSON.stringify(value);
        console.log("CONVERTED OBJECT TO STRING");
        isObject = true;
      }

      // Break path into parts and filename
      const { dirSegments, filename } = parseFilePath(path);
      console.log("DIR SEGMENTS", dirSegments);
      console.log("FILENAME", filename);

      // Write the file, await?
      writeFile(dirSegments, filename, writeable, msg.data.handler);

      // self.postMessage({
      //   write_file: {
      //     path: `/${dirSegments.join("/")}/`,
      //     filename: filename,
      //     data: value,
      //     handler: msg.data.handler
      //   }
      // });

      console.log(`SENT MSG FOR ${path} TO USE HANDLER ${msg.data.handler}`);
    }
  }
};
