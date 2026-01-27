import { Navbar, Form, Button, Nav, Image } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TopMenu = () => {
  const [query, setQuery] = useState('');
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem('token');

    if (token) {
      fetch(`http://localhost:5000/api/users/${token}`)
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(err => console.error(err));
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) document.body.classList.add('bg-dark', 'text-white');
    else document.body.classList.remove('bg-dark', 'text-white');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
      <Navbar.Brand href="/">Drive</Navbar.Brand>
      <Form className="d-flex ms-auto" onSubmit={handleSearch}>
        <Form.Control 
          type="search" 
          placeholder="Search..." 
          className="me-2" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button variant="outline-success" type="submit">Search</Button>
      </Form>
      
      <Nav className="ms-auto align-items-center">
        <Button 
        variant="outline-light"
        size="sm" 
        className="me-2" 
        onClick={toggleTheme}>
            {darkMode ? 'Light' : 'Dark'}
        </Button>

        {user && (
          <>
            <Image src={user.image} roundedCircle width="30" height="30" className="me-2" />
            <span className="text-white me-2">{user.fullName}</span>
            <Button variant="danger" size="sm" onClick={handleLogout}>Logout</Button>
          </>
        )}
      </Nav>
    </Navbar>
  );
};

export default TopMenu;