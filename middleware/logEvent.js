const {format} = require('date-fns');
const uuid = require('uuid').v4;

const fs = require('fs');
const fsPromise = fs.promises;
const path = require('path');

const logEvent = async (message , filename) => {
    
    const datetime =  `${format(new Date() , 'yyyyMMdd\tHH:mm:ss')}`;
    const logtime = `${datetime} \t${uuid()} \t${message} \n`;
    console.log(logtime);

    try {

        if(!fs.existsSync(path.join(__dirname , '..' , 'logs'))){

            await fsPromise.mkdir(path.join(__dirname , '..' , 'logs'));

        }

        await fsPromise.appendFile(path.join(__dirname,'..','logs', filename) , logtime)

        
    } catch (err) {
        console.error(err);
    }



}

module.exports = {logEvent}