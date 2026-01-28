const fetchDeleteFile = async (id, userId) => {
    try {
        await fetch(`${SERVER_URL}/api/files/`+id, {
            'method': 'delete',
            'headers': { 
                'Content-Type': 'application/json',
                'User-Id': `${userId}`
            },
        });
    } catch (error) {
        console.error("Error fetching:", error);
    }
};

const fetchGetAllFiles = async (userId) => {
    try {
        const response = await fetch(`${SERVER_URL}/api/files`, {
            'method': 'get',
            'headers': { 'User-Id': `${userId}` }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching:", error);
    }
};

const fetchGetAllTrashedFiles = async (userId) => {
    try {
        const response = await fetch(`${SERVER_URL}/api/files/trash`, {
            'method': 'get',
            'headers': { 'User-Id': `${userId}` }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching:", error);
    }
};

const fetchGetFile = async (id, userId) => {
    try {
        const response = await fetch(`${SERVER_URL}/api/files/'+id`, {
            'method': 'get',
            'headers': { 'User-Id': `${userId}` }
        });
        const file = await response.json()
        return file
    } catch (error) {
        console.error("Error fetching:", error);
    }
};

const fetchUpdateFile = async (id, userId, updatedTitle, updatedContent) => {
    try {
        const data = {
            title: `${updatedTitle}`,
            content: `${updatedContent}`
        }
        await fetch(`${SERVER_URL}/api/files/'+id`, {
            'method': 'PATCH',
            'headers': { 
                'Content-Type': 'application/json',
                'User-Id': `${userId}`
            },
            'body': JSON.stringify(data)
        });
    } catch (error) {
        console.error("Error fetching:", error);
    }
};

const fetchCreateFile = async (userId, title, content, type = 'file') => {
    try {
        const data = {
            title: `${title}`,
            content: `${content}`,
            type: `${type}`
        }
        await fetch(`${SERVER_URL}/api/files`, {
            'method': 'post',
            'headers': { 
                'Content-Type': 'application/json',
                'User-Id': `${userId}`
            },
            'body': JSON.stringify(data)
        });
    } catch (error) {
        console.error("Error fetching:", error);
    }
};

const fetchMoveFile = async (id, userId, folderId) => {
    try {
        const data = {
            folderId: folderId
        }
        await fetch(`${SERVER_URL}/api/files/'+id+'/move`, {
            'method': 'PATCH',
            'headers': { 
                'Content-Type': 'application/json',
                'User-Id': `${userId}`
            },
            'body': JSON.stringify(data)
        });
    } catch (error) {
        console.error("Error fetching:", error);
    }
};


const fetchGetPerms = async (id, userId) => {
    try {
        const response = await fetch(`${SERVER_URL}/api/files/`+id+'/permissions', {
            'method': 'get',
            'headers': { 'User-Id': `${userId}` }
        });
        const perms = await response.json()
        return perms
    } catch (error) {
        console.error("Error fetching:", error);
    }
};

const fetchDeletePerms = async (id, userId, pId) => {
    try {
        await fetch(`${SERVER_URL}/api/files/`+id+'/permissions/'+pId, {
            'method': 'delete',
            'headers': { 
                'Content-Type': 'application/json',
                'User-Id': `${userId}`
            },
        });
    } catch (error) {
        console.error("Error fetching:", error);
    }
};

const fetchUpdatePerms = async (id, userId, pId, newPerms) => {
    try {
        const data = {
            perms: `${newPerms}`
        }
        await fetch(`${SERVER_URL}/api/files/`+id+'/permissions/'+pId, {
            'method': 'PATCH',
            'headers': { 
                'Content-Type': 'application/json',
                'User-Id': `${userId}`
            },
            'body': JSON.stringify(data)
        });
    } catch (error) {
        console.error("Error fetching:", error);
    }
};

const fetchAddPerms = async (id, userId, pId, perms) => {
    try {
        const data = {
            pid: `${pId}`,
            perms: `${perms}`
        }
        await fetch(`${SERVER_URL}/api/files/`+id+'/permissions', {
            'method': 'post',
            'headers': { 
                'Content-Type': 'application/json',
                'User-Id': `${userId}`
            },
            'body': JSON.stringify(data)
        });
    } catch (error) {
        console.error("Error fetching:", error);
    }
};

const fetchStarFile = async (id, userId) => {
    try {
        await fetch(`${SERVER_URL}/api/files/starred/`+id, {
            'method': 'post',
            'headers': { 
                'Content-Type': 'application/json',
                'User-Id': `${userId}`
            },
        });
    } catch (error) {
        console.error("Error fetching:", error);
    }
};

const fetchUnStarFile = async (id, userId) => {
    try {
        await fetch(`${SERVER_URL}/api/files/starred/`+id, {
            'method': 'delete',
            'headers': { 
                'Content-Type': 'application/json',
                'User-Id': `${userId}`
            },
        });
    } catch (error) {
        console.error("Error fetching:", error);
    }
};

const fetchRestoreFile = async (id, userId) => {
    try {
        await fetch(`'${SERVER_URL}/api/files/`+id+'/restore', {
            'method': 'post',
            'headers': { 
                'Content-Type': 'application/json',
                'User-Id': `${userId}`
            },
        });
    } catch (error) {
        console.error("Error fetching:", error);
    }
};

const fetchPermanentDeleteFile = async (id, userId) => {
    try {
        await fetch(`${SERVER_URL}/api/files/`+id+'/permanent', {
            'method': 'delete',
            'headers': { 
                'Content-Type': 'application/json',
                'User-Id': `${userId}`
            },
        });
    } catch (error) {
        console.error("Error fetching:", error);
    }
};

const fetchSearchFiles = async (userId, query) => {
    try {
        const response = await fetch(`${SERVER_URL}/api/search/` + query, {
            'method': 'get',
            'headers': { 'User-Id': `${userId}` }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching:", error);
    }
};

const fetchGetUser = async (userId) => {
    try {
        const response = await fetch(`${SERVER_URL}/api/users/` + userId, {
            'method': 'get'
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        return null;
    } catch (error) {
        console.error("Error fetching:", error);
    }
};

export {
    fetchDeleteFile,
    fetchGetAllFiles,
    fetchGetFile,
    fetchUpdateFile,
    fetchCreateFile,
    fetchGetPerms,
    fetchDeletePerms,
    fetchUpdatePerms,
    fetchAddPerms,
    fetchStarFile,
    fetchUnStarFile,
    fetchRestoreFile,
    fetchPermanentDeleteFile,
    fetchGetAllTrashedFiles,
    fetchMoveFile,
    fetchSearchFiles,
    fetchGetUser
}