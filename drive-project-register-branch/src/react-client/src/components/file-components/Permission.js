import React, { useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import { fetchDeletePerms, fetchUpdatePerms } from '../../fetches';

function Permission({fId, pId, perms}) {
    // refs for read,write,delete permissions
    const readRef = useRef();
    const writeRef = useRef();
    const deleteRef = useRef();

    // replace userID with the user id from the token
    const userId = 1
    // delete the permission
    const handleDeletePerms = () => {
        fetchDeletePerms(fId, userId, pId);
    };

    // get the refs (from the checkboxes) and updating the permission
    const handleUpdatePerms = () => {
        let newPerms = 0;
        if (readRef.current.checked) newPerms += 1;
        if (writeRef.current.checked) newPerms += 2;
        if (deleteRef.current.checked) newPerms += 4;

        fetchUpdatePerms(fId, userId, pId, newPerms);
    };

    return (
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom file-row">
        <div className="d-flex align-items-center">
            <h6 className="mb-0">User: {pId}</h6>
        </div>

        <div className="d-flex align-items-center gap-3">
            { /* checkbox for read permission */}
            <Form.Check 
                type="checkbox"
                label="Read"
                ref={readRef}
                defaultChecked={(perms & 1) !== 0}
            />
            { /* checkbox for write permission */}
            <Form.Check 
                type="checkbox"
                label="Write"
                ref={writeRef}
                defaultChecked={(perms & 2) !== 0}
            />
            { /* checkbox for delete permission */}
            <Form.Check 
                type="checkbox"
                label="Delete"
                ref={deleteRef}
                defaultChecked={(perms & 4) !== 0}
            />

            { /* update the permissions */}
            <Button variant="outline-primary" size="sm" onClick={handleUpdatePerms}>
                Save
            </Button>
            { /* delete the permissions */}
            <Button variant="outline-primary" className="text-danger" size="sm" onClick={handleDeletePerms}>
                Delete
            </Button>
        </div>
        </div>
    );
}

export default Permission;
