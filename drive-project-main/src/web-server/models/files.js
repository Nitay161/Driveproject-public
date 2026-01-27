const { getDb } = require("./db");
const { ObjectId } = require("mongodb");
const { sendToEx2Server } = require("../integration");
const UserModel = require('./users');


const MAX_KEY_LENGTH = 10;
const TRASH_RETENTION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // run cleanup every hour

const itemsCol = () => getDb().collection("items"); // files and folders
const foldersCol = () => getDb().collection("folders"); //only folders

const toObjectId = (id) => (typeof id === "string" ? new ObjectId(id) : id);


async function isExistById(id) {
    const _id = toObjectId(id);

    const item = await itemsCol().findOne({ _id }, { projection: { _id: 1 } }); //return only _id field
    return !!item;
}

async function isStorageKeyUnique(key) {
    const item = await itemsCol().findOne({ storageKey: key }, { projection: { _id: 1 } });

    return !item;
}

async function hasPermissions (id, userId, perms) {
    const file = await itemsCol().findOne({ _id: toObjectId(id) }, { projection: { permissions: 1 } });
    if (!file || !file.permissions || file.permissions[userId] == undefined) return false;

    return file.permissions[userId] & perms;
}

async function isCreator (id, userId) {
    const file = await itemsCol().findOne({ _id: toObjectId(id) }, { projection: { creator: 1 } });
    if (!file) return false;

    return file.creator === userId;
}

async function isFolder (id) {
    const folder = await itemsCol().findOne({ _id: toObjectId(id) }, { projection: { type: 1 } });
    if (!folder) return false;

    return folder.type === 'folder';
}

function convertToStringId(item) {
    const { _id, ...rest } = item;
    return { id: String(_id), ...rest };
}

async function formatFileForClient(file) { //receive file in regular form not mongo form
    const user = await UserModel.findById(file.creator);
    if (!user) {
        console.log(` User not found. file.creator: '${file.creator}'`);
    }
    return {
        ...file,
        creator: file.creator,
        creatorId: file.creator,
        creatorName: user ? user.username : String(file.creator)
    };
}

async function getAllFiles(userId) {
    const files = await itemsCol().find({ 
        [`permissions.${userId}`]: { $exists: true },
        $or: [
            { 'trash.0': false },
            { 'trash.0': { $exists: false } }
        ]
    }).toArray();
    
    // Filter visible files
    const visibleFiles = [];
    for (const file of files) {
        if (await visible(convertToStringId(file).id)) {
            visibleFiles.push(file);
        }
    }
    
    return Promise.all(visibleFiles.map(convertToStringId).map(formatFileForClient));
}

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

async function generateKey(title, content, maxLength) {
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
    if (await isStorageKeyUnique(key+title)) //if the file name is already unique
        return {key, unusedLen};

    if (usedLen > 0 && unusedLen > 0) {
        while (true) {
            for (let i = 0; i < maxLength/2; i++) {
                key += usedChars[randomInt(usedLen)];
                key += unusedChars[randomInt(unusedLen)];

                if (await isStorageKeyUnique(key+title)) 
                    return {key, unusedLen};
            }
            key = "";
        }
    } else if (usedLen == 0) {
        while (true) {
            for (let i = 0; i < maxLength; i++) {
                key += unusedChars[randomInt(unusedLen)];

                if (await isStorageKeyUnique(key+title)) 
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
                if (await isStorageKeyUnique(key+title)) 
                    return {key, unusedLen};
            } else {
                const indexC = charMap[c];
                const indexFirst = charMap[first];

                for (let j = 0; j < indexC.length; j++) {
                    if (!indexFirst.includes(Math.min(indexC[j] + 1, combined.length - 1))) {
                        key = c;
                        if (await isStorageKeyUnique(key+title)) 
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

                if (await isStorageKeyUnique(key+title)) 
                    return {key, unusedLen: -1}; //-1 indicates we couldnt find a good key
            }
            key = "";
        }
    }
}

function getStorageKey(file) {
    // Sanitize title to avoid spaces breaking the Ex2 protocol
    return file.key + file.title.replace(/\s+/g, '_');
}

async function createFile(title, content, type, userId) {
    /*
        Call the file server and provide (title, content) to create the file (or folder if type == "folder")!
    */
    let result, key = "", unusedLen = 0;
    if (type == "file"){
        const keyData = await generateKey(title, content, MAX_KEY_LENGTH);
        key = keyData.key;
        unusedLen = keyData.unusedLen;

        const storageIdentifier = key + title.replace(/\s+/g, '_');
        result = await sendToEx2Server(`POST ${storageIdentifier} ${content}`);

        if (result.statusCode !== 201) 
            throw { status: result.statusCode, message: result.statusLine };
    }
    
    const newFile = { 
        title, 
        type, 
        creator: userId, 
        permissions: { [userId]: 7 }, 
        star: { [userId]: false }, 
        trash: [false, null], 
        last: new Date(), 
        dir: null, 
        key, 
        unusedLen,
        storageKey: key + title.replace(/\s+/g, '_')
    };
    
    const insertResult = await itemsCol().insertOne(newFile);
    newFile._id = insertResult.insertedId;

    if (type === "folder") {
        await foldersCol().insertOne({ 
            filePtr: insertResult.insertedId, 
            listOfFiles: [] 
        });
    }

    return formatFileForClient(convertToStringId(newFile));
}

async function getFile(id) {
    const file = await itemsCol().findOne({ _id: toObjectId(id) });
    if (!file) throw { status: 404, message: "File not found" };

    if (file.type === "folder") {
        const folder = await foldersCol().findOne({ filePtr: toObjectId(id) });
        const formatted = await formatFileForClient(convertToStringId(file));
        return {
            ...formatted,
            listOfFiles: folder && Array.isArray(folder.listOfFiles)
                ? folder.listOfFiles.map((childId) => String(childId))
                : []
        };
    }

    /*
        Call the file server with file.title and insert the text into str...
    */
    const result = await sendToEx2Server(`GET ${getStorageKey(file)}`);
    if (result.statusCode !== 200) { //error occurred
        throw { status: result.statusCode, message: result.statusLine };
    }

    return { ...await formatFileForClient(convertToStringId(file)), content: result.bodyText }
}

async function updateFile(id, title, content) {
    const file = await itemsCol().findOne({ _id: toObjectId(id) });
    if (!file) throw { status: 404, message: "File not found" };

    // Folders are local-only; renaming them should not call the external TCP server.
    if (file.type === "folder") {
        await itemsCol().updateOne({ _id: toObjectId(id) }, { $set: { title } });
        return;
    }

    // delete old entry in external server and recreate with new title/content
    const delRes = await sendToEx2Server(`DELETE ${getStorageKey(file)}`);
    if (delRes.statusCode !== 204) {
        throw { status: delRes.statusCode, message: delRes.statusLine };
    }

    // generate new key
    const keyData = await generateKey(title, content, MAX_KEY_LENGTH);
    const newKey = keyData.key;
    const newUnusedLen = keyData.unusedLen;
    const newStorageKey = newKey + title.replace(/\s+/g, '_');

    const createRes = await sendToEx2Server(`POST ${newStorageKey} ${content}`);
    if (createRes.statusCode !== 201) {
        throw { status: createRes.statusCode, message: createRes.statusLine };
    }

    await itemsCol().updateOne(
        { _id: toObjectId(id) }, 
        { $set: { title, key: newKey, unusedLen: newUnusedLen, storageKey: newStorageKey, last: new Date() } }
    );
}

async function deleteFile(id, userId) {
    const file = await itemsCol().findOne({ _id: toObjectId(id) });
    if (!file) return; // Already deleted or not found

    // Detach from parent folder if needed - must be done before deleting the file!
    if (file.dir !== null) {
        const parentFolder = await foldersCol().findOne({ filePtr: toObjectId(file.dir) });
        if (parentFolder) {
            await foldersCol().updateOne(
                { filePtr: toObjectId(file.dir) },
                { $pull: { listOfFiles: toObjectId(id) } }
            );
        }
    }
    
    if (file.type === "folder") {
        // remove all files in the folder
        const folder = await foldersCol().findOne({ filePtr: toObjectId(id) });
        
        if (folder) {
            // Create a copy of the list to iterate safely while deleting
            const children = [...folder.listOfFiles];
            for (const childId of children) {
                await deleteFile(childId, userId);
            }
            await foldersCol().deleteOne({ filePtr: toObjectId(id) });
        }

        // finally remove the folder itself
        await itemsCol().deleteOne({ _id: toObjectId(id) });
        return;
    }

    const resultDel = await sendToEx2Server(`DELETE ${getStorageKey(file)}`);
    if (resultDel.statusCode !== 204) { //error occurred
        throw { status: resultDel.statusCode, message: resultDel.statusLine };
    }

    await itemsCol().deleteOne({ _id: toObjectId(id) });
}

async function getFilePermissions(id) {
    const file = await itemsCol().findOne({ _id: toObjectId(id) }, { projection: { permissions: 1 } });
    if (!file) throw { status: 404, message: "File not found" };

    return file.permissions;
}

async function createFilePermissions(id, pid, perms) {
    const file = await itemsCol().findOne({ _id: toObjectId(id) });
    if (!file) throw { status: 404, message: "File not found" };

    if (file.type === "folder") {
        // add permissions to all files in the folder
        const folder = await foldersCol().findOne({ filePtr: toObjectId(id) });
        if (folder) {
            for (const childId of folder.listOfFiles) {
                await createFilePermissions(childId, pid, perms);
            }
        }
    }

    await itemsCol().updateOne(
        { _id: toObjectId(id) },
        { $set: { [`permissions.${pid}`]: perms, [`star.${pid}`]: false } }
    );
}

async function updateFilePermissions(id, pid, perms) {
    const file = await itemsCol().findOne({ _id: toObjectId(id) });
    if (!file) throw { status: 404, message: "File not found" };

    if (file.type === "folder") {
        // update permissions to all files in the folder
        const folder = await foldersCol().findOne({ filePtr: toObjectId(id) });
        if (folder) {
            for (const childId of folder.listOfFiles) {
                await updateFilePermissions(childId, pid, perms);
            }
        }
    }

    await itemsCol().updateOne(
        { _id: toObjectId(id) },
        { $set: { [`permissions.${pid}`]: perms } }
    );
}

async function deleteFilePermissions(id, pid) {
    const file = await itemsCol().findOne({ _id: toObjectId(id) });
    if (!file) throw { status: 404, message: "File not found" };

    if (file.type === "folder") {
        // delete permissions to all files in the folder
        const folder = await foldersCol().findOne({ filePtr: toObjectId(id) });
        if (folder) {
            for (const childId of folder.listOfFiles) {
                await deleteFilePermissions(childId, pid);
            }
        }
    }

    await itemsCol().updateOne(
        { _id: toObjectId(id) },
        { $unset: { [`permissions.${pid}`]: "", [`star.${pid}`]: "" } }
    );
}

//assume the given file StorageKey returned in the search
async function validFileSearch(file, query) {
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

async function searchByQuery(query, userId) {
    /*
        Call the search command in the file server with the query and set str as the output.
    */
    const result = await sendToEx2Server(`SEARCH ${query}`);
    if (result.statusCode !== 200) { //error occurred
        throw { status: result.statusCode, message: result.statusLine };
    }
    const storageKeys = result.bodyText.split(" ");

    // returning only the files/folders from the search that the user has read permissions.
    const allFiles = await itemsCol().find({}).toArray();
    
    const matchingFiles = [];
    for (const file of allFiles) {
        const perm = file.permissions ? file.permissions[userId] : undefined;
        if (perm === undefined || (perm & 1) === 0) {
            continue;
        }
        if (file.type === "file" && storageKeys.includes(getStorageKey(file))) {
            if (await validFileSearch(file, query)) {
                matchingFiles.push(file);
            }
        }
        if (file.type === "folder" && file.title.includes(query)) {
            matchingFiles.push(file);
        }
    }

    return Promise.all(matchingFiles.map(convertToStringId).map(formatFileForClient));
}

async function moveFileToFolder(fileId, folderId) {
    const file = await itemsCol().findOne({ _id: toObjectId(fileId) });
    if (!file) throw { status: 404, message: "File not found" };

    const oldFolderId = file.dir;

    if (oldFolderId !== null) {
        await foldersCol().updateOne(
            { filePtr: toObjectId(oldFolderId) },
            { $pull: { listOfFiles: toObjectId(fileId) } }
        );
    }
    
    if (folderId !== null) {
        await foldersCol().updateOne(
            { filePtr: toObjectId(folderId) },
            { $push: { listOfFiles: toObjectId(fileId) } }
        );
    }

    await itemsCol().updateOne(
        { _id: toObjectId(fileId) },
        { $set: { dir: folderId } }
    );
}

async function getAllStarredFiles(userId) {
    const files = await itemsCol().find({ 
        [`permissions.${userId}`]: { $exists: true },
        [`star.${userId}`]: true
    }).toArray();
    
    return Promise.all(files.map(convertToStringId).map(formatFileForClient));
}

async function starFile(fileId, userId) {
    await itemsCol().updateOne(
        { _id: toObjectId(fileId) },
        { $set: { [`star.${userId}`]: true } }
    );
}

async function unstarFile(fileId, userId) {
    await itemsCol().updateOne(
        { _id: toObjectId(fileId) },
        { $set: { [`star.${userId}`]: false } }
    );
}

async function cleanupTrash() {
    const now = new Date(); //current time

    const trashedFiles = await itemsCol().find({ 'trash.0': true }).toArray();

    for (const file of trashedFiles) {
        if (!file.trash[0]) continue; //not trashed

        const trashDate = new Date(file.trash[1]);
        if (now - trashDate > TRASH_RETENTION_MS) {
            // expired, so delete
            try {
                await deleteFile(String(file._id));
            } catch (err) {
                console.error(`Error deleting file ID ${file._id} during trash cleanup:`, err);
            }
        }
    }
}

async function startTrashCleanup() {
    // run cleanup immediately on startup
    await cleanupTrash();

    // schedule regular cleanup
    setInterval(cleanupTrash, CLEANUP_INTERVAL_MS);
}

async function getAllTrashedFiles(userId) {
    const now = Date.now();

    const files = await itemsCol().find({ 
        [`permissions.${userId}`]: { $exists: true },
        'trash.0': true
    }).toArray();

    const validFiles = [];
    for (const file of files) {
        //check expiration
        const trashDate = new Date(file.trash[1]);
        if (now - trashDate <= TRASH_RETENTION_MS) {
            validFiles.push(file);
        }
    }

    return Promise.all(validFiles.map(convertToStringId).map(formatFileForClient));
}

async function getFileTrashStatus(id) {
    const file = await itemsCol().findOne({ _id: toObjectId(id) }, { projection: { trash: 1 } });
    if (!file) throw { status: 404, message: "File not found" };

    return file.trash[0];
}

async function visible(id) {
    const file = await itemsCol().findOne({ _id: toObjectId(id) });
    if (!file) return false;

    if (file.trash && file.trash[0]) return false;

    let iter = file.dir;
    while (iter !== null) {
        const parent = await itemsCol().findOne({ _id: toObjectId(iter) });
        if (!parent) return false;
        if (parent.trash && parent.trash[0]) return false;
        iter = parent.dir;
    }

    return true;
}

async function trashFile(id) {
    await itemsCol().updateOne(
        { _id: toObjectId(id) },
        { $set: { trash: [true, new Date()] } }
    );
}

async function untrashFile(id) {
    await itemsCol().updateOne(
        { _id: toObjectId(id) },
        { $set: { trash: [false, null] } }
    );
}

module.exports = { 
    startTrashCleanup,
    isExist: isExistById,
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