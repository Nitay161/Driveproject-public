import { Navbar, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TopMenu = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
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
    </Navbar>
  );
};

export default TopMenu;