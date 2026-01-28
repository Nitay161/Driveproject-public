import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import BackBtn from '../../navigation/BackBtn';
import { fetchAddPerms, fetchGetFile } from '../../fetches';

function Share() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isAllowed, setIsAllowed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    // refs for the pId and read,write,delete perms.
    const pidRef = useRef();
    const readRef = useRef();
    const writeRef = useRef();
    const deleteRef = useRef();

    const userId = localStorage.getItem('token');

    // Only the creator can access Share
    useEffect(() => {
        const checkOwner = async () => {
            setIsLoading(true);
            const file = await fetchGetFile(id, userId);

            // If API returns an error object, treat as not allowed
            const creatorId = file && (file.creatorId ?? file.creator);
            const allowed = creatorId !== undefined && String(creatorId) === String(userId);

            setIsAllowed(allowed);
            setIsLoading(false);

            if (!allowed) {
                navigate('/', { replace: true });
            }
        };
        checkOwner();
    }, [id, userId, navigate]);

    // getting the refs and creating the permission
    const handleSave = () => {
        if (!isAllowed) return;
        let perms = 0;
        if (readRef.current.checked) perms += 1;
        if (writeRef.current.checked) perms += 2;
        if (deleteRef.current.checked) perms += 4;
        const pid = pidRef.current.value;

        fetchAddPerms(id, userId, pid, perms);
    };

    return (
        <div className="container mt-4 d-flex justify-content-center">
            <Card className="shadow-sm border-0">
                <Card.Body className="p-4">
                    <h5 className="mb-4 fw-bold">Share with others</h5>

                    {isLoading && <div className="text-muted mb-3">Loading...</div>}
                    
                    <Form>
                        <Form.Group className="mb-4">
                        <Form.Label>Username</Form.Label>
                        { /* input for the username */ }
                        <Form.Control
                            type="text"
                            ref={pidRef}
                            className="py-2"
                            placeholder="e.g. alice"
                        />
                        </Form.Group>

                        <div className="mb-4">
                            <Form.Label>
                                Permissions
                            </Form.Label>
                            <div className="d-flex justify-content-between p-3 bg-secondary-subtle rounded shadow-sm">
                                { /* checkbox for read permission */}
                                <Form.Check 
                                    type="checkbox"
                                    label="Read"
                                    ref={readRef}
                                />
                                { /* checkbox for write permission */}
                                <Form.Check 
                                    type="checkbox"
                                    label="Write"
                                    ref={writeRef}
                                />
                                { /* checkbox for delete permission */}
                                <Form.Check 
                                    type="checkbox"
                                    label="Delete"
                                    ref={deleteRef}
                                />
                            </div>
                        </div>

                        <div className="d-flex justify-content-center mt-4 pt-2 border-top">
                            <BackBtn />
                            <Button as={Link} to="/" variant="primary" onClick={handleSave} disabled={!isAllowed || isLoading}>Add</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Share;