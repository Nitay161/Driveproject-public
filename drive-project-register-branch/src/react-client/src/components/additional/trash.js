import { useState, useEffect } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { fetchGetAllTrashedFiles, fetchRestoreFile, fetchPermanentDeleteFile } from '../../fetches';

function Trash({id, title}) {
    const [files, setFiles] = useState([]);

    // replace userID with the id from the token
    const userId = 1;

    const loadFiles = async () => {
        const data = await fetchGetAllTrashedFiles(userId);
        if (data) {
            setFiles(data);
        }
    };

    useEffect(() => {
        loadFiles();
    }, []);

    const handleRestore = async (fileId) => {
        await fetchRestoreFile(fileId, userId);
        loadFiles();
    }

    const handlePermanentDelete = async (fileId) => {
        await fetchPermanentDeleteFile(fileId, userId);
        loadFiles();
    }
    
    const listItems = files.map((f, index) =>
        <ListGroup.Item key={f.id} className="p-3 border-bottom d-flex justify-content-between align-items-center">
             <div className="d-flex align-items-center">
                 <h6 className="mb-0">{f.title}</h6>
             </div>
             <div>
                <Button variant="outline-primary" className="me-2" onClick={() => handleRestore(f.id)}>Restore</Button>
                <Button variant="outline-danger" onClick={() => handlePermanentDelete(f.id)}>Delete Forever</Button>
             </div>
        </ListGroup.Item>
    );

    return (
        <div>
           <h4 className="mb-3 px-3 mt-3">Trash</h4>
            <ListGroup variant="flush">
                {listItems}
            </ListGroup>
        </div>
    );
}

export default Trash;
