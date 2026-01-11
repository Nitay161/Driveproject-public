import File from './File.js'
import { useState, useEffect } from 'react';
import { ListGroup, Breadcrumb, Button } from 'react-bootstrap';
import { fetchGetAllFiles } from '../../fetches';

function FileList() {
    const [files, setFiles] = useState([]);
    const [currentFolder, setCurrentFolder] = useState(null);

    // replace userID with the user id from the token
    const userId = 1;

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
            <File 
                id={f.id} 
                title={f.title} 
                type={f.type}
                isStarred={f.star[userId]} 
                creator={f.creator} 
                onNavigate={handleNavigate}
                onRefresh={loadFiles}
            />
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
