const userModel = require("../models/user.model");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// @ http://localhost:3000/user/registration



exports.registration = [

    body('name').trim().isLength({min:2}).escape()
        .withMessage('User name must be specified')
        .isAlphanumeric()
        .withMessage('User name has non-alphanumeric characters'),

    body('email').trim().isEmail().withMessage('Enter proper email'),

    body('password').trim().notEmpty(),
    body('type').trim().notEmpty(),

    async (req, res) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);
        console.log(errors);

        try {            
            const user_data = new userModel({
                name : req.body.name,
                email : req.body.email,
                password : req.body.password,
                age: req.body.age,
                type : req.body.type
            });

            if (!errors.isEmpty()) {                    
                res.status(422).json({ errors: errors.array() });
            } else {                
                const userSaved = await user_data.save();   
                const token = await user_data.generateAuthToken();                

                res.status(201).json({ userSaved, token });
            }

        } catch (err) {            
            res.status(500).json(err.message);
        }
    }
];

/*
Method: GET
http://localhost:3000/users/me 
Set header: Authorization : jwt(token) for that user.
*/
exports.readUser = [
    async (req, res) => {
        try {
            res.send(req.user);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
];

/*
@ Method: Get
@ url : http://localhost:3001/checkPassword

*/

exports.checkPassword = async (req, res) => {
    try {        
        const userInfo = await userModel.findById(req.query.id);
        const result = await bcrypt.compare(req.query.password, userInfo.password);        

        if (result) {
            res.status(200).json('Password match');
        } else {
            res.status(404).json('Password Not Match');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }    
};

// @Method - PUT  
// http://localhost:3001/updateUser/userId


exports.updateUserInfo = [
    async (req, res) => {
        try {            
            // request by user for update
            const updates = Object.keys(req.body);
            const allowedTyped = ['name', 'email', 'password', 'age', 'type'];           

            const isValidOperation = updates.every((update) => allowedTyped.includes(update));

            if (!isValidOperation) {
                res.status(400).send({ error: 'Invalid key' });
            }

            updates.forEach((update) => req.user[update] = req.body[update]);
             
            await req.user.save();
            res.status(200).send(req.user);  
        } catch (err) {
            console.log(err);
            res.status(400).send(err);  
        }        
    }
];

exports.login = [
    async (req, res) => {
        try {
            const user = await userModel.findByCredentials(req.body.email, req.body.password); // statics
            const token = await user.generateAuthToken();  // methods

            res.status(200).send({ user, token });    
        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    }
];

/*
Logout a single session token.
*/

exports.logout = [
    async (req, res) => {
        try {
            req.user.tokens = req.user.tokens.filter((tokenObj) => tokenObj.token !== req.token);
            await req.user.save();
            res.send('Token deleted.');
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }
];

/*
Logout all sessions for the user.
*/
exports.logoutAll = [
    async (req, res) => {            
        try {
            req.user.tokens = [];
            await req.user.save();

            res.status(200).send('Logout from all devices');
        } catch (error) {
            res.status(500).send(error);
        }
    }
];

exports.deleteUser = [
    async (req, res) => {            
        try {
            const deletedUser = await userModel.findOneAndDelete(req.user._id);

            if (!deletedUser) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json({ message: 'User deleted successfully', deletedUser });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }  
    }
];
