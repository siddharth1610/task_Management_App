const { header } = require('express-validator');
const User = require('../models/user.model')
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    
    try{
        const token = req.header('Authorization').replace('Bearer ', '');
        // console.log('From Auth:',token);
        const decoded = jwt.verify(token, 'myKey');
        // Fetch only that user, who's token is match with auth-token provided by postman.
        const user = await User.findOne({ _id: decoded._id, 'tokens.token':token });

        if(!user){
            throw new Error();
        }
                
        req.token = token;
        req.user = user;
        
        next();    
    }catch(err){        
        res.status(500).json({messsage:'Please authenticate first'});
        // res.status(401).send({error:'Please authenticate.'});
    }
    
}

module.exports = auth;