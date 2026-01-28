import File from '../file-components/File'
import { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { fetchGetAllFiles } from '../../fetches';

function SharedWithMe() {
    const [files, setFiles] = useState([]);

    const userId = localStorage.getItem('token');
    // loading all the files
    const loadFiles = async () => {
        const data = await fetchGetAllFiles(userId);
        if (data) {
            setFiles(data);
        }
    };
    
    useEffect(() => {
        loadFiles();
    }, []);

    // filtering the files so the user is not the creator and by that getting the "shared with me"
    const listItems = files
    .filter(f => f.creator !== userId)
    .map((f, index) =>
        <ListGroup.Item key={f.id} className="p-0 border-0">
            { /* change f.creator here to the username of thee file creator */}
            {(() => {
                const directPerms = f.permissions ? f.permissions[userId] : undefined;
                const canWrite = directPerms !== undefined && (directPerms & 2) !== 0;
                return (
            <File 
                id={f.id} 
                title={f.title} 
                isStarred={f.star[userId]} 
                creator={f.creator} 
                type={f.type} 
                canWrite={canWrite}
                onRefresh={loadFiles}
            />
                );
            })()}
        </ListGroup.Item>
    );

    return (
        <div>
            <ListGroup variant="flush">
                {listItems}
            </ListGroup>
        </div>
    );
}

export default SharedWithMe;
