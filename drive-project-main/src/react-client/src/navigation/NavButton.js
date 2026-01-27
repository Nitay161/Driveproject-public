import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavButton = ({ to, label }) => (
  <Nav.Link as={Link} to={to} className="mb-2 w-100">
    {label}
  </Nav.Link>
);

export default NavButton;