const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const generateAccessToken = (req , res) => {

    const accessToken = jwt.sign(
        {username:"admin"},
        process.env.ACCESS_TOKEN_SECRET , 
        {expiresIn : '30s' }
        );

        res.json({username:"admin" , accessToken});

}
module.exports = {generateAccessToken}