const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../helpers/db-config');

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
            validPassword = await bcrypt.compare(password, existingUser.password)
        } catch (error) {
            console.log(error);
            return next(new HttpError('Password hashing error', 500))
        }

        if (!validPassword) {
            return next(new HttpError('Incorrect password', 401));
        }

        res.json({ id: existingUser.id, email: existingUser.email, user_img: existingUser.user_img, name: existingUser.name, father: existingUser.father, cnic: existingUser.cnic, mobile: existingUser.mobile, address: existingUser.address, khilafatText: existingUser.khilafatText, bday: existingUser.bday, khilafat: existingUser.khilafat, murshad: existingUser.murshad, certificate: existingUser.certificate, joining: existingUser.joining, job: existingUser.job, role: existingUser.role });
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
        khilafat,
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

        const userRegistration = 'INSERT INTO user (email, user_img, name, father, cnic, mobile, address, khilafatText, bday, khilafat, murshad, certificate, joining, job, role, password) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'
        db.query(userRegistration, [email, req.files.fileName[0].path, name, father, cnic, mobile, address, khilafatText, bday, khilafat, murshad, req.files.certificate[0].path, joining, job, role, hashedPassword], (err, result) => {
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
        khilafat,
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

    const updateUserDetails = 'UPDATE user SET email=?, user_img=?, name=?, father=?, cnic=?, mobile=?, address=?, khilafatText=?, bday=?, khilafat=?, murshad=?, certificate=?, joining=?, job=?, role=?, password=? WHERE id=?;'
    db.query(updateUserDetails, [email, req.files.fileName[0].path, name, father, cnic, mobile, address, khilafatText, bday, khilafat, murshad, req.files.certificate[0].path, joining, job, role, hashedPassword, uid], (err, response) => {
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
            store[id] = { id, text, expanded: true, };
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
            store[id] = { id, text, expanded: true, };
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

exports.loginUser = loginUser;
exports.registerUser = registerUser;
exports.getAllUsers = getAllUsers;
exports.getAllReports = getAllReports;
exports.deleteUser = deleteUser;
exports.getPaginatedUsers = getPaginatedUsers;
exports.userReport = userReport;
exports.editUserDetails = editUserDetails;