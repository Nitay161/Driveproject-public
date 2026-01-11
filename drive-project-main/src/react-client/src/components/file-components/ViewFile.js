import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BackBtn from '../../navigation/BackBtn';
import { fetchGetFile } from '../../fetches';

function ViewFile() {
    // getting file id from url
    const { id } = useParams();
    const [file, setFile] = useState({});

    // replace userId with the user id from the token
    const userId = 1;

    // loading the file when the id is changed
    useEffect(() => {
        const loadFile = async () => {
            const data = await fetchGetFile(id, userId);
            setFile(data || { error: "Failed to load" });
        };
        loadFile();
    }, [id]);

    if (file.error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">Error loading file: {file.error}</div>
                <BackBtn />
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="card shadow-sm p-4">
                <h2>{ file.title }</h2>
                <hr />
                <p>{ file.content }</p>
                
                <div className="mt-4">
                    <BackBtn />
                    <Link to={`/edit/${id}`} className="btn btn-warning">Edit</Link>
                </div>
            </div>
        </div>
    );
}

export default ViewFile;