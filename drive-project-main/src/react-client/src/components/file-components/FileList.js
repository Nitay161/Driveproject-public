import File from './File.js'
import { useState, useEffect } from 'react';
import { ListGroup, Breadcrumb, Button } from 'react-bootstrap';
import { fetchGetAllFiles } from '../../fetches';

function FileList() {
    const [files, setFiles] = useState([]);
    const [currentFolder, setCurrentFolder] = useState(null);

    const userId = localStorage.getItem('token');

    // load all the files at any render
    const loadFiles = async () => {
        const data = await fetchGetAllFiles(userId);
        if (data) {
            setFiles(data);
        }
    };
    
    useEffect(() => {
        loadFiles();
    }, []);

    const handleNavigate = (folderId) => {
        setCurrentFolder(folderId);
    };

    const handleBack = () => {
        if (currentFolder === null) return;
        const currentFolderObj = files.find(f => f.id === currentFolder);
        if (currentFolderObj) {
            setCurrentFolder(currentFolderObj.dir);
        } else {
            setCurrentFolder(null);
        }
    };

    const filteredFiles = files.filter(f => f.dir === currentFolder);

    const listItems = filteredFiles.map((f, index) =>
        <ListGroup.Item key={f.id} className="p-0 border-0">
            { /* change f.creator here to the username of thee file creator */}
            {(() => {
                const directPerms = f.permissions ? f.permissions[userId] : undefined;
                const canWrite = directPerms !== undefined && (directPerms & 2) !== 0;
                return (
            <File 
                id={f.id} 
                title={f.title} 
                type={f.type}
                isStarred={f.star[userId]} 
                creator={f.creator} 
                canWrite={canWrite}
                onNavigate={handleNavigate}
                onRefresh={loadFiles}
            />
                );
            })()}
        </ListGroup.Item>
    );

    return (
        <div>
            {currentFolder !== null && (
                <div className="mb-2 ms-2">
                    <Button variant="outline-secondary" size="sm" onClick={handleBack}>
                        &larr; Back
                    </Button>
                </div>
            )}
            <ListGroup variant="flush">
                {listItems}
            </ListGroup>
        </div>
    );
}

export default FileList;
