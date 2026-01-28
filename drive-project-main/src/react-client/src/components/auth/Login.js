import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';

const Login = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/tokens', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                setToken(data.token);
                navigate('/');
            } else {
                const errData = await response.json();
                setError(errData.error || 'Login failed');
            }
        } catch (err) {
            setError('Server error, please try again later.');
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <Card className="w-100" style={{ maxWidth: "400px", padding: "20px", borderRadius: "8px" }}>
                <Card.Body>
                    <div className="text-center mb-4">
                        <h2 className="mb-3">Sign in</h2>
                        <p>to continue to Drive</p>
                    </div>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control 
                                type="text" 
                                required 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                required 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </Form.Group>

                        <div className="d-grid gap-2 mt-4">
                            <Button variant="primary" type="submit" size="lg">Login</Button>
                        </div>
                    </Form>
                    <div className="text-center mt-3">
                        <Link to="/register">Create account</Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;