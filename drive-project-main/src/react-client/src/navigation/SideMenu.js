import { Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavButton from './NavButton';

const SideMenu = () => (
  <div className="p-3">
    <div className="mb-4 ps-2">
      <Button 
        as={Link} 
        to="/create" 
        variant="white" 
        className="shadow-sm border rounded-pill px-4 py-2 d-flex align-items-center bg-white"
        style={{ fontWeight: '500', fontSize: '1.1rem' }}
      >
        Create
      </Button>
    </div>

    <Nav className="flex-column">
      <NavButton to="/" label="Home" />
      <NavButton to="/recent" label="Recent" />
      <NavButton to="/sharedwithme" label="Shared With Me" />
      <NavButton to="/starred" label="Starred" />
      <NavButton to="/trash" label="Trash" />
    </Nav>
  </div>
);

export default SideMenu;