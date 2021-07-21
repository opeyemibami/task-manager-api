const jwt = require("jsonwebtoken");
const User = require("../models/user");
const dotenv = require('dotenv')
dotenv.config()
const jwtSecret = process.env.JWT_SECRET

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const decode = jwt.verify(token, jwtSecret);
    const user = await User.findOne({ _id: decode._id, "tokens.token": token });
    if(!user){
        throw new error
    }
    req.token = token;
    req.user = user
    next()
  } catch (error) {
    res.status(401).send({ error: 'please authenticate'})
  }
};

module.exports = auth;
