const UserModel = require('../models/users');
const { ObjectId } = require('mongodb')

const isValidPassword = (password) => {
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbersOrSymbols = /[^a-zA-Z]/.test(password);
    return password.length >= 8 && hasLetters && hasNumbersOrSymbols;
};

const isValidObjectId = (id) => typeof id === 'string' && ObjectId.isValid(id)

const usersController = {
    // Register new user (POST /api/users)
    register: async (req, res) => {
        const { username, password, fullName, image } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Missing username or password" });
        }

        if (!isValidPassword(password)) {
            return res.status(400).json({ 
                error: "Password must be at least 8 characters long and contain both letters and numbers/symbols." 
            });
        }

        const existing = await UserModel.findByUsername(username);
        if (existing) 
            return res.status(409).json({ error: "Username already exists" });
        
        const newUser = {
            username,
            password,
            fullName: fullName || "",
            image: image || ""
        };

        const insertedId = await UserModel.addUser(newUser);
        res.status(201).json({ id: String(insertedId) }); //convert ObjectId to string
    },

    // Login (POST /api/tokens)
    login: async (req, res) => {
        const { username, password } = req.body;
        const user = await UserModel.validateCredentials(username, password);

        if (user) {
            // Return user ID as token
            res.status(200).json({ token: String(user._id) }); //convert ObjectId to string
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    },

    // Get user details (GET /api/users/:id)
    getUser: async (req, res) => {
        if (!isValidObjectId(req.params.id)) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = await UserModel.findById(req.params.id);

        if (user) {
            // Exclude password from response and convert _id to id string
            const { password, _id,  ...userWithoutPass } = user;
            res.status(200).json({ id: String(_id), ...userWithoutPass });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    }
};

module.exports = usersController;