import { Link, useParams } from 'react-router-dom';
import { useRef } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import BackBtn from '../../navigation/BackBtn';
import { fetchAddPerms } from '../../fetches';

function Share() {
    const { id } = useParams();
    // refs for the pId and read,write,delete perms.
    const pidRef = useRef();
    const readRef = useRef();
    const writeRef = useRef();
    const deleteRef = useRef();

    // replace userId with the user id from the token
    const userId = 1;

    // getting the refs and creating the permission
    const handleSave = () => {
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
                    
                    <Form>
                        <Form.Group className="mb-4">
                        <Form.Label>User</Form.Label>
                        { /* input for the user pId - maybe change with the username */ }
                        <Form.Control
                            type="text"
                            ref={pidRef}
                            className="py-2"
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
                            <Button as={Link} to="/" variant="primary" onClick={handleSave}>Add</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Share;