const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

//  POST api/auth -- Login
router.post('/', async (req, res) => {
    //  Validate request body
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error);
    //  Check user exists
    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send("Invalid username or password");

    //  Check password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send("Invalid username or password");

    const token = user.generateAuthToken();

    res.send(token);
});


function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(req, schema);
}

module.exports = router;