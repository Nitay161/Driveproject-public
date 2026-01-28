const safeReadJson = async (response) => {
    try {
        return await response.json();
    } catch {
        return null;
    }
};

const handleAuthError = (data) => {
    if (data && typeof data === 'object' && data.error === 'Invalid User-Id') {
        try {
            localStorage.removeItem('token');
        } catch {
            // ignore
        }
        if (typeof window !== 'undefined') {
            window.location.assign('/login');
        }
    }
};
const fetchDeleteFile = async (id, userId) => {
    try {
        await fetch('http://localhost:5000/api/files/'+id, {
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
        const response = await fetch('http://localhost:5000/api/files', {
            'method': 'get',
            'headers': { 'User-Id': `${userId}` }
        });
        const data = await safeReadJson(response)
        if (!response.ok) {;
            handleAuthError(data);
            return [];
        }
        return data;
    } catch (error) {
        console.error("Error fetching:", error);
        return [];
    }
};

const fetchGetAllTrashedFiles = async (userId) => {
    try {
        const response = await fetch('http://localhost:5000/api/files/trash', {
            'method': 'get',
            'headers': { 'User-Id': `${userId}` }
        });
        const data = await safeReadJson(response)
        if (!response.ok) {;
            handleAuthError(data);
            return [];
        }
        return data;
    } catch (error) {
        console.error("Error fetching:", error);
        return [];
    }
};

const fetchGetFile = async (id, userId) => {
    try {
        const response = await fetch('http://localhost:5000/api/files/'+id, {
            'method': 'get',
            'headers': { 'User-Id': `${userId}` }
        });
        const file = await safeReadJson(response);
        if (!response.ok) {
            handleAuthError(file);
            return null;
        }
        return file
    } catch (error) {
        console.error("Error fetching:", error);
        return null;
    }
};

const fetchUpdateFile = async (id, userId, updatedTitle, updatedContent) => {
    try {
        const data = {
            title: `${updatedTitle}`,
            content: `${updatedContent}`
        }
        await fetch('http://localhost:5000/api/files/'+id, {
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
        await fetch('http://localhost:5000/api/files', {
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
        await fetch('http://localhost:5000/api/files/'+id+'/move', {
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
        const response = await fetch('http://localhost:5000/api/files/'+id+'/permissions', {
            'method': 'get',
            'headers': { 'User-Id': `${userId}` }
        });
        const perms = await safeReadJson(response);
        if (!response.ok) {
            handleAuthError(perms);
            return null;
        }
        return perms
    } catch (error) {
        console.error("Error fetching:", error);
        return null;
    }
};

const fetchDeletePerms = async (id, userId, pId) => {
    try {
        await fetch('http://localhost:5000/api/files/'+id+'/permissions/'+pId, {
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
        await fetch('http://localhost:5000/api/files/'+id+'/permissions/'+pId, {
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
        await fetch('http://localhost:5000/api/files/'+id+'/permissions', {
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
        await fetch('http://localhost:5000/api/files/starred/'+id, {
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
        await fetch('http://localhost:5000/api/files/starred/'+id, {
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
        await fetch('http://localhost:5000/api/files/'+id+'/restore', {
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
        await fetch('http://localhost:5000/api/files/'+id+'/permanent', {
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
        const response = await fetch(`http://localhost:5000/api/search/` + query, {
            'method': 'get',
            'headers': { 'User-Id': `${userId}` }
        });
        const data = await safeReadJson(response);
        if (!response.ok) {
            handleAuthError(data);
            return [];
        }
        return data;
    } catch (error) {
        console.error("Error fetching:", error);
        return [];
    }
};

const fetchGetUser = async (userId) => {
    try {
        const response = await fetch('http://localhost:5000/api/users/' + userId, {
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