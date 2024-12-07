const express = require('express');
const router = express.Router();
const churchController = require('../controllers/church.controller');
const verifyToken = require('../middleware');
const superVerify = require('../middleware/super');
const subAdminVerify = require('../middleware/subadmin');

router.post('/create_church', superVerify, churchController.createChurch);
router.post('/update_church', subAdminVerify, churchController.updateChurch);
router.get('/all_churches', verifyToken, churchController.allChurch);
router.post('/search_church', verifyToken, churchController.searchChurch);
router.get('/delete_church/:id', superVerify, churchController.deleteChurch);
router.get('/get_church_detail/:id', verifyToken, churchController.churchDetail);
router.get('/get_project_detail/:id', verifyToken, churchController.projectDetail);
router.post('/create_project', subAdminVerify, churchController.createProject);
router.post('/update_project', subAdminVerify, churchController.updateProject);
router.get('/:cid/delete_project/:id', subAdminVerify, churchController.deleteProject);
router.post('/admin_get_church_list', subAdminVerify, churchController.adminGetChurchList);

module.exports = router;