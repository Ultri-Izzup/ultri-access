const opfsRootDH = await navigator.storage.getDirectory();
console.log('OPFS ROOT DIR HANDLE', opfsRootDH);

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

      // Break path into parts and filename
      const { dirSegments, filename } = parsePath(path);
      console.log('DIR SEGMENTS', dirSegments)
      console.log('filename', filename)
    }
  }

}




