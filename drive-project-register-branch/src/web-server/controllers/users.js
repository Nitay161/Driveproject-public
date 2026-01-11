const UserModel = require('../models/users');
const { v4: uuidv4 } = require('uuid'); 

const isValidPassword = (password) => {
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbersOrSymbols = /[^a-zA-Z]/.test(password);
    return password.length >= 8 && hasLetters && hasNumbersOrSymbols;
};

const usersController = {
    // Register new user (POST /api/users)
    register: (req, res) => {
        const { username, password, fullName, image } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Missing username or password" });
        }

        if (!isValidPassword(password)) {
            return res.status(400).json({ 
                error: "Password must be at least 8 characters long and contain both letters and numbers/symbols." 
            });
        }

        if (UserModel.findByUsername(username)) {
            return res.status(409).json({ error: "Username already exists" });
        }

        const newUser = {
            id: uuidv4(),
            username,
            password,
            fullName: fullName || "",
            image: image || ""
        };

        UserModel.addUser(newUser);
        res.status(201).json({ id: newUser.id });
    },

    // Login (POST /api/tokens)
    login: (req, res) => {
        const { username, password } = req.body;
        const user = UserModel.validateCredentials(username, password);

        if (user) {
            // Return user ID as token
            res.status(200).json({ token: user.id });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    },

    // Get user details (GET /api/users/:id)
    getUser: (req, res) => {
        const user = UserModel.findById(req.params.id);

        if (user) {
            // Exclude password from response
            const { password, ...userWithoutPass } = user;
            res.status(200).json(userWithoutPass);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    }
};

module.exports = usersController;