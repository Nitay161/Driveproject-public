import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import BackBtn from '../../navigation/BackBtn';
import { fetchGetFile, fetchUpdateFile } from '../../fetches';

function EditFile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [file, setFile] = useState({});

    // refds for title and content.
    const titleRef = useRef();
    const contentRef = useRef();

    // replace the userID with the user id from the token.
    const userId = 1;

    // loading the file when the id is changed in the url
    useEffect(() => {
        const loadFile = async () => {
            const data = await fetchGetFile(id, userId);
            if (data) {
                setFile(data);
            }
        };
        loadFile();
    }, [id]);

    // getting the new title and content from the refs and updating the file
    const handleSave = async () => {
        const updatedTitle = titleRef.current.value;
        const updatedContent = contentRef.current ? contentRef.current.value : "";
        
        await fetchUpdateFile(id, userId, updatedTitle, updatedContent);
        navigate('/');
    };

    return (
        <div className="container mt-4">
            <Card className="shadow-sm p-4">
                <Form>
                    { /* form for the title input */ }
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                        type="text" 
                        ref={titleRef} 
                        defaultValue={file.title} 
                        />
                    </Form.Group>

                    { /* form for the title input */ }
                    {file.type === 'file' && (
                        <Form.Group className="mb-3">
                            <Form.Label>Content</Form.Label>
                            <Form.Control 
                            as="textarea" 
                            rows={5} 
                            ref={contentRef} 
                            defaultValue={file.content} 
                            />
                        </Form.Group>
                    )}

                    <BackBtn />
                    <Button variant="primary" onClick={handleSave}>Save</Button>
                </Form>
            </Card>
        </div>
    );
}

export default EditFile;