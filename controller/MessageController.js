const msgAdmin = {
    message : require('../model/message.json'),
    setMessage : function (data) { this.message = data }
};
const messageuser = {
    message : require('../model/messageuser.json'),
    setMessageUser : function (data) { this.message = data }
};
const listuser  = {
    user: require('../model/username.json') , 
    setUser:function(data){
      this.user = data
    }
  }

const fsPromises = require('fs').promises;
const path = require('path');
const { format }  = require('date-fns');

const getMsgUserByID = (req , res) => {

const id = req.params.id;
const filterMessage = messageuser.message.filter((msg) => msg.id === Number(id));
var MessAdmin = [];

for(const [key ,value] of Object.entries(msgAdmin.message)){

    if(Number(value.userId) === Number(id)){
        
        MessAdmin.push({id: Number(value.userId) ,img:null, date:value.date , message:value.msg , name:value.username })
    }
}
//console.log(msgAdmin.message)
//console.log(MessAdmin)
const mergeArr = filterMessage.concat(MessAdmin);

mergeArr.sort((a ,b) => {

    return new Date(a["date"]) - new Date(b["date"])

})

console.log(mergeArr)

res.json(mergeArr)

}

const getMessageUserAll = (req , res) => {

    var newArr = [];
    var messageunread  = [];
    let msgLast ={};

    const filterUserRole =  listuser.user.filter((users) => users.roles["Admin"] === undefined);

    for(var i = 0; i < filterUserRole.length; i++){

        newArr.push({userId:filterUserRole[i].id , username:filterUserRole[i].username  ,date:filterUserRole[i].registerTime , message:null , status:0})
    }


    for(var i = 0; i < messageuser.message.length; i++){

       
        if(messageuser.message[i].status === "unread"){
            messageunread.push(messageuser.message[i].id);
          
        }
        msgLast[messageuser.message[i].id] = messageuser.message[i]; //message id กับ id user คืออันเดียวกัน
        
        //console.log(messageuser.message[j].id)


    }
    //console.log(msgLast)
    const counts = {};
    messageunread.forEach(item => {
            //console.log(counts)
           if (counts[item]) {
               counts[item] +=1
               return
           }
           counts[item] = 1
       })

       for (const [key, value] of Object.entries(msgLast)) {
           
        for(var j =0 ; j < newArr.length; j++){

            if(newArr[j].userId.toString().includes(key) === true){

                   //console.log(newData[j].userId)
                   newArr[j].message = value.message
                   
                   if(counts[key] !== undefined){

                        newArr[j].status = counts[key];
                   }else{
                        newArr[j].status = 0;
                   }
                   
            }
            
            
            
       }
    }
    newArr.sort((a , b) => {

        return b["userId"] - a["userId"]

    })

    res.json(newArr);
}

const reqMsgUserForAdmin = async (req , res) => {

    const id = req.body.id;
    var newMess = [];
    const filterMsgUser = messageuser.message.filter((msg) => msg.id === Number(id));
    const filterMsgAdmin = msgAdmin.message.filter((msg) => Number(msg.userId) === Number(id));
    if(filterMsgUser.length === 0 && filterMsgAdmin.length ===0){
        return res.json({code:6 , msg : "msg not found"});
    }
    else{

        if(filterMsgUser.length > 0){

            for(var i = 0; i < filterMsgUser.length; i++){
    
                if(filterMsgUser[i].status  === "unread"){
       
                   filterMsgUser[i].status = "read";
                }
           }
       
           const otherMsgUser = messageuser.message.filter((mess) => mess.id !== Number(id))
           var listMsg = otherMsgUser.concat(filterMsgUser);
           messageuser.setMessageUser(listMsg);
       
           await fsPromises.writeFile(
               path.join(__dirname , '..' , 'model' , 'messageuser.json') , 
               JSON.stringify(messageuser.message)
           )
             
        }
    
        if(filterMsgAdmin.length > 0){
    
            for(const [key , value] of Object.entries(msgAdmin.message))
            {
                if(value.userId === id){
        
                    newMess.push({id:Number(value.userId),img:null,date:value.date,name:value.username,message:value.msg,status:"read"})
                }
        
            }
        
            var lastMsg = filterMsgUser.concat(newMess);
            
            lastMsg.sort(function(a, b) {
              
                return new Date(a["date"]) - new Date(b["date"]);
            });
            res.json({code:1 , list:lastMsg})
        }
    }
}

module.exports = {getMsgUserByID , getMessageUserAll , reqMsgUserForAdmin}