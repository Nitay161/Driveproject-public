const users = [];

const UserModel = {
    // Add a new user to the in-memory array
    addUser: (user) => {
        users.push(user);
    },

    // Find user by unique ID
    findById: (id) => {
        return users.find(u => u.id === id);
    },

    // Find user by username
    findByUsername: (username) => {
        return users.find(u => u.username === username);
    },

    // Check credentials for login
    validateCredentials: (username, password) => {
        return users.find(u => u.username === username && u.password === password);
    }
};

module.exports = UserModel;