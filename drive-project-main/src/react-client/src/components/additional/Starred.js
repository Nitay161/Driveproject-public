import File from '../file-components/File'
import { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { fetchGetAllFiles } from '../../fetches';

function Starred({id, title}) {
    const [files, setFiles] = useState([]);

    const userId = localStorage.getItem('token');

    // loading the files.
    const loadFiles = async () => {
        const data = await fetchGetAllFiles(userId);
        if (data) {
            setFiles(data);
        }
    };
    
    useEffect(() => {
        loadFiles();
    }, []);
    
    // filtering the files by checking if the user has stared the file
    const listItems = files
    .filter(f => f.star[userId] === true)
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
                isStarred={true} 
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

export default Starred;
