const { ObjectId } = require('mongodb')

const File = require('../models/files')
const UserModel = require('../models/users')

const isValidObjectId = (id) => typeof id === 'string' && ObjectId.isValid(id)

const resolveUserId = async (pidOrUsername) => {
	if (pidOrUsername === undefined || pidOrUsername === null) return null

	const raw = String(pidOrUsername).trim()
	if (!raw) return null

	// Prefer username lookup first (so numeric usernames still work as username if present)
	const byUsername = UserModel.findByUsername ? await UserModel.findByUsername(raw) : null
	if (byUsername && byUsername._id) {
		return String(byUsername._id)
	}

	// Fallback to ID lookup
	if (isValidObjectId(raw)) {
		const byId = UserModel.findById ? await UserModel.findById(raw) : null
		if (byId && byId._id) {
			return String(byId._id)
		}
	}

	return null
}

exports.getAllFiles = async (req, res) => {
	// getting user id from http header.
	const userId = req.get('User-Id')
	if (!isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid User-Id' })

	try {
		const files = await File.getAllFiles(userId)
		res.json(files)
	} catch (err) {
		return res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
	}
}

exports.createFile = async (req, res) => {
	// getting user id from http header.
    const userId = req.get("User-Id")
	if (!isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid User-Id' })

	// getting title, content and type (file or folder) for the file.
	const { title, content, type } = req.body
	if (!type) return res.status(400).json({ error: 'Type required' })

	if (type === 'file' && (!title || !content))
		return res.status(400).json({ error: 'Title and content required' })

	if (type === 'folder' && (!title || content))
		return res.status(400).json({ error: 'Only title required for folders' })

	try {
		const newFile = await File.createFile(title, content, type, userId)
		res.status(201).location(`/api/files/${newFile.id}`).end()
	} catch (err) {
		return res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
	}
}

exports.getFileById = async (req, res) => {
	// getting user id from http header.
    const userId = req.get("User-Id")
	if (!isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid User-Id' })

	// getting file by sending the id and the user id.
	const fileId = req.params.id
	if (!isValidObjectId(fileId)) return res.status(404).json({ error: 'File not found' })

	try {
		if (!(await File.isExist(fileId))) return res.status(404).json({ error: 'File not found' })

        // if does not have read permissions.
		if (!(await File.hasPermissions(fileId, userId, 1)))
			return res.status(400).json({ error: 'You dont have read permissions for this file' })

		const type = (await File.isFolder(fileId)) ? 'folder' : 'file'
		if (!(type === 'file' || type === 'folder'))
			return res.status(400).json({ error: 'Type can be only file or folder' })

		const file = await File.getFile(fileId)
		res.status(200).json(file)
	} catch (err) {
		return res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
	}
}

exports.updateFile = async (req, res) => {
    // getting user id from http header.
	const userId = req.get('User-Id')
	if (!isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid User-Id' })

    // getting new file title and content.
	const { title, content } = req.body

    // getting file id.
	const fileId = req.params.id
	if (!isValidObjectId(fileId)) return res.status(404).json({ error: 'File not found' })

	try {
		if (!(await File.isExist(fileId))) return res.status(404).json({ error: 'File not found' })

		const isFolder = await File.isFolder(fileId)
		if (isFolder && content) return res.status(400).json({ error: 'No content is required for folders' })

        // if does not have write permissions.
		if (!(await File.hasPermissions(fileId, userId, 2)))
			return res.status(403).json({ error: 'You dont have write permissions for this file' })

        // if no title and content provided.
		if (!title) return res.status(400).json({ error: 'Title required' })
		if (!isFolder && !content) return res.status(400).json({ error: 'Content required for files' })

		await File.updateFile(fileId, title, content)
		res.status(204).end()
	} catch (err) {
		return res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
	}
}

exports.deleteFile = async (req, res) => {
	// getting user id from http header.
    const userId = req.get("User-Id")
	if (!isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid User-Id' })

    // getting file id.
	const fileId = req.params.id
	if (!isValidObjectId(fileId)) return res.status(404).json({ error: 'File not found' })

	try {
		if (!(await File.isExist(fileId))) return res.status(404).json({ error: 'File not found' })
		if (!(await File.hasPermissions(fileId, userId, 4)))
            // if does not have delete permissions.
			return res.status(400).json({ error: 'You dont have delete permissions for this file' })

		await File.deleteFile(fileId, userId)
		res.status(204).end()
	} catch (err) {
		return res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
	}
}

exports.getPermissionsById = async (req, res) => {
    // getting user id from http header.
	const userId = req.get('User-Id')
	if (!isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid User-Id' })

    // getting file id.
	const fileId = req.params.id
	if (!isValidObjectId(fileId)) return res.status(404).json({ error: 'File not found' })

	try {
		if (!(await File.isExist(fileId))) return res.status(404).json({ error: 'File not found' })
		if (!(await File.isCreator(fileId, userId)))
            // if is not the creator.
			return res.status(403).json({ error: 'Only file creator can access permissions' })

		const permissions = await File.getFilePermissions(fileId)
		res.status(200).json(permissions)
	} catch (err) {
		return res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
	}
}

exports.createPermissions = async (req, res) => {
    // getting user id from http header.
	const userId = req.get('User-Id')
	if (!isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid User-Id' })

    // getting file id.
	const fileId = req.params.id
	if (!isValidObjectId(fileId)) return res.status(404).json({ error: 'File not found' })

	try {
		if (!(await File.isExist(fileId))) return res.status(404).json({ error: 'File not found' })
		if (!(await File.isCreator(fileId, userId)))
			return res.status(403).json({ error: 'Only file creator can access permissions' })

		const { pid, perms } = req.body
		if (pid === undefined || pid === null || perms === undefined || perms === null)
			return res.status(400).json({ error: 'pid and perms are required' })

		const resolvedPid = await resolveUserId(pid)
		if (!resolvedPid) return res.status(404).json({ error: 'User not found (by id or username)' })

		const permsNum = parseInt(perms, 10)
		if (Number.isNaN(permsNum)) return res.status(400).json({ error: 'perms must be a number' })
		if (permsNum < 0 || permsNum > 7)
			return res.status(400).json({ error: 'Permissions can be only between 0-7' })

		await File.createFilePermissions(fileId, resolvedPid, permsNum)
		res.status(201).end()
	} catch (err) {
		return res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
	}
}

exports.updatePermissions = async (req, res) => {
	// getting user id from http header.
    const userId = req.get("User-Id")
	if (!isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid User-Id' })

	// getting file id.
	const fileId = req.params.id
	// getting file pid.
	const pidRaw = req.params.pId
	if (!isValidObjectId(fileId)) return res.status(404).json({ error: 'File not found' })

	try {
		if (!(await File.isExist(fileId))) return res.status(404).json({ error: 'File not found' })
		if (!(await File.isCreator(fileId, userId)))
			return res.status(403).json({ error: 'Only file creator can access permissions' })

		const { perms } = req.body
		if (perms === undefined || perms === null) return res.status(400).json({ error: 'perms is required' })

		const resolvedPid = await resolveUserId(pidRaw)
		if (!resolvedPid) return res.status(404).json({ error: 'User not found (by id or username)' })

		const permsNum = parseInt(perms, 10)
		if (Number.isNaN(permsNum)) return res.status(400).json({ error: 'perms must be a number' })
		if (permsNum < 0 || permsNum > 7)
			return res.status(400).json({ error: 'Permissions can be only between 0-7' })

		await File.updateFilePermissions(fileId, resolvedPid, permsNum)
		res.status(204).end()
	} catch (err) {
		return res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
	}
}

exports.deletePermissions = async (req, res) => {
	// getting user id from http header.
	const userId = req.get('User-Id')
	if (!isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid User-Id' })

	// getting file id.
	const fileId = req.params.id
	// getting file pid.
	const pidRaw = req.params.pId
	if (!isValidObjectId(fileId)) return res.status(404).json({ error: 'File not found' })

	try {
		if (!(await File.isExist(fileId))) return res.status(404).json({ error: 'File not found' })
		if (!(await File.isCreator(fileId, userId)))
			return res.status(403).json({ error: 'Only file creator can access permissions' })

		const resolvedPid = await resolveUserId(pidRaw)
		if (!resolvedPid) return res.status(404).json({ error: 'User not found (by id or username)' })

		await File.deleteFilePermissions(fileId, resolvedPid)
		res.status(204).end()
	} catch (err) {
		return res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
	}
}

exports.searchByQuery = async (req, res) => {
	// getting user id from http header.
	const userId = req.get('User-Id')
	if (!isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid User-Id' })

	// getting the query.
	const query = req.params.query
	try {
		const results = await File.searchByQuery(query, userId)
		res.status(200).json(results)
	} catch (err) {
		return res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
	}
}

exports.getAllStarredFiles = async (req, res) => {
	// getting user id from http header.
	const userId = req.get('User-Id')
	if (!isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid User-Id' })

	try {
		const files = await File.getAllStarredFiles(userId)
		res.json(files)
	} catch (err) {
		return res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
	}
}

exports.starFile = async (req, res) => {
	// getting user id from http header.
	const userId = req.get('User-Id')
	if (!isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid User-Id' })

	// getting file id.
	const fileId = req.params.id
	if (!isValidObjectId(fileId)) return res.status(404).json({ error: 'File not found' })

	try {
		if (!(await File.isExist(fileId))) return res.status(404).json({ error: 'File not found' })
		// if does not have read permissions.
		if (!(await File.hasPermissions(fileId, userId, 1)))
			return res.status(400).json({ error: 'You dont have permissions for this file' })

		await File.starFile(fileId, userId)
		res.status(204).end()
	} catch (err) {
		return res.status(400).json({ error: err.message || 'Bad request' })
	}
}

exports.unstarFile = async (req, res) => {
	// getting user id from http header.
	const userId = req.get('User-Id')
	if (!isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid User-Id' })

	// getting file id.
	const fileId = req.params.id
	if (!isValidObjectId(fileId)) return res.status(404).json({ error: 'File not found' })

	try {
		if (!(await File.isExist(fileId))) return res.status(404).json({ error: 'File not found' })
		// if does not have read permissions.
		if (!(await File.hasPermissions(fileId, userId, 1)))
			return res.status(400).json({ error: 'You dont have permissions for this file' })

		await File.unstarFile(fileId, userId)
		res.status(204).end()
	} catch (err) {
		return res.status(400).json({ error: err.message || 'Bad request' })
	}
}

exports.getAllTrashedFiles = async (req, res) => {
	// getting user id from http header.
	const userId = req.get('User-Id')
	if (!isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid User-Id' })

	try {
		const files = await File.getAllTrashedFiles(userId)
		res.json(files)
	} catch (err) {
		return res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
	}
}

exports.trashFile = async (req, res) => {
	// getting user id from http header.
	const userId = req.get('User-Id')
	if (!isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid User-Id' })

	// getting file id.
	const fileId = req.params.id
	if (!isValidObjectId(fileId)) return res.status(404).json({ error: 'File not found' })

	try {
		if (!(await File.isExist(fileId))) return res.status(404).json({ error: 'File not found' })
		// if does not have delete permissions.
		if (!(await File.hasPermissions(fileId, userId, 4)))
			return res.status(400).json({ error: 'You dont have permissions for this file' })

		await File.trashFile(fileId)
		res.status(204).end()
	} catch (err) {
		return res.status(400).json({ error: err.message || 'Bad request' })
	}
}

exports.untrashFile = async (req, res) => {
	// getting user id from http header.
	const userId = req.get('User-Id')
	if (!isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid User-Id' })

	// getting file id.
	const fileId = req.params.id
	if (!isValidObjectId(fileId)) return res.status(404).json({ error: 'File not found' })

	try {
		if (!(await File.isExist(fileId))) return res.status(404).json({ error: 'File not found' })
		// if does not have delete read and write permissions.
		if (!(await File.hasPermissions(fileId, userId, 7)))
			return res.status(400).json({ error: 'You dont have permissions for this file' })

		await File.untrashFile(fileId)
		res.status(204).end()
	} catch (err) {
		return res.status(400).json({ error: err.message || 'Bad request' })
	}
}

exports.moveFileToFolder = async (req, res) => {
	// getting user id from http header.
	const userId = req.get('User-Id')
	if (!isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid User-Id' })

	// getting file id.
	const fileId = req.params.id
	const { folderId } = req.body

	if (!isValidObjectId(fileId)) return res.status(404).json({ error: 'File not found' })
	if (folderId !== null && folderId !== undefined && !isValidObjectId(folderId))
		return res.status(404).json({ error: 'Folder not found' })

	try {
		if (!(await File.isExist(fileId))) return res.status(404).json({ error: 'File not found' })
		if (!(await File.isExist(folderId))) return res.status(404).json({ error: 'Folder not found' })
		if (!(await File.isFolder(folderId))) return res.status(400).json({ error: 'Destination must be a folder' })

		if (!(await File.hasPermissions(fileId, userId, 7)))
			return res.status(400).json({ error: 'You dont have permissions for this file' })
		if (!(await File.hasPermissions(folderId, userId, 2)))
			return res.status(400).json({ error: 'You dont have write permissions for the destination folder' })

		await File.moveFileToFolder(fileId, folderId)
		res.status(204).end()
	} catch (err) {
		return res.status(400).json({ error: err.message || 'Bad request' })
	}
}