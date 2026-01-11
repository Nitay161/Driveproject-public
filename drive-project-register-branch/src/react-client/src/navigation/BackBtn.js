import { Link } from 'react-router-dom';

function BackBtn() {
    return (
        <Link to="/" className="btn btn-secondary me-2">Back</Link>
    );
}

export default BackBtn;