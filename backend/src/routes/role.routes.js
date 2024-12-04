const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const superVerify = require('../middleware/super');

router.get('/get_managers', superVerify, roleController.getManagers);
router.get('/get_manager/:id', superVerify, roleController.getManager);
router.post('/update_role', superVerify, roleController.updateRole);
router.post('/delete_manager', superVerify, roleController.deleteManager);
module.exports = router;