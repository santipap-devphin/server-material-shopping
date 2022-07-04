const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const veriflyJWT = (req , res , next) => {

    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    //console.log(authHeader);
    const token = authHeader.split(" ")[1];
    
    //console.log(token);

    jwt.verify(
        token , 
        process.env.ACCESS_TOKEN_SECRET ,
        (err , decoded) => {
            console.log(err)
            if(err) return res.sendStatus(403) // invalid Token
            console.log(decoded.username);
            req.username = decoded.username;

            next();

        }
    )

}

module.exports = veriflyJWT;
