const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const veriflyJWTForGet = (req ,res , next) => {

    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    console.log(authHeader);
    const token = authHeader.split(" ")[1];
    jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET,
        (err , decoded) =>
        {
            if(err) return res.sendStatus(403) // invalid Token
            req.user = decoded.username;
            next();
        }

    )

   

}

module.exports = veriflyJWTForGet;