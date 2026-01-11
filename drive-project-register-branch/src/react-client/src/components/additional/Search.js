import { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { fetchSearchFiles } from '../../fetches';
import File from '../file-components/File';

function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [files, setFiles] = useState([]);

    // replace userID with the id from the token
    const userId = 1;

    const loadFiles = async () => {
        if (!query) return;
        const data = await fetchSearchFiles(userId, query);
        if (data) {
            setFiles(data);
        }
    };

    useEffect(() => {
        loadFiles();
    }, [query]);

    const listItems = files.map((f, index) =>
        <ListGroup.Item key={f.id} className="p-0 border-0">
            { /* change f.creator here to the username of thee file creator */}
            <File 
                id={f.id} 
                title={f.title}
                isStarred={f.star[userId]} 
                creator={f.creator} 
                type={f.type}
                onRefresh={loadFiles}
            />
        </ListGroup.Item>
    );

    return (
        <div>
           <h4 className="mb-3 px-3 mt-3">Search Results for "{query}"</h4>
              <ListGroup variant="flush">
                {listItems}
           </ListGroup>
        </div>
    );
}

export default Search;