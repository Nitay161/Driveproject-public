import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Alert, Image } from 'react-bootstrap';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '', password: '', verifyPassword: '', fullName: ''
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef();
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // ולידציה בצד הלקוח [cite: 282]
        if (formData.password !== formData.verifyPassword) {
            return setError("Passwords do not match");
        }
        
        // ולידציית חוזק סיסמה
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d|[^A-Za-z]).{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            return setError("Password must be at least 8 chars and include letters and numbers/symbols");
        }

        if (!imagePreview) {
            return setError("Profile picture is required");
        }

        const payload = {
            username: formData.username,
            password: formData.password,
            fullName: formData.fullName,
            image: imagePreview
        };

        try {
            const response = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                navigate('/login'); // מעבר להתחברות לאחר הרשמה [cite: 288]
            } else {
                const data = await response.json();
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('Server error');
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center py-5">
            <Card className="w-100" style={{ maxWidth: "500px" }}>
                <Card.Body>
                    <h2 className="text-center mb-4">Create your Account</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control type="text" required 
                                onChange={e => setFormData({...formData, fullName: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" required 
                                onChange={e => setFormData({...formData, username: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" required 
                                onChange={e => setFormData({...formData, password: e.target.value})} />
                            <Form.Text className="text-muted">Min 8 chars, letters & numbers</Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Verify Password</Form.Label>
                            <Form.Control type="password" required 
                                onChange={e => setFormData({...formData, verifyPassword: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Profile Picture</Form.Label>
                            <Form.Control 
                                type="file" 
                                accept="image/*" 
                                ref={fileInputRef} 
                                onChange={handleImageChange}
                                required 
                            />
                            {imagePreview && (
                                <div className="text-center mt-3">
                                    <Image src={imagePreview} roundedCircle width="100" height="100" style={{objectFit: 'cover'}} />
                                </div>
                            )}
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">Register</Button>
                    </Form>
                    <div className="text-center mt-3">
                        <Link to="/login">Already have an account? Sign in</Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Register;