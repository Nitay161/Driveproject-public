import { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchDeleteFile, fetchStarFile, fetchUnStarFile, fetchGetUser } from '../../fetches';

function File({id, title, isStarred, creator, type, date, canWrite, onNavigate, onRefresh}) {
    const userId = localStorage.getItem('token');
    const [creatorName, setCreatorName] = useState(creator);
    const isOwner = String(creator) === String(userId);

    useEffect(() => {
        const loadCreator = async () => {
            if (creator) {
                const user = await fetchGetUser(creator);
                if (user && user.username) {
                    setCreatorName(user.username);
                }
            }
        };
        loadCreator();
    }, [creator]);

    // deleting the file
    const handleDelete = async () => {
        await fetchDeleteFile(id, userId);
        if (onRefresh) onRefresh();
    };

    // if the file is starred - unstarring and if unstarred - starring
    const handleStar = async (isStarred) => {
        if (!isStarred) {
            await fetchStarFile(id, userId);
        } else {
            await fetchUnStarFile(id, userId);
        }
        if (onRefresh) onRefresh();
    };

    return (
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom file-row">
            { /* file title */ }
            <div className="d-flex align-items-center" style={{cursor: type === 'folder' ? 'pointer' : 'default'}} onClick={() => type === 'folder' && onNavigate && onNavigate(id)}>
                <span className="me-2">{type === 'folder' ? '📁' : '📄'}</span>
                <h6 className="mb-0">{title}</h6>
            </div>
            { /* file date */ }
            {date && (
                <div className="d-flex align-items-center me-3">
                    <small className="text-muted">{new Date(date).toLocaleDateString()} {new Date(date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                </div>
            )}
            { /* file creator */ }
            <div className="d-flex align-items-center">
                <h6 className="mb-0">by {creatorName}</h6>
            </div>
            { /* dropdown for file operations */ }
            <Dropdown align="end">
                <Dropdown.Toggle variant="light" className="border-0 bg-transparent no-caret">
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>⋮</span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    { /* link to view the file */ }
                    {type === 'file' && (
                        <Dropdown.Item as={Link} to={`/view/${id}`}>
                            View
                        </Dropdown.Item>
                    )}
                    { /* link to edit the file */ }
                    {canWrite && (
                        <>
                            <Dropdown.Item as={Link} to={`/edit/${id}`}>
                                Edit
                            </Dropdown.Item>
                            { /* link to move the file */ }
                            <Dropdown.Item as={Link} to={`/move/${id}`}>
                                Move to
                            </Dropdown.Item>
                        </>
                    )}
                    
                    {isOwner && (
                        <>
                            { /* link to share the file */ }
                            <Dropdown.Item as={Link} to={`/share/${id}`}>
                                Share
                            </Dropdown.Item>
                            { /* link to manage the perms of the file */ }
                            <Dropdown.Item as={Link} to={`/manageperms/${id}`}>
                                Manage Permissions
                            </Dropdown.Item>
                        </>
                    )}
                    { /* button to star the file */ }
                    <Dropdown.Item onClick={() => handleStar(isStarred)}>
                        {isStarred ? 'UnStar' : 'Star'}
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    { /* button to delete the file */ }
                    <Dropdown.Item className="text-danger" onClick={handleDelete}>
                        Move to Trash
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}

export default File;
