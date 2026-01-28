import Permission from '../file-components/Permission'
import { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchGetFile, fetchGetPerms } from '../../fetches';

function ManagePerms() {
    const { id } = useParams();
    const [perms, setPerms] = useState([]);
    const [isAllowed, setIsAllowed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const userId = localStorage.getItem('token');
    // load the file at any id change in the url
    useEffect(() => {
        const loadPerms = async () => {
            setIsLoading(true);

            const file = await fetchGetFile(id, userId);
            const creatorId = file && (file.creatorId ?? file.creator);
            const allowed = creatorId !== undefined && String(creatorId) === String(userId);
            setIsAllowed(allowed);

            if (!allowed) {
                setIsLoading(false);
                navigate('/', { replace: true });
                return;
            }

            const data = await fetchGetPerms(id, userId);
            if (data) setPerms(data);
            setIsLoading(false);
        };
        loadPerms();
    }, [id, userId, navigate]);
    

    // listing all the permissions
    const listItems = Object.entries(perms).map(([pId, perms]) => (
        <ListGroup.Item key={pId} className="p-0 border-0">
            <Permission fId={id} pId={pId} perms={perms} />
        </ListGroup.Item>
    ));

    return (
        <div>
            {isLoading && <div className="text-muted p-3">Loading...</div>}
            {!isLoading && !isAllowed && <div className="text-danger p-3">Not authorized</div>}
            <ListGroup variant="flush">
                {listItems}
            </ListGroup>
        </div>
    );
}

export default ManagePerms;
