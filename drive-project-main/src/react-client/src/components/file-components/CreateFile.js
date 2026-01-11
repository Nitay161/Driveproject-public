import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import BackBtn from '../../navigation/BackBtn';
import { fetchCreateFile } from '../../fetches';

function CreateFile() {
    // refs for title and content
    const titleRef = useRef();
    const contentRef = useRef();
    const [type, setType] = useState('file');
    const navigate = useNavigate();

    // replace userID with the user id from the token
    const userId = 1;

    // getting title and content from the refs and creating new file
    const handleSave = async () => {
        const title = titleRef.current.value;
        const content = contentRef.current ? contentRef.current.value : "";
        
        await fetchCreateFile(userId, title, content, type);
        navigate('/');
    };

    return (
        <div className="container mt-4">
            <Card className="shadow-sm p-4">
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Type</Form.Label>
                        <Form.Select 
                            value={type} 
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="file">File</option>
                            <option value="folder">Folder</option>
                        </Form.Select>
                    </Form.Group>

                    { /* form for the title input */ }
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                        type="text" 
                        ref={titleRef}  
                        />
                    </Form.Group>

                    { /* form for the content input */ }
                    {type === 'file' && (
                        <Form.Group className="mb-3">
                            <Form.Label>Content</Form.Label>
                            <Form.Control 
                            as="textarea" 
                            rows={5} 
                            ref={contentRef} 
                            />
                        </Form.Group>
                    )}

                    <BackBtn />
                    <Button variant="primary" onClick={handleSave}>Add</Button>
                </Form>
            </Card>
        </div>
    );
}

export default CreateFile;