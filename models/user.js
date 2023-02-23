const mongoose= require("mongoose");
const bcrypt= require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20
    },
    userName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    hash_password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin','teacher'],
        default: 'user'
    },
    contactNumber: { 
        type: String
     },
    profilePicture: {
        type: String
    },
    paper: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Paper",
    }
}, {timestamps: true});

//in monoogse we can use virtuals
userSchema.virtual('password').set(function(password){
    this.hash_password = bcrypt.hashSync(password, 10);
    });

    //this.firstName and this.lastName returns the first and last name of the current user
    userSchema.virtual('fullName').get(function(){
        return `${this.firstName} ${this.lastName}`;
    });

    //create methods
    userSchema.methods = {
        authenticate: function(password){
            return bcrypt.compareSync(password, this.hash_password);//it return true or false
        }
    }

module.exports = mongoose.model("User", userSchema);