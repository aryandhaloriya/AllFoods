const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateToken(user){
    const secret = process.env.SECRET;
    const expiresIn = "1d";
    const token = jwt.sign(
        {
            email :user.email
        },
       secret,
       {expiresIn}
    );
    return token;
}

module.exports = generateToken;