const mongoose = require("mongoose");
const validator = require("validator");
const bcrpyt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task =require("./task")
const dotenv = require('dotenv')
dotenv.config()
const jwtSecret = process.env.JWT_SECRET

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid mail");
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error();
        }
      },
    },
    password: {
      type: String,
      trim: true,
      minlength: 7,
      validate(value) {
        if (validator.contains(value, "password", { ignoreCase: true })) {
          throw new Error("Password should not contain password!");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: { 
      type: Buffer
    }
  },
  {
    writeConcern: {
      j: true,
      wtimeout: 1000
    }
  },

  {
    timestamps: true,
  },
);



userSchema.virtual('tasks',{
  ref: 'Task',
  localField:"_id",
  foreignField:"owner", 
})

// a function to define what goes back to the user from the user data
userSchema.methods.toJSON = function (){
  const user = this;
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar
  return userObject
}

// a function on the user instance to generate jwt
userSchema.methods.genAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, jwtSecret)
  user.tokens = user.tokens.concat({ token });

  await user.save();
  return token;
};

// created a new custom function on the schema statics to find user by credentials
// schema statics functions can be seen as model functions
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }
  const isMatch = await bcrpyt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};

// Using a mongoose middlewear to ensure bcrypt  password hashing before saving
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrpyt.hash(user.password, 8);
  }
  next();
});

// delete user tasks when user is removed 
userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({owner: user._id})
  next()
})



const User = mongoose.model("User", userSchema);


module.exports = User;
