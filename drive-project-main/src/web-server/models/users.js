const { getDb } = require("./db");
const { ObjectId } = require("mongodb");

const usersCol = () => getDb().collection("users");

const toObjectId = (id) => {
    if (id === null || id === undefined) return null;
    if (id instanceof ObjectId) return id;
    if (typeof id !== "string") return null;
    if (!ObjectId.isValid(id)) return null;
    return new ObjectId(id);
};

const UserModel = {
    // Add a new user to the users collection
    async addUser(user) {
        const result = await usersCol().insertOne(user);
        return result.insertedId;
    },

    // Find user by unique ID
    async findById(id) {
        try {
            // accept either ObjectId string or ObjectId
            const _id = toObjectId(id);
            if (!_id) return null;
            return usersCol().findOne({ _id });
        } catch (e) {
            // Never let invalid ids crash the server
            return null;
        }
    },

    // Find user by username
    async findByUsername(username) {
        return usersCol().findOne({ username });
    },

    // Check credentials for login
    async validateCredentials(username, password) {
        return usersCol().findOne({ username, password });
    }
};

module.exports = UserModel;