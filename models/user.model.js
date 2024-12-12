const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password:{
        type: String,
        required: true
    },
    age:{
        type:Number,
        default:0,        
        validate(value){
            if(value < 0){
                throw new Error('Age must be a Positive number')
            }
        }
    },
    type:{
        type:String,
        default: 'user'        
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }        
    }]
});

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',    
    foreignField: 'owner',
    foreignField: 'assignedUser',
});


// Hash Plain text Password before save it to database or pass it in userController.
// we cann't use arrow-function becouse of this-binding.
userSchema.pre('save', async function(next){

    const user = this
    console.log('step-2: password hashed');
    
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

/*
Statistics and methods are quiet similar to each other with only difference being statics are functions you call on the whole model whereas methods are functions you call on a particular instance.
*/

userSchema.statics.findByCredentials = async (email, password) => {
        
    try {
        const user = await User.findOne({email});
        
        if(!user){
            throw new Error('No User Found');
        }
      
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        
        if(!isPasswordMatch){
            throw new Error("Password Not Match")
        }
        return user;
        
    } catch (error) {
        console.log(error);
        return error;
    }
    
}

userSchema.methods.toJSON = function(){
    const user = this;
    
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;    
    
    return userObject;
}

userSchema.methods.generateAuthToken = async function(){
    const user = this;
    
    // Create a JWT
    const secretKey = 'myKey';
    const payload = { _id:user._id.toString() };
    
    const token = jwt.sign(payload, secretKey, {expiresIn:'72h'}); //3days

    user.tokens = user.tokens.concat({ token });
    
    //saving it to database
    await user.save();
  
   return token;
}

const User = mongoose.model('User', userSchema)

module.exports = User;