import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import BackBtn from '../../navigation/BackBtn';
import { fetchGetAllFiles, fetchMoveFile } from '../../fetches';

function MoveToFolder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(""); 
    const userId = 1;

    useEffect(() => {
        const loadFiles = async () => {
            const data = await fetchGetAllFiles(userId);
            if (data) {
                // Filter only folders and exclude current file
                const validFolders = data.filter(f => f.type === 'folder' && f.id !== parseInt(id));
                setFolders(validFolders);
            }
        };
        loadFiles();
    }, [id]);

    const handleMove = async () => {
        if (selectedFolder !== "") {
            await fetchMoveFile(id, userId, parseInt(selectedFolder));
            navigate('/');
        }
    };

    return (
        <div className="container mt-4">
            <Card className="shadow-sm p-4">
                <h4 className="mb-3">Move to Folder</h4>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Select Destination</Form.Label>
                        <Form.Select 
                            value={selectedFolder} 
                            onChange={(e) => setSelectedFolder(e.target.value)}
                        >
                            <option value="">Choose a folder...</option>
                            {folders.map(f => (
                                <option key={f.id} value={f.id}>{f.title}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <div className="d-flex justify-content-between">
                        <BackBtn />
                        <Button variant="primary" onClick={handleMove} disabled={selectedFolder === ""}>
                            Move Here
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
}

export default MoveToFolder;
