const sizeprd = {
    size : require('../model/sizeproduct.json'),
    setSize : function (data) { this.size = data }
}
const {format} = require('date-fns');
const fsPromises = require('fs').promises;
const path = require('path');

const sortData = (arr) => {

    arr.sort((a , b) => {
        
        if(a["id"] > b["id"]) return 1; 
        if(b["id"] > a["id"])return -1;
        return 0;

    })

}

const addSize = async(req , res) => {

    const id = sizeprd.size.length > 0 ? sizeprd.size[sizeprd.size.length-1].id +1 : 1;
    const unitname = req.body.unitname;
    const unitnameen = req.body.unitnameen;
    const unitdetail = req.body.unitdetail;
    const status = req.body.unitstatus;
    const createdate =  `${format(new Date() , 'yyyyMMdd_HH:mm:ss')}`;

    const newObj = {
        id,unitname ,unitnameen , unitdetail , status , createdate
    };
    //console.log(newObj)

    sizeprd.setSize([...sizeprd.size , newObj]);

    sortData(sizeprd.size);

    //console.log(sizeprd.size)

    await fsPromises.writeFile(
        path.join(__dirname , '..' , 'model' , 'sizeproduct.json'),
        JSON.stringify(sizeprd.size)
    )


    res.json({code:1 , msg:"success"})



}

const getSizeByID = (req , res) => {

    const id = req.params.id;
    const findsData = sizeprd.size.find((list) => list.id === parseInt(id))
    if(findsData === undefined) return res.json({code:4 , msg:"not found"});
    res.json({code:1 , list:findsData});
    

}
const getSizeProductAll = (req , res) => {

    res.json({code:1 , list:sizeprd.size})
}

const updateSize = async (req ,res) => {

    const id = req.body.id;
    const unitname = req.body.unitname;
    const unitnameen = req.body.unitnameen;
    const unitdetail = req.body.unitdetail;
    const status = req.body.unitstatus;
    const createdate =  `${format(new Date() , 'yyyyMMdd_HH:mm:ss')}`;

    const newObj = {
        id:parseInt(id),unitname ,unitnameen , unitdetail , status , createdate
    };

    const otherSize = sizeprd.size.filter((data) => data.id !== parseInt(id));

    sizeprd.setSize([...otherSize , newObj]);

    sortData(sizeprd.size);

   
    await fsPromises.writeFile(
        path.join(__dirname , '..' , 'model' , 'sizeproduct.json'),
        JSON.stringify(sizeprd.size)
    )
    
    res.json({code:1 , "msg" : "success"});

}
const delSize = async (req , res) => {

    const id = req.params.id

    const delData = sizeprd.size.filter((data) => data.id !== parseInt(id));

    sizeprd.setSize(delData);

    sortData(sizeprd.size);

    await fsPromises.writeFile(
        path.join(__dirname , '..' , 'model' , 'sizeproduct.json'),
        JSON.stringify(sizeprd.size)
    )

    res.json({code:1 ,"msg": "success"})

}

module.exports = {addSize , getSizeProductAll , getSizeByID , updateSize , delSize}