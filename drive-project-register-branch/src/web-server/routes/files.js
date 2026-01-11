const express = require('express')
const router = express.Router()
const controller = require('../controllers/files')

router.route('/')
    .get(controller.getAllFiles)
    .post(controller.createFile)

router.route('/starred')
    .get(controller.getAllStarredFiles)

router.route('/starred/:id')
    .post(controller.starFile)
    .delete(controller.unstarFile)

router.route('/trash')
    .get(controller.getAllTrashedFiles)

router.route('/:id/restore')
    .post(controller.untrashFile)

router.route('/:id/permanent')
    .delete(controller.deleteFile)

router.route('/:id')
    .get(controller.getFileById)
    .patch(controller.updateFile)
    .delete(controller.trashFile)

router.route('/:id/permissions')
    .get(controller.getPermissionsById)
    .post(controller.createPermissions)

router.route('/:id/permissions/:pId')
    .patch(controller.updatePermissions)
    .delete(controller.deletePermissions)

router.route('/:id/move')
    .patch(controller.moveFileToFolder)

module.exports = router
