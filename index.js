const http = require('http')
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 7000;
const server = http.createServer(app);
const jwt = require('jsonwebtoken');
const credentials = require('./middleware/credentials');
const confCors = require('./config/corsOption')
const cookieParser = require('cookie-parser');
const veriflyJWT = require('./middleware/veriflyJWT');
const veriflyJWTForGet = require('./middleware/veriflyJWTForGet');
const {logEvent} = require('./middleware/logEvent');
const EventEmitter = require('events'); 
class MyEmitter extends EventEmitter {};
const myemitter = new MyEmitter();
const multer = require('multer');
const fsPromises = require('fs').promises;
const path = require('path');
const messageuser = {
    message : require('./model/messageuser.json'),
    setMessageUser : function (data) { this.message = data }
};
const messageadmin = {
    message : require('./model/message.json'),
    setMessage : function (data) { this.message = data }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
         var newsfile = file.originalname.replace(" ","-");
        
        cb(null,Date.now()+"_"+newsfile)
    }
})
const uploadmulti = multer.diskStorage({
    destination: function (req, file, cb) {
      
        cb(null, 'public/imgprd/')
    },
    filename: function (req, file, cb) {
         const match = ["image/png", "image/jpeg"];
         if (match.indexOf(file.mimetype) === -1) {
            var message = `${file.originalname} is invalid. Only accept png/jpeg.`;
            return callback(message, null);
          }
          const fs = require('fs')
          const dir = 'public/imgprd/'
          const fileschk = fs.readdirSync(dir)
         
          console.log(file)
          if(fileschk.indexOf(file.originalname) != -1)
            {  
                    console.log('have')
            }else{

                var newsfile = file.originalname.replace(" ","-");
                cb(null,Date.now()+"_"+newsfile)
                console.log('no')
            }
         }
})
const upload = multer({ storage: storage })

const multi_upload  = multer({ storage: uploadmulti });

    
app.use(credentials); 

app.use(cors(confCors));

app.use(express.urlencoded({ extended : false}));

// built-in middleware for json
app.use(express.json({limit: '50mb'}));

//app.use(express.json());

app.use(cookieParser());

//app.use(express.limit(100000000));



app.get('/', (req, res) => {
    res.json({server:"server running"})
})

const io = require('socket.io')(server , {
    cors : {origin: "http://localhost:3002", methods: ["GET", "POST"] , credentials: true}
});

io.on('connection', (socket) => {

    console.log(`socket connect`)

    socket.emit('connect-success' , {msg : `connect socket` ,socketid:socket.id , status : 1})

    //socket.emit('connect-dashboard-success' , {msg : `connect dashboard socket` ,socketid:socket.id , status : 1})

    socket.on('chat-message-from-user', async (message, callback) => {

        var reNewMsg = [];
        var newmap = [];

        messageuser.setMessageUser([...messageuser.message , message]);

        await fsPromises.writeFile(
            path.join(__dirname , '.' , 'model' , 'messageuser.json'),
            JSON.stringify(messageuser.message)
        )

        socket.emit('response-message-from-user', message);

        for(var i = 0 ; i < messageuser.message.length; i++)
        {
           
           if(messageuser.message[i].id === message.id && messageuser.message[i].status === "unread"){
               
                //console.log(messageuser.message[i])
               
                newmap.push(messageuser.message[i])

           }

       }
       //console.log(newmap.length)
       reNewMsg = newmap.length;
       //console.log(reNewMsg)

       message["number"] = reNewMsg;
       message["socketid"] = socket.id;
       //console.log(message)
       //io.emit('list-message-broadcast-admin', message); //ส่งไปที่หน้า chat admin// อันนี้ทำงานจะส่งข้อมูลกลับไปที่ client ที่ร้องขอ
       socket.broadcast.emit("list-message-broadcast-admin", message); // อันนี้จะทำงาน ทุก client ที่เปิดโปรแกรมไว้

        callback("ok");
    });

    socket.on('chat-message-from-admin', async (message, callback) => {

        //console.log(message.msgin.id)

        message.msgin.id = messageadmin.message.length+1;

        messageadmin.setMessage([...messageadmin.message , message.msgin]);

        await fsPromises.writeFile(
           path.join(__dirname , '.' , 'model' , 'message.json'),
           JSON.stringify(messageadmin.message)
        )

       message.msg["socketid"]  = socket.id;

       io.emit('message-from-admin', message.msg); // io ส่งข้อมูลกลับไปที่ 
       

       //ถ้าใช้ io จะส่งข้อมูลกลับไปที่ client ที่เปิด โปรแกรมอยู่ทั้งหมด แต่ถ้าใช้ socket จะส่งข้อมูลกลับไปที่ client ที่ร้องขอเท่านั้น
       socket.emit('result-message-admin', message.msg); // อันนี้ทำงานจะส่งข้อมูลกลับไปที่ client ที่ร้องขอ
       //io.emit('list-message', message.msg); // อันนี้ทำงานจะส่งข้อมูลกลับไปที่ client ที่ร้องขอ

       //socket.broadcast.emit("list-message",{message:message.name,list_message:arr2}); // อันนี้จะทำงาน ทุก client ที่เปิดโปรแกรมไว้
       
       callback("ok");
   });
   socket.on('register-new-member', async (message, callback) => {

    let userID = message.userID;
    let username = message.username;
    let msg = message.msg;
    let dates = message.date;
    let registerDate = message.regisDate;
    
    const newObj = {id:messageadmin.message.length > 0 ? messageadmin.message[messageadmin.message.length-1].id + 1  : 1
        ,username:"admin"
        ,msg
        ,"userId":userID.toString()
        ,"date":registerDate}

     messageadmin.setMessage([...messageadmin.message ,newObj]);

    await fsPromises.writeFile(
        path.join(__dirname , '.' , 'model' , 'message.json') , 
        JSON.stringify(messageadmin.message)
    )

    var callbackData = {'userId':userID , username ,'date':dates, status : 0}

    socket.broadcast.emit("callback-register-new-member",callbackData);

    callback("ok");
    
    });

})


app.use('/upload', upload.single('file'), require('./routes/uploadimgcate'))

app.use('/uploadproduct', multi_upload.array('file') , require('./routes/uploadproduct'))

app.use('/uploads', express.static(path.join(__dirname,'public','uploads'))) /**หากต้องการ referrance file ต้องทำ static path ก่อนไม่งั้นจะไม่สามารถเห็น file รูปได้ */

app.use('/uploadsproduct', express.static(path.join(__dirname ,'public','imgprd')))

app.use('/checkout', require('./routes/checkout'));

app.use('/shipping', require('./routes/shipping'));

app.use('/message', require('./routes/messagedata'));

app.use("/sizeproduct", require("./routes/sizeProduct"));

app.use("/promotion" , require('./routes/promotion'));

app.use("/product" , require('./routes/product'));

app.use("/blogs" , require('./routes/blogs'));

app.use("/coupon", require("./routes/coupon"));

app.use("/tags", require("./routes/tags"));

app.use("/supply", require("./routes/supply"));

app.use("/payment", require("./routes/payment"));

app.use("/getcategory", require("./routes/getCategory"));

app.use("/delcategory/:id" , (req , res , next) => {

    req.cateid = req.params.id;
  
    //console.log(req.params)
    next();
}, require("./routes/delCategory"));

app.use("/userregister", require("./routes/userRegister"));

app.use("/userprofile" , require("./routes/userProfile"));

app.use('/logout', (req , res , next) =>{

    myemitter.emit('logout',`message : ${req.body.username} logout from website`);
    next();

} , require('./routes/logOut'));

app.use('/refresh', (req , res , next) => {
    next();
} , require('./routes/reqRefreshToken'))

app.use('/chkUserLogin', (req , res , next) => {

    myemitter.emit('login',`message : ${req.body.username} login from website`);
    next();
} , require('./routes/chkUserForLogin'))

app.use('/genToken', (req , res , next) => {
    next();
} , require('./routes/getToken'))
app.use('/genrefreshToken', (req , res , next) => {
    next();
} , require('./routes/getRefreshToken'))
app.use('/genbcypt', (req , res , next) => {
    next();
} , require('./routes/getBcrypt'))



myemitter.on('login' , (msg) => logEvent(msg , 'loginLogs.txt'));

myemitter.on('logout' , (msg) => logEvent(msg , 'logoutLogs.txt'));

//app.use(veriflyJWTForGet);
//app.use("/upload" , require('./routes/uploadimgcate'));

app.use("/addcategory" , require('./routes/addCategory'))

app.use("/updateactiveaddr" , require('./routes/updateActiveAddr'));

app.use("/deladdress/:id/:username" ,(req , res , next) => {

    req.addrid = req.params.id;
    req.user =  req.params.username;
    //console.log(req.params)
    next();
}, require('./routes/delAddress'));

app.use('/getaddress/:username', (req , res , next) => {
    
    req.user = req.params.username;
    next();
} , require("./routes/getAddress"))




app.use(veriflyJWT);

app.use("/updateprofile" , require('./routes/updateProfile'));

app.use("/changepass" , require('./routes/changePass'));

app.use("/insertaddress" , require('./routes/insertAddress'));

app.use("/updateaddress" , require('./routes/updateAddres'));

app.use('/alluser' , require('./routes/getAlluser'));




server.listen(PORT , () => console.log(`Server running on port ${PORT}`) )