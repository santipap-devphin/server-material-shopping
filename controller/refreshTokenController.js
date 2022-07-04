const users = {
    user : require('../model/username.json'),
    setUser : function (data) { this.user = data }
}

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const handleRefreshToken = (req , res) => {

        const cookies = req.cookies;
        //console.log(cookies)
        if(!cookies?.jwt) return res.sendStatus(401);
        //console.log(cookies.jwt)
        const refreshToken = cookies.jwt;
        const chkRefresh = users.user.find((finds) => finds?.refreshToken === refreshToken);
        if(chkRefresh === undefined) return res.sendStatus(403);

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err , decoded) => {
            if(err || chkRefresh.username !== decoded.username) return res.sendStatus(403);
             
                const accessToken = jwt.sign(
                    {"username" : decoded.username},
                    process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn : '2h'}
                )

                res.json({accessToken})

            }

        )
}

module.exports = {handleRefreshToken}