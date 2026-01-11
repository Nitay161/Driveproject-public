import Permission from '../file-components/Permission'
import { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { fetchGetPerms } from '../../fetches';

function ManagePerms() {
    const { id } = useParams();
    const [perms, setPerms] = useState([]);

    // replace userID with the user id from the token
    const userId = 1;
    // load the file at any id change in the url
    useEffect(() => {
        const loadPerms = async () => {
            const data = await fetchGetPerms(id, userId);
            if (data) {
                setPerms(data);
            }
        };
        loadPerms();
    }, [id, perms]);
    

    // listing all the permissions
    const listItems = Object.entries(perms).map(([pId, perms]) => (
        <ListGroup.Item key={pId} className="p-0 border-0">
            <Permission fId={id} pId={pId} perms={perms} />
        </ListGroup.Item>
    ));

    return (
        <div>
            <ListGroup variant="flush">
                {listItems}
            </ListGroup>
        </div>
    );
}

export default ManagePerms;
