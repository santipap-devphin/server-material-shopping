const payment = {
    detail : require('../model/payment.json'),
    setPayment:function(data){
        this.detail = data;
    }
}

const fsPromises = require('fs').promises;
const path = require('path');
const {format} = require('date-fns');

const sortData = (arr) => {

    arr.sort((a,b) => {return a["id"] - b["id"]})

}

const addPayment = async (req , res) => {
    const id = payment.detail.length > 0 ? payment.detail[payment.detail.length-1].id+1 : 1;
    var newobj = {};
    newobj["id"] = parseInt(id);
    for (const [key, value] of Object.entries(req.body)) {

        newobj[key] = value;
        //console.log(`${key}: ${value}`);
    }
    newobj["createdate"] = `${format(new Date() , 'yyyyMMdd_HH:mm:ss')}`;
   
    payment.setPayment([...payment.detail , newobj]);

    await fsPromises.writeFile(
        path.join(__dirname , ".." , "model" , "payment.json") , 
        JSON.stringify(payment.detail)
    )

    res.json({code:1 , msg:"success"});

}
const getPaymentByID = (req , res) => {

    const id = req.params.id;
    const findData = payment.detail.find((data) => data.id === parseInt(id));
    if(findData === undefined) return res.json({code:4 , msg:"not found"});
    res.json({code:1 , msg:"success" , list:findData})

}
const updatePayment = async (req , res) => {

    if(typeof req.body !== "object") return res.json({code:5 , msg:"valid data"})
    var newobj = {};
    for (const [key, value] of Object.entries(req.body)) {

        if(key === "id"){
            newobj[key] = parseInt(value);
        }else{
            newobj[key] = value;
        }
        
       
    }
    newobj["createdate"] = `${format(new Date() , 'yyyyMMdd_HH:mm:ss')}`;
    const otherData = payment.detail.filter((data) => data.id !== newobj["id"])

    payment.setPayment([...otherData , newobj]);

    sortData(payment.detail);

    await fsPromises.writeFile(
        path.join(__dirname , ".." ,"model" , "payment.json"),
        JSON.stringify(payment.detail)
    )

   
    res.json({code:1 , msg:"success"})


}
const getPaymentAll = (req , res) =>{

    const data = payment.detail.length > 0 ? payment.detail : [];

    res.json({code:1 , list:data})


}
const delPayment =  async (req , res) =>{
    const id =  req.params.id;
    console.log(id)
    const delData = payment.detail.filter((data) => data.id !== parseInt(id))

    console.log(delData)
    payment.setPayment(delData);

    sortData(payment.detail);

    await fsPromises.writeFile(
        path.join(__dirname , ".." , "model" , "payment.json"),
        JSON.stringify(payment.detail)
    )
    res.json({code:1 , msg:"success"});


}

module.exports = {addPayment , getPaymentByID , updatePayment , getPaymentAll , delPayment}