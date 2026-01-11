const { sendToEx2Server } = require("../integration");

let idCounter = 0
const files = [] 
const folders = [{ id: null, listOfFiles: [] }] // represent root directory
const MAX_KEY_LENGTH = 10;
const TRASH_RETENTION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // run cleanup every hour


const isExist = (id) => files.some(file => file.id === id);

const isStorageKeyUnique = (storageKey) => {
    return !files.some(file => getStorageKey(file) === storageKey && file.type === "file");
}

const getStorageKey = (file) => {
    // Sanitize title to avoid spaces breaking the Ex2 protocol
    return file.key + file.title.replace(/\s+/g, '_');
}

const hasPermissions = (id, userId, perms) => {
    const file = files.find(file => file.id === id)
    return !(file.permissions[userId] == undefined || (!(file.permissions[userId] & perms) && !(file.inheritedPermissions[userId] & perms)));
}

const isCreator = (id, userId) => {
    const file = files.find(file => file.id === id)
    return file.creator == userId
}

const isFolder = (id) => {
    const file = files.find(file => file.id === id)
    return (file.type == "folder")
}

const getAllFiles = (userId) => files.filter(file => ((file.permissions[userId] !== undefined) || (file.inheritedPermissions[userId] !== undefined)) && visible(file.id));

// helper function to create a character index map of a given string
function charIndexMap(str) {
    const map = {};

    for (let i = 0; i < str.length; i++) {
        const ch = str[i];

        if (!map[ch]) {
            map[ch] = [];
        }
        map[ch].push(i);
    }

    return map;
}

function usedAndUnusedChars(map, ignoreSet) {
    const usedChars = [];
    const unusedChars = [];

    // Iterate over all printable ASCII characters (33-126)
    for (let i = 33; i < 127; i++) {
        const char = String.fromCharCode(i);
        
        if (ignoreSet.has(char)) 
            continue;
        
        if (map[char]) 
            usedChars.push(char);
        else
            unusedChars.push(char);
    }

    return { usedChars, unusedChars };
}

function randomInt(max) {
    return Math.floor(Math.random() * max); 
}

const generateKey = (title, content, maxLength) => {
    const combined = title + content;

    const charMap = charIndexMap(combined);

    let ignore = new Set([String.fromCharCode(127)]);
    for (let i = 0; i < 33; i++) {
        ignore.add(String.fromCharCode(i));
    }
    const { usedChars, unusedChars } = usedAndUnusedChars(charMap, ignore);
    const unusedLen = unusedChars.length;
    const usedLen = usedChars.length;

    let key = "";
    if (isStorageKeyUnique(key+title)) //if the file name is already unique
        return {key, unusedLen};

    if (usedLen > 0 && unusedLen > 0) {
        while (true) {
            for (let i = 0; i < maxLength/2; i++) {
                key += usedChars[randomInt(usedLen)];
                key += unusedChars[randomInt(unusedLen)];

                if (isStorageKeyUnique(key+title)) 
                    return {key, unusedLen};
            }
            key = "";
        }
    } else if (usedLen == 0) {
        while (true) {
            for (let i = 0; i < maxLength; i++) {
                key += unusedChars[randomInt(unusedLen)];

                if (isStorageKeyUnique(key+title)) 
                    return {key, unusedLen};
            }
            key = "";
        }
    } else { //the string contains all valid characters
        const first = combined.charAt(0);
        // all valid characters are used, so we will create a char c so that c+first isnt a substring of combined
        for (let i = 33; i < 127; i++) {
            const c = String.fromCharCode(i);
            if (ignore.has(c)) continue; // Respect the ignore set!

            if (charMap[c] === undefined) {
                key = c;
                if (isStorageKeyUnique(key+title)) 
                    return {key, unusedLen};
            } else {
                const indexC = charMap[c];
                const indexFirst = charMap[first];

                for (let j = 0; j < indexC.length; j++) {
                    if (!indexFirst.includes(Math.min(indexC[j] + 1, combined.length - 1))) {
                        key = c;
                        if (isStorageKeyUnique(key+title)) 
                            return {key, unusedLen};
                    }

                }
            }
        }

        //if we reached here, we couldnt find a good key, so, we will return a generic one
        while (true) {
            for (let i = 0; i < maxLength; i++) {
                //if we reached here, all valid characters are used, so we will just use used characters to create the key
                key += usedChars[randomInt(usedLen)]; 

                if (isStorageKeyUnique(key+title)) 
                    return {key, unusedLen: -1}; //-1 indicates we couldnt find a good key
            }
            key = "";
        }
    }
}




const createFile = async (title, content, type, userId) => {
    /*
        Call the file server and provide (title, content) to create the file (or folder if type == "folder")!
    */
    let result, key = "", unusedLen = 0;
    if (type == "file"){
        const keyData = generateKey(title, content, MAX_KEY_LENGTH);
        key = keyData.key;
        unusedLen = keyData.unusedLen;

        const storageIdentifier = key + title.replace(/\s+/g, '_');
        result = await sendToEx2Server(`POST ${storageIdentifier} ${content}`);

        if (result.statusCode !== 201) 
            throw { status: result.statusCode, message: result.statusLine };
    }
    
        
    const newFile = { id: ++idCounter, title, type, creator: userId, permissions: { [userId]: 7 } ,inheritedPermissions: {} , star: { [userId]: false }, trash: [false, null], last: new Date(), dir: null , key, unusedLen };
    files.push(newFile)

    if (type === "folder") {
        folders.push({ filePtr: newFile, listOfFiles: [] });
    }

    return newFile
}

const getFile = async (id) => {
    const file = files.find(file => file.id === id)

    if (file.type === "folder") {
        folder = folders.find(f => f.filePtr && f.filePtr.id === id);
        return folder;
    }

    /*
        Call the file server with file.title and insert the text into str...

        NOTE: the file shouldnt have a content field in the files array, need to be changed
    */
    const result = await sendToEx2Server(`GET ${getStorageKey(file)}`);
    if (result.statusCode !== 200) { //error occurred
        throw { status: result.statusCode, message: result.statusLine };
    }

    return { ...file, content: result.bodyText }
}

const updateFile = async (id, title, content) => {
    const file = files.find(file => file.id === id);

    // Folders are local-only; renaming them should not call the external TCP server.
    if (file.type === "folder") {
        file.title = title;
        return;
    }

    // delete old entry in external server and recreate with new title/content
    const delRes = await sendToEx2Server(`DELETE ${getStorageKey(file)}`);
    if (delRes.statusCode !== 204) {
        throw { status: delRes.statusCode, message: delRes.statusLine };
    }

    // update local record
    file.title = title;
    file.key = ""; // reset key before generating a new one so we wont block possible keys
    const keyData = generateKey(title, content, MAX_KEY_LENGTH);
    file.key = keyData.key;
    file.unusedLen = keyData.unusedLen;

    const createRes = await sendToEx2Server(`POST ${getStorageKey(file)} ${content}`);
    if (createRes.statusCode !== 201) {
        throw { status: createRes.statusCode, message: createRes.statusLine };
    }

    file.last = new Date();
}


const deleteFile = async (id, userId) => {
    const index = files.findIndex(file => file.id === id)
    if (index === -1) return; // Already deleted or not found

    const file = files[index];

    // Detach from parent folder if needed - must be done before deleting the file!
    if (file.dir !== null) {
        const parentFolder = folders.find(f => f.filePtr && f.filePtr.id === file.dir);
        if (parentFolder) {
            parentFolder.listOfFiles = parentFolder.listOfFiles.filter(f => f.id !== id);
        }
    }
    
    if (file.type === "folder") {
        // remove all files in the folder
        const folderIdx = folders.findIndex(f => f.filePtr && f.filePtr.id === id)
        
        if (folderIdx !== -1) {
            const folder = folders[folderIdx];
            // Create a copy of the list to iterate safely while deleting
            const children = [...folder.listOfFiles];
            for (const child of children) {
                await deleteFile(child.id, userId);
            }
            folders.splice(folderIdx, 1);
        }

        // finally remove the folder itself
        const newIndex = files.findIndex(f => f.id === id);
        if (newIndex !== -1) {
            files.splice(newIndex, 1);
        }
        return;
    }

    const resultDel = await sendToEx2Server(`DELETE ${getStorageKey(file)}`);
    if (resultDel.statusCode !== 204) { //error occurred
        throw { status: resultDel.statusCode, message: resultDel.statusLine };
    }

    files.splice(index, 1) 
}

const getFilePermissions = (id) => {
    const file = files.find(file => file.id === id)

    return file.permissions
}

const createFilePermissions = (id, pid, perms) => {
    const file = files.find(file => file.id === id)

    if (file.type === "folder") {
        // add permissions to all files in the folder
        const folder = folders.find(f => f.filePtr && f.filePtr.id === id);
        for (const file of folder.listOfFiles) {
            createFilePermissions(file.id, pid, perms);
        }
    }

    file.permissions[pid] = perms;
    file.star[pid] = false;
}

const updateFilePermissions = (id, pid, perms) => {
    const file = files.find(file => file.id === id)

    if (file.type === "folder") {
        // update permissions to all files in the folder
        const folder = folders.find(f => f.filePtr && f.filePtr.id === id);
        for (const file of folder.listOfFiles) {
            updateFilePermissions(file.id, pid, perms);
        }
    }

    file.permissions[pid] = perms;
}

const deleteFilePermissions = (id, pid) => {
    const file = files.find(file => file.id === id)

    if (file.type === "folder") {
        // delete permissions to all files in the folder
        const folder = folders.find(f => f.filePtr && f.filePtr.id === id);
        for (const file of folder.listOfFiles) {
            deleteFilePermissions(file.id, pid);
        }
    }

    delete file.permissions[pid];
    delete file.star[pid];
}

//assume the given file StorageKey returned in the search
const validFileSearch = async (file, query) => {
    const key = file.key;
    //file saved as it is, so there is no distortion
    if (key == "") 
        return true

    //if file has unused and used characters
    if (file.unusedLen > 0 && file.unusedLen < 94) { 
        if (key.indexOf(query[0]) === -1)
             //if so the query doesnt overlap with key so for sure we didnt got this file because of the key
            return true; 
        
        if (query.length === 1)
            //if single char query, it should be in even indices of key (used chars)
            return key.indexOf(query[0])%2 === 0; 

        //now we nows that query has at least 2 chars and first char is in key
        if (key.indexOf(query[0])%2 === 1)
            return false; //first char is in unused chars, so query isnt a original substring

        // now we nows that query has at least 2 chars and the first char is in used chars
        // so because the first char is used it cant be the last of key (cuz we alternate used/unused)
        //therefore the next char is or in unused chars or the whole query is in content
        return (key.indexOf(query[1]) === -1) || !(key.indexOf(query[1])%2 === 1); 
    }
    else if (file.unusedLen === 94) { //all chars are unused
        //so the key is made of only unused chars
        //therefore if the first char of query is in key, the query cant be original substring
        return key.indexOf(query[0]) === -1; 
    }
    else if (file.unusedLen === 0) { //all chars are used, but we found a good key
        // so the key is a single char that char + key[0] isnt a substring of original content
        if (query.length == 1) 
            // we got file from search so the char is or in the file or its the key char,
            // but the key char is also in the file 
            return true
        
        // so query has at least 2 chars, if the first two chars are the key char and title[0] then its not original
        // otherwise its original
        return !(query[0] === key[0] && query[1] === file.title.charAt(0));

    }
    else { // file.unusedLen == -1, couldnt find a good key, need to search in js 

        const result = await sendToEx2Server(`GET ${getStorageKey(file)}`);
        if (result.statusCode !== 200) { //error occurred
            throw { status: result.statusCode, message: result.statusLine };
        }
        return (result.bodyText.includes(query)) || (file.title.includes(query));
    }
}


const searchByQuery = async (query, userId) => {
    /*
        Call the search command in the file server with the query and set str as the output.
    */
    const result = await sendToEx2Server(`SEARCH ${query}`);
    if (result.statusCode !== 200) { //error occurred
        throw { status: result.statusCode, message: result.statusLine };
    }
    const storageKeys = result.bodyText.split(" ")

    // returning only the files/folders from the search that the user has read permissions.
    return files.filter(file => {
        const perm = file.permissions[userId];
        if (perm === undefined || (perm & 1) === 0) {
            return false
        }
        if (file.type === "file" && storageKeys.includes(getStorageKey(file))) {
            return validFileSearch(file, query);
        }
        if (file.type === "folder" && file.title.includes(query)) {
            return true
        }
        return false;
    })

    /*
        Note: need to search also for folders within folder list
    */
}

const moveFileToFolder = (fileId, folderId) => {
    const file = files.find(file => file.id === fileId);
    const oldFolderId = file.dir;
    file.dir = folderId;

    if (oldFolderId !== null) {
        const oldFolder = folders.find(f => f.filePtr && f.filePtr.id === oldFolderId);
        if (oldFolder) {
             oldFolder.listOfFiles = oldFolder.listOfFiles.filter(f => f.id !== fileId);
        }
    }
    if (folderId !== null) {
        const newFolder = folders.find(f => f.filePtr && f.filePtr.id === folderId);
        if (newFolder) {
            newFolder.listOfFiles.push(file);
        }
    }
}

const getAllStarredFiles = (userId) => files.filter(file => (file.permissions[userId] !== undefined && file.star[userId] === true));

const starFile = (fileId, userId) => {
    const file = files.find(file => file.id === fileId);

    file.star[userId] = true;
}

const unstarFile = (fileId, userId) => {
    const file = files.find(file => file.id === fileId);

    file.star[userId] = false;
}


const cleanupTrash = async () => {
    const now = new Date(); //current time

    for (let i = files.length - 1; i >= 0; i--) {
        const file = files[i];

        if (!file.trash[0]) continue; //not trashed

        const trashDate = new Date(file.trash[1]);
        if (now - trashDate > TRASH_RETENTION_MS) {
            // expired, so delete or remove permissions
            try {
                await deleteFile(file.id);
            } catch (err) {
                console.error(`Error deleting file ID ${file.id} during trash cleanup:`, err);
            }
        }
    }
}


        
const startTrashCleanup = async () => {
    // run cleanup immediately on startup
    await cleanupTrash();

    // schedule regular cleanup
    setInterval(cleanupTrash, CLEANUP_INTERVAL_MS);
}

const getAllTrashedFiles = (userId) => {
    const now = Date.now();

    return files.filter(file => {
        //permission/trash check
        if (file.permissions[userId] === undefined || !file.trash[0]) {
            return false;
        }

        //check expiration
        const trashDate = new Date(file.trash[1]);
        if (now - trashDate > TRASH_RETENTION_MS) {
            // expired so dont show to user
            //the real cleanup will be done in the cleanupTrash function
            return false;
        }

        return true;
    });
}

const getFileTrashStatus = (id) => {
    const file = files.find(file => file.id === id)

    return file.trash[0];
}

const visible = (id) => {
    const file = files.find(file => file.id === id)

    if (file.trash[0]) return false;

    let iter = file.dir;
    while (iter !== null) {
        const parent = files.find(f => f.id === iter);
        if (parent.trash[0]) return false;
        iter = parent.dir;
    }

    return true;
}

const trashFile = (id) => {
    const file = files.find(file => file.id === id)

    file.trash = [true, new Date()];
}

const untrashFile = (id) => {
    const file = files.find(file => file.id === id)

    file.trash = [false, null];
}


module.exports = { 
    startTrashCleanup,
    isExist,
    hasPermissions,
    isCreator,
    isFolder,
    getAllFiles,
    getFile,
    createFile,
    updateFile,
    deleteFile,
    getFilePermissions,
    createFilePermissions,
    updateFilePermissions,
    deleteFilePermissions,
    searchByQuery,
    getAllStarredFiles,
    starFile,
    unstarFile,
    getAllTrashedFiles,
    getFileTrashStatus,
    trashFile,
    untrashFile,
    moveFileToFolder,
    visible
}