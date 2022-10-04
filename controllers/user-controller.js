const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../helpers/db-config');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const HttpError = require('../helpers/http-error');

const loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid data received', 422));
    }

    const { email, password } = req.body;

    const existingUser = 'SELECT * FROM user WHERE email=?;'
    db.query(existingUser, email, async (err, response) => {
        if (err) {
            console.log(err);
            return next(new HttpError('Error occured, try again!', 500));
        }
        if (!response || !response.length) {
            return next(new HttpError('No user found against email', 404));
        }
        let validPassword;
        try {
            validPassword = await bcrypt.compare(password, response[0].password)
        } catch (error) {
            console.log(error);
            return next(new HttpError('Password hashing error', 500));
        }

        if (!validPassword) {
            return next(new HttpError('Incorrect password', 401));
        }

        let token;
        try {
            token = jwt.sign({ userId: response[0].id, email: response[0].email },
                process.env.JWT_KEY,
                { expiresIn: '5h' });
        } catch (err) {
            return next(new HttpError('Signup failed', 500));
        }

        res.json({ id: response[0].id, email: response[0].email, user_img: response[0].user_img, name: response[0].name, father: response[0].father, cnic: response[0].cnic, mobile: response[0].mobile, address: response[0].address, khilafatText: response[0].khilafatText, bday: response[0].bday, khilafat: response[0].khilafat, murshad: response[0].murshad, certificate: response[0].certificate, joining: response[0].joining, job: response[0].job, role: response[0].role, token });
    });

};

const registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid data received', 422));
    }

    const {
        email,
        name,
        father,
        cnic,
        mobile,
        address,
        khilafatText,
        bday,
        murshad,
        joining,
        job,
        role
    } = req.body;

    const existingUser = 'SELECT * FROM user WHERE email=?;'
    db.query(existingUser, email, async (err, response) => {
        if (err) {
            console.log(err);
            return next(new HttpError('Error occured, try again!', 500));
        }

        if (response.length) {
            return next(new HttpError('Email already registered', 422));
        }

        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(mobile, 12);
        } catch (error) {
            return next(new HttpError('Password hashing failed. Try again', 500));
        }

        const userRegistration = 'INSERT INTO user (email, user_img, name, father, cnic, mobile, address, khilafatText, bday, murshad, certificate, joining, job, role, password) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'
        db.query(userRegistration, [email, req.files.fileName[0].path, name, father, cnic, mobile, address, khilafatText, bday, murshad, req.files.certificate[0].path, joining, job, role, hashedPassword], (err, result) => {
            if (err) {
                console.log(err);
                return next(new HttpError(err, 500));
            }
            res.status(201).json({ message: 'User registered successfully' });
        });

    })
};

const editUserDetails = async (req, res, next) => {

    const uid = req.params.uid;

    const {
        email,
        name,
        father,
        cnic,
        mobile,
        address,
        khilafatText,
        bday,
        murshad,
        joining,
        job,
        role
    } = req.body;

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(mobile, 12);
    } catch (error) {
        return next(new HttpError('Password hashing failed. Try again', 500));
    }

    const updateUserDetails = 'UPDATE user SET email=?, user_img=?, name=?, father=?, cnic=?, mobile=?, address=?, khilafatText=?, bday=?, murshad=?, certificate=?, joining=?, job=?, role=?, password=? WHERE id=?;'
    db.query(updateUserDetails, [email, req.files.fileName[0].path, name, father, cnic, mobile, address, khilafatText, bday, murshad, req.files.certificate[0].path, joining, job, role, hashedPassword, uid], (err, response) => {
        if (err) {
            console.log(err);
            return next(new HttpError('Error fetching data from database', 500));
        }

        res.json({ message: 'User updated successfully' });
    });
};

const getAllUsers = (req, res, next) => {
    const allUsers = 'SELECT id, name FROM user;'
    db.query(allUsers, (err, response) => {
        if (err) {
            console.log(err);
            return next(new HttpError('Error fetching data from database', 500));
        }

        res.json({ users: response });
    });
};

const getPaginatedUsers = (req, res, next) => {
    const limit = 10;
    const page = req.query.page;
    const offset = (page - 1) * limit;

    const nextPage = page * limit;

    const allUsers = "SELECT * FROM user limit " + limit + " OFFSET " + offset;
    db.query(allUsers, (err, response) => {
        if (err) {
            console.log(err);
            return next(new HttpError('Error fetching data from database', 500));
        }

        const nextPageData = "SELECT * FROM user limit " + limit + " OFFSET " + nextPage;
        db.query(nextPageData, (err, result) => {
            if (err) {
                console.log(err);
                return next(new HttpError('Error fetching data from database', 500));
            }

            res.json({ paginated_users: { products_page_count: response.length, 'page_number': page, nextData: result.length, users: response } });
        });
    });
};

const getAllReports = (req, res, next) => {

    const resolveParrentMissing = (store, currentItem) => {
        for (let [key, value] of Object.entries(store))
            if (value.p_id == currentItem.id) {
                currentItem.children ??= [];
                currentItem.children.push(value);
            }
    }

    const buildHierarchyCollection = flatItems => {
        const result = [], store = {};
        for (const { id, text, p_id } of flatItems) {
            store[id] = { id, text, expanded: false, };
            const parentItemInStore = store[p_id];
            if (!p_id)
                result.push(store[id]);
            else if (parentItemInStore) {
                parentItemInStore.children ??= [];
                parentItemInStore.children.push(store[id]);
            }

            resolveParrentMissing(store, store[id]);
        }

        return result;
    }

    const rootUsers = 'SELECT id as id, name as text, murshad as p_id from user WHERE murshad=?;'
    db.query(rootUsers, 0, (err, response) => {
        if (err) {
            console.log(err);
            return next(new HttpError('Error fetching data from database', 500));
        }

        const childUsers = 'SELECT id as id, name as text, murshad as p_id from user WHERE murshad!=?;'
        db.query(childUsers, 0, (err, result) => {
            if (err) {
                console.log(err);
                return next(new HttpError('Error fetching data from database', 500));
            }

            const finalResult = buildHierarchyCollection([...response, ...result]);

            res.json({ reports: finalResult });
        });

    });
};

const deleteUser = (req, res, next) => {

    const id = req.params.id;

    let userToDelete;

    const currentUser = 'SELECT * FROM user WHERE id=?;'
    db.query(currentUser, id, (err, result) => {
        if (err) {
            console.log({ err });
            return next(new HttpError('Error fetching data from database', 500));
        }

        userToDelete = result;
    });

    const deletedUserChild = 'SELECT * FROM user WHERE murshad=?;'
    db.query(deletedUserChild, id, (err, resp) => {
        if (err) {
            console.log({ err });
            return next(new HttpError('Error fetching data from database', 500));
        }

        if (resp.length) {
            resp.forEach(element => {
                const updateChildren = 'UPDATE user SET murshad=? WHERE id=?;'
                db.query(updateChildren, [userToDelete[0].murshad, element.id], (err, returnResp) => {
                    if (err) {
                        console.log({ err });
                        return next(new HttpError('Error fetching data from database', 500));
                    }
                });
            });
        }

        const removeUser = 'DELETE FROM user WHERE id=?;'
        db.query(removeUser, id, (err, response) => {
            if (err) {
                console.log({ err });
                return next(new HttpError('Error fetching data from database', 500));
            }

            res.json({ message: 'User deleted successfully' });
        });
    });
};

const userReport = (req, res, next) => {

    const uid = req.params.uid;

    const resolveParrentMissing = (store, currentItem) => {
        for (let [key, value] of Object.entries(store))
            if (value.p_id == currentItem.id) {
                currentItem.children ??= [];
                currentItem.children.push(value);
            }
    }

    const buildHierarchyCollection = flatItems => {
        const result = [], store = {};
        for (const { id, text, p_id } of flatItems) {
            store[id] = { id, text, expanded: false, };
            const parentItemInStore = store[p_id];
            if (!p_id)
                result.push(store[id]);
            else if (parentItemInStore) {
                parentItemInStore.children ??= [];
                parentItemInStore.children.push(store[id]);
            }

            resolveParrentMissing(store, store[id]);
        }

        return result;
    }

    let root;
    const rootUsers = 'SELECT id as id, name as text, murshad as p_id from user WHERE id=?;'
    db.query(rootUsers, uid, (err, resp) => {
        if (err) {
            console.log({ err });
            return next(new HttpError('Error fetching data from database', 500));
        }
        root = resp
    });

    const existingUserChild = 'SELECT id as id, name as text, murshad as p_id from user WHERE murshad=?;'
    db.query(existingUserChild, uid, (err, response) => {
        if (err) {
            console.log({ error });
            return next(new HttpError('Error fetching data from database', 500));
        }

        const finalResult = root !== undefined ? buildHierarchyCollection([...root, ...response]) : [];

        res.json({ report: finalResult });
    });
};

const userData = (req, res, next) => {
    const id = req.params.id;

    const getUserData = 'SELECT id, email, user_img, name, father, cnic, mobile, address, khilafatText, bday, khilafat, murshad, certificate, joining, job, role FROM user WHERE id=?;'
    db.query(getUserData, id, (err, response) => {
        if (err) {
            console.log({ error });
            return next(new HttpError('Error fetching data from database', 500));
        }

        res.json({ user_details: response });
    });
};

exports.loginUser = loginUser;
exports.registerUser = registerUser;
exports.getAllUsers = getAllUsers;
exports.getAllReports = getAllReports;
exports.deleteUser = deleteUser;
exports.getPaginatedUsers = getPaginatedUsers;
exports.userReport = userReport;
exports.editUserDetails = editUserDetails;
exports.userData = userData;