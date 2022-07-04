const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const genRefreshToken = (req , res) => {

    const refreshToken = jwt.sign(
        {
            username:"admin",
            roles:{"User":2001,"Editor":1984,"Admin":5150}
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:"1d"}

    )
    
    res.json({username:"admin" , refreshToken:refreshToken})


}

module.exports  = {genRefreshToken}