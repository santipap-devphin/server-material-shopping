const supply = {
    detail: require('../model/supply.json'),
    setSupply:function(data)  {this.detail = data;}
}
const fsPromises = require('fs').promises;
const path = require('path');
const {format} = require('date-fns');
const { json } = require('express');

const sortData = (arr) => {

    arr.sort((a,b) => {
       
        //if(b["id"] < a["id"]) return -1;
        //if(a["id"] > )
        return a["id"] - b["id"];

    })

}

const addSupply = async (req , res) => {
    const id = supply.detail.length > 0 ? supply.detail[supply.detail.length-1].id+1 : 1;
    const supplyname = req.body.supplyname;
    const supplycode = req.body.supplycode;
    const supplyprice = req.body.supplyprice;
    const status = req.body.status;
    const createdate =  `${format(new Date() , 'yyyyMMdd_HH:mm:ss')}`;
    const newsObj = {id , supplyname , supplycode , supplyprice , status , createdate}

    supply.setSupply([...supply.detail , newsObj]);

    await fsPromises.writeFile(
        path.join(__dirname , ".." , "model" , "supply.json"),
        JSON.stringify(supply.detail)
    )


    res.json({code:1 , msg:"success"});
    


}

const getSupplyByID = (req , res) => {

    const id = req.params.id;
    const findData = supply.detail.find((data)=> data.id === parseInt(id));
    if(findData === undefined) return res.json({code:4 , msg:"notfound"})
    res.json({code:1 , msg:"success" , list:findData});

}

const getSupplyAll = (req ,res) => {

    const data = supply.detail.length > 0 ? supply.detail : [];

    res.json({code:1 , list:data})

}

const updateSupply = async(req , res) =>{

    const id = req.body.id;
    const supplyname = req.body.supplyname;
    const supplycode = req.body.supplycode;
    const supplyprice = req.body.supplyprice;
    const status = req.body.status;
    const createdate =  `${format(new Date() , 'yyyyMMdd_HH:mm:ss')}`;
    const newObj = {
        id:parseInt(id) , supplyname , supplycode , supplyprice , status , createdate
    }

    const otherData = supply.detail.filter((data) => data.id !== parseInt(id));

    supply.setSupply([...otherData , newObj]);

    sortData(supply.detail);

    await fsPromises.writeFile(
         path.join(__dirname , ".." , "model" , "supply.json") ,
         JSON.stringify(supply.detail)
    );

    res.json({code:1  , msg:"success"});
    



}
const delSupply = async (req , res) => {

    const id = req.params.id;
    const finds = supply.detail.filter((data) => data.id !== parseInt(id))
    supply.setSupply([...finds]);
    sortData(supply.detail)

    await fsPromises.writeFile(
        path.join(__dirname , '..' , 'model' , 'supply.json'),
        JSON.stringify(supply.detail)
    )

    res.json({code:1 , msg:"success"});


}

module.exports = {addSupply ,getSupplyByID , getSupplyAll , updateSupply , delSupply}