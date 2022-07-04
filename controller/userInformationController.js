const usersProfile = {
    userprofile : require('../model/userprofile.json'),
    setUserProfile : function (data) { this.userprofile = data }
}
const users = {
    user : require('../model/username.json'),
    setUser : function (data) { this.user = data }
}

const fsPromises = require('fs').promises;
const path = require('path');
const jsonToken = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt')
dotenv.config();

const getAddress = async (req , res) => {

    const cookies = req.cookies;
    const username = req.user;
    const chkuser = users.user.find((userchk) => userchk.username ===  username);

    //console.log(username)
    if(cookies.jwt !== chkuser.refreshToken){
            //console.log("okok");
            return res.json({code:4 , text:"token timeout"})
    }
    const findUserInfo = usersProfile.userprofile.find((user) => {

        if(user.username === username){

             return user;
        }

    });
    if(findUserInfo === undefined) return res.json({code:2 , "text":"no data"})
            

    //console.log(findUserInfo)
    res.json({code:1 , data:findUserInfo});

}

const updateProfile =  async (req , res) => {

    //console.log(req.cookies)
    if(!req.cookies?.jwt) return res.json({code:6 , "text" :"cookie unkhow"});
    const cookieuser = req.cookies.jwt;
    jsonToken.verify(
        cookieuser,
        process.env.REFRESH_TOKEN_SECRET,
        (err , decoded) => {
            if(err) return res.sendStatus(403) // invalid Token
            const user = decoded.username;

            const findUpdate = usersProfile.userprofile.find((data) => data.username === user);

            findUpdate.profile.nameSurname = req.body.nameSurname;
            findUpdate.profile.pfPhone = req.body.pfPhone;
            findUpdate.profile.pfEmail = req.body.pfEmail;
            findUpdate.profile.pfGender = req.body.pfGender;
            findUpdate.profile.pfBirth = req.body.pfBirth;

            const newData =  usersProfile.userprofile.filter((newsData) =>  newsData.username !== user);

            //console.log(newData)

            usersProfile.setUserProfile([...newData , findUpdate]);

            //console.log(usersProfile.userprofile)
            return usersProfile;

             

        }
    )
    await fsPromises.writeFile(
        path.join(__dirname , '..' , 'model' , 'userprofile.json'),
        JSON.stringify(usersProfile.userprofile)
    )


    return res.json({code:1 ,"text":"success"});
}

const insertAddress = async (req , res) => {

    const cookies = req.cookies;
    
    if(!cookies?.jwt) return res.sendStatus(204); 
    const findUser = users.user.find((list) => list.refreshToken === cookies.jwt);
    if(findUser === undefined) return res.sendStatus(204); 
    const filterUser = usersProfile.userprofile.find((data) => data.userid === findUser.id);
    
    if(filterUser){

        const addrID = filterUser.address.length > 0 ? filterUser.address.length+1 : 1;

        let status = filterUser.address.length > 0 ? false : true;

        const newObj = {"addrID" : addrID , "nameAddr" : req.body.nameAddr , "telAddr": req.body.telAddr , "provinceAddr": req.body.provinceAddr
        , "districtAddr":req.body.districtAddr , "tambonAddr":req.body.tambonAddr , "postcodeAddr":req.body.postcodeAddr , "detailAddr":req.body.detailAddr,"active":status}
        
        
      filterUser.address.push(newObj);
        
       const otherUsers = usersProfile.userprofile.filter((val) => {

            if(val.userid !==  filterUser.userid){

                 return val;

            }
        });
        usersProfile.setUserProfile([...otherUsers , filterUser]);
    }

    //console.log(usersProfile.userprofile)

    await fsPromises.writeFile(
        path.join(__dirname , '..' , 'model' , 'userprofile.json'),
        JSON.stringify(usersProfile.userprofile)
    )
    
    //console.log(usersProfile.userprofile)

     res.json({code:1 ,"text":"success"});

}

const updateAddress = async (req , res) => {

    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204); 
    const findUser = users.user.find((list) => list.refreshToken === cookies.jwt);
    if(findUser === undefined) return res.sendStatus(204); 
    const filterUser = usersProfile.userprofile.find((data) => data.userid === findUser.id);
    if(filterUser){


        for(var i =0 ; i < filterUser.address.length; i++){

            if(filterUser.address[i].addrID === req.body.addrID){

                filterUser.address[i].nameAddr = req.body.nameAddr;
                filterUser.address[i].telAddr = req.body.telAddr;
                filterUser.address[i].provinceAddr = req.body.provinceAddr;
                filterUser.address[i].districtAddr = req.body.districtAddr;
                filterUser.address[i].tambonAddr = req.body.tambonAddr;
                filterUser.address[i].postcodeAddr = req.body.postcodeAddr;
                filterUser.address[i].detailAddr = req.body.detailAddr;
                filterUser.address[i].active = req.body.active;

            }

        }
       
        const otherUsers = usersProfile.userprofile.filter((val) => {

            if(val.userid !==  filterUser.userid){

                 return val;

            }
        });
        usersProfile.setUserProfile([...otherUsers , filterUser]);

        await fsPromises.writeFile(
            path.join(__dirname , '..' , 'model' , 'userprofile.json'),
            JSON.stringify(usersProfile.userprofile)
        )

        res.json({code:1 ,"text":"success"});
    }
}

const delAddress = async (req , res) => {

     console.log('id' , req.addrid);
     const findUser = usersProfile.userprofile.find((val) => val.username === req.user);
     if(findUser === undefined) return res.json({code:6 ,text:"username Not found"});
     const findAddr = findUser.address.filter((val) => val.addrID !== parseInt(req.addrid));
     //console.log(findAddr);
     findUser.address = findAddr;

     const otherUser = usersProfile.userprofile.filter((val) => val.username !==  req.user);

     usersProfile.setUserProfile([...otherUser , findUser]);

     await fsPromises.writeFile(
        path.join(__dirname , '..' , 'model' , 'userprofile.json'),
        JSON.stringify(usersProfile.userprofile)
    )

    res.json({code:1 ,"text":"success"});
     //console.log(findUser)
    }
    const updateActiveStatus = async (req , res) => {
        const user = req.body.username;
        const addrid = req.body.addrid;
        const findUser = usersProfile.userprofile.find((data) => data.username === user);
        if(findUser === undefined) res.json({code:6 ,text:"username Not found"});
        //console.log(findUser)
            for(var i =0 ; i < findUser.address.length; i++){

                 if(findUser.address[i].addrID === addrid){

                    findUser.address[i].active = true;
                 }else{
                    findUser.address[i].active = false;
                 }

            }

        const otherUser = usersProfile.userprofile.filter((val) => val.username !==  user);

        usersProfile.setUserProfile([...otherUser , findUser]);

        await fsPromises.writeFile(
            path.join(__dirname , '..' , 'model' , 'userprofile.json'),
            JSON.stringify(usersProfile.userprofile)
        )

        res.json({code:1 ,"text":"success"});
     }

    const changePassword = async(req , res) => {

        const cookies = req.cookies;
        if(!cookies?.jwt) return res.json({code:7 ,text:"cookie Not found"}).sendStatus(203); 
        const findPass = users.user.find((vals) => vals.refreshToken === cookies.jwt);
        if(findPass === undefined) return res.json({code:8 ,text:"find user not found"}).sendStatus(203); 
        const newPass = req.body.passnew;
        const encodePass = bcrypt.hashSync(newPass , 10);
        findPass.password = encodePass;
        findPass.refreshToken = "";

        const otherUser = users.user.filter((val) => val.username !==  findPass.username);

        users.setUser([...otherUser , findPass]);

        await fsPromises.writeFile(
            path.join(__dirname , '..' , 'model' , 'username.json'),
            JSON.stringify(users.user)
        )

        res.clearCookie('jwt', {httpOnly :true , sameSite :'None' ,secure : true});

        res.json({code:1 ,"text":"success"});

    }

module.exports = {getAddress , updateProfile , insertAddress , updateAddress , delAddress , updateActiveStatus , changePassword};