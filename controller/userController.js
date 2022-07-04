const users = {
    user : require('../model/username.json'),
    setUser : function (data) { this.user = data }
}
const usersProfile = {
    userprofile : require('../model/userprofile.json'),
    setUserProfile : function (data) { this.userprofile = data }
}
const examData = {list: require('../model/exam.json') , setExamData:(val) => { this.list = val}}
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const fsPromises = require('fs').promises;
const path = require('path');

const bcrypt = require('bcrypt');

const {format} = require('date-fns');

const chkUserForLogin = async(req , res) => {

    const username = req.body.username;
    const pass = req.body.password;

    const bcrypt = require('bcrypt');

    const findsUser = users.user.find((ele) => ele.username === username);

    if(findsUser === undefined) return res.json({"message" : "username not found" , "code" :2})

    const matchPass = await bcrypt.compare(pass , findsUser.password);

    if(matchPass === true){

        const accessToken = jwt.sign(
            {username:findsUser.username},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:"2h"}
        )

        const refreshToken = jwt.sign(
                    {username:findsUser.username},
                    process.env.REFRESH_TOKEN_SECRET,
                    {expiresIn:"1d"}
            )

        const findOther = users.user.filter((list) => list.username !== findsUser.username);
        
        const userUpdate = {...findsUser , refreshToken}

        users.setUser([...findOther , userUpdate])

        await fsPromises.writeFile(
            path.join(__dirname , '..' , 'model' , 'username.json'),
            JSON.stringify(users.user)
        )
        res.cookie('jwt', refreshToken , { httpOnly :true , sameSite :'None' ,secure : true , maxAge : 24 *60 * 60 * 1000}); // cookie one day    
        res.json({users:userUpdate.username , roles:userUpdate.roles , accessToken:accessToken ,"code": 1})

    }else{
        res.json({"message" : "password invalid" , "code" :3})
    }

}

const userRegister = async (req ,res) => {

    const userRegister = req.body.username;
    const passwordRegister = req.body.password;
    const userEmail = req.body.email;
    const checSameUser = users.user.find((olduser) => olduser.username === userRegister);
    if(checSameUser !== undefined) return res.json({code:2 , text:"usersame"});
    const passBcypt = bcrypt.hashSync(passwordRegister , 10);
    const Registertime =  `${format(new Date() , 'yyyyMMdd_HH:mm:ss')}`;
    
    const userId = users.user.length > 0 ? users.user.length+1 : 0;

    const newUser = {id:userId , username:userRegister , password:passBcypt , roles:{"User":2001} , registerTime: Registertime};

    
    const userInfo = {userid:userId ,username : userRegister , profile :{ nameSurname:null,pfPhone:null,pfEmail:userEmail,pfGender:null,pfBirth:null} , address:[]};
    /*userInfo.profile = {
        nameSurname:null , 
        pfPhone:null , 
        pfEmail:userEmail , 
        pfGender:null ,  
        pfBirth:null 
    }*/
 

    //console.log(userInfo);

    //usersProfile.userprofile.push(userInfo);

    usersProfile.setUserProfile([...usersProfile.userprofile , userInfo]);
    
   
    //console.log(usersProfile.userprofile)

    if(users.user.length > 0){

        users.setUser([...users.user , newUser]);

    }else{
        users.user.push(newUser);
    }
    
    
    await fsPromises.writeFile(
                                path.join(__dirname,'..','model', "username.json") ,
                                JSON.stringify(users.user)
                                )

    //console.log(usersProfile.userprofile)                           
    await fsPromises.writeFile(
                                path.join(__dirname,'..','model', "userprofile.json") ,
                                JSON.stringify(usersProfile.userprofile)
                              )                           


    res.json({code:1 , "text":"register success"});
    
}

const getUser  = (req , res) => {

    const allUser = users.user.filter((list) => list.roles?.User && list.roles?.Editor)

    res.json({allUser});

}

const userProfile = (req ,res) => {

    res.json(usersProfile.userprofile);

} 

const userLogout = async(req , res) => {

    //console.log(req.cookies)
    const cookies = req.cookies;
    
    if(!cookies?.jwt) return res.sendStatus(204); // no content

    const findUser = users.user.find((data) => data.refreshToken === cookies.jwt);
    if(!findUser) 
    {
        res.clearCookie('jwt', {httpOnly :true , sameSite :'None' ,secure : true});
        return res.sendStatus(204); 
    }
    const updateStatus = {...findUser , refreshToken:''}
    const otherUser = users.user.filter((luser) => luser?.refreshToken !== cookies.jwt);

    //console.log(updateStatus)
    users.setUser([...otherUser , updateStatus])
        //res.json({code:1})
     //console.log(users.user)

     await fsPromises.writeFile(
        path.join(__dirname , '..' , 'model' , 'username.json') ,
        JSON.stringify(users.user)
    )

    res.clearCookie('jwt' , {httpOnly :true}); // secure : true - only serves on https

    res.json({code:1 , text:"logout Success"})
    //res.sendStatus(204);
}

module.exports = {chkUserForLogin , getUser , userLogout , userRegister , userProfile}