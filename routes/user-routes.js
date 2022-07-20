const express = require('express');
const { check } = require('express-validator');

const userController = require('../controllers/user-controller');
const fileUpload = require('../middlewares/file-upload');

const router = express.Router();

router.get('/all-users', userController.getAllUsers);

router.get('/reports', userController.getAllReports);

router.get('/user-report/:uid', userController.userReport);

router.get('/paginated-users', userController.getPaginatedUsers);

router.get('/user-details/:id', userController.userData);

router.post('/login', [
    check('email').isEmail(),
    check('password').not().isEmpty()
], userController.loginUser);

router.post('/register', fileUpload.fields([{ name: 'certificate', maxCount: 1 }, { name: 'fileName', maxCount: 1 }]), [
    check('email').isEmail(),
    check('name').not().isEmpty(),
    check('father').not().isEmpty(),
    check('cnic').not().isEmpty(),
    check('mobile').not().isEmpty(),
    check('address').not().isEmpty(),
    check('khilafatText').not().isEmpty(),
    check('bday').not().isEmpty(),
    check('khilafat').not().isEmpty(),
    check('murshad').not().isEmpty(),
    check('joining').not().isEmpty(),
    check('job').not().isEmpty(),
    check('role').not().isEmpty()
], userController.registerUser);

router.patch('/edit-user/:uid', fileUpload.fields([{ name: 'certificate', maxCount: 1 }, { name: 'fileName', maxCount: 1 }]), [
    check('email').isEmail(),
    check('name').not().isEmpty(),
    check('father').not().isEmpty(),
    check('cnic').not().isEmpty(),
    check('mobile').not().isEmpty(),
    check('address').not().isEmpty(),
    check('khilafatText').not().isEmpty(),
    check('bday').not().isEmpty(),
    check('khilafat').not().isEmpty(),
    check('murshad').not().isEmpty(),
    check('joining').not().isEmpty(),
    check('job').not().isEmpty(),
    check('role').not().isEmpty()
], userController.editUserDetails);

router.delete('/remove-user/:id', userController.deleteUser);

module.exports = router;