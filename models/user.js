const mongoose = require('mongoose');
const { createHmac, randomBytes } = require('node:crypto');
const {createTokenForUser,validateToken} = require('../services/authentication');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    
    },
    salt:{
        type: String,
        
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,

    },
    profileImageURL: {
        type: String,
        default: "/images/default.png",

    },
    role:{
        type: String,
        enum: ['USER','ADMIN'],
        default: 'USER',
    },
},{timestamps: true});


//Hashing Password (this code will run before storing in DB)
userSchema.pre('save',function(next){
    const user = this;
    if(!user.isModified('password')) return;

    const salt = randomBytes(16).toString();
    const hash = createHmac('sha256', salt)
               .update(user.password)
               .digest('hex');

    this.salt = salt;
    this.password = hash;
    next();
});

userSchema.static('matchPasswordAndGenerateToken', async function(email,password){
    const user = await this.findOne({email});
    if (!user) throw new Error('No user found');
    
    const salt = user.salt;
    const hashedPassword = user.password;

    const providedHash = createHmac('sha256', salt)
               .update(password)
               .digest('hex');
    if(providedHash !== hashedPassword) throw new Error('Incorrect password');
    const token = createTokenForUser(user);
    return token;
});

const User = mongoose.model('user',userSchema);


module.exports = User;



