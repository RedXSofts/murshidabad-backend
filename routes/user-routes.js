const express = require('express');
const { check } = require('express-validator');

const userController = require('../controllers/user-controller');
const fileUpload = require('../middlewares/file-upload');
const checkAuth = require('../middlewares/check-auth');

const router = express.Router();

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
    check('murshad').not().isEmpty(),
    check('joining').not().isEmpty(),
    check('job').not().isEmpty(),
    check('role').not().isEmpty()
], userController.registerUser);

router.get('/all-users', checkAuth, userController.getAllUsers);

router.get('/reports', checkAuth, userController.getAllReports);

router.get('/user-report/:uid', checkAuth, userController.userReport);

router.get('/paginated-users', checkAuth, userController.getPaginatedUsers);

router.get('/user-details/:id', checkAuth, userController.userData);

router.patch('/edit-user/:uid', checkAuth, fileUpload.fields([{ name: 'certificate', maxCount: 1 }, { name: 'fileName', maxCount: 1 }]), [
    check('email').isEmail(),
    check('name').not().isEmpty(),
    check('father').not().isEmpty(),
    check('cnic').not().isEmpty(),
    check('mobile').not().isEmpty(),
    check('address').not().isEmpty(),
    check('khilafatText').not().isEmpty(),
    check('bday').not().isEmpty(),
    check('murshad').not().isEmpty(),
    check('joining').not().isEmpty(),
    check('job').not().isEmpty(),
    check('role').not().isEmpty()
], userController.editUserDetails);

router.delete('/remove-user/:id', checkAuth, userController.deleteUser);

module.exports = router;