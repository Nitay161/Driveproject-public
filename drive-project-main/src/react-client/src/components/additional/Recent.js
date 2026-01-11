import { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { fetchGetAllFiles } from '../../fetches';
import File from '../file-components/File';


function Recent() {
    const [files, setFiles] = useState([]);

    const NUMBER_OF_RECENT_FILES = 10;

    // replace userID with the id from the token
    const userId = 1;

    const loadFiles = async () => {
        const data = await fetchGetAllFiles(userId);
        if (data) {
            // filter to see only files and not folders
            let filteredData = data.filter(f => f.type === 'file');
            // sort by last edited descending   
            filteredData.sort((a, b) => new Date(b.last) - new Date(a.last));
            setFiles(filteredData.slice(0, NUMBER_OF_RECENT_FILES)); // get only top NUMBER_OF_RECENT_FILES recent files
        }
    };

    useEffect(() => {
        loadFiles();
    }, []);

    const listItems = files.map((f, index) =>
        <ListGroup.Item key={f.id} className="p-0 border-0">
            { /* change f.creator here to the username of thee file creator */}
            <File 
                id={f.id} 
                title={f.title}
                isStarred={f.star[userId]} 
                creator={f.creator} 
                type={f.type}
                date={f.last}
                onRefresh={loadFiles}
            />
        </ListGroup.Item>
    );
    return (
        <div>
           <h4 className="mb-3 px-3 mt-3">Recent Files</h4>
           <ListGroup variant="flush">
                {listItems}
           </ListGroup>
        </div>
    );
}

export default Recent;