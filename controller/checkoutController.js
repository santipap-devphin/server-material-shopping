const checkout = {
    detail: require('../model/checkout.json') , 
    setCheckout:function(data){
         this.detail = data;
    }
}

const userProfile = require('../model/userprofile.json');

const fsPromises = require('fs').promises;
const path = require('path');
const {format} = require('date-fns');

const addCheckout = async (req , res) => {

    const sortData = checkout.detail.sort((a,b) => {

        return new Date(a["createDate"]) - new Date(b["createDate"])

    })
    const orderID = sortData.length > 0 ? sortData[sortData.length-1].orderID : "OR-"+1;
    
    let spdata = "";
    let lastChar = "";
    var newObj = {};

    if(orderID.indexOf("-") > -1){

        var sp = orderID.split("-");
        spdata = Number(sp[1])+1;
        lastChar = "OR-"+spdata;

    }
    newObj["orderID"] = lastChar;

    for(const[key , value] of Object.entries(req.body)){

        newObj[key] = value;

    }
    newObj["orderDate"] = `${format(new Date() , 'yyyyMMdd_HH:mm:ss')}`;
    newObj["createDate"] = `${format(new Date() , 'MMMM dd ,yyyy pp')}`;
    newObj["status"] = "new";
    newObj["payment"] = false;
    newObj["notify"] = false;

    checkout.setCheckout([...checkout.detail , newObj])

    await fsPromises.writeFile(
        path.join(__dirname , '..' , 'model' , 'checkout.json') , 
        JSON.stringify(checkout.detail)
    )
    res.json({code:1 , orderID:lastChar})


}

const getOrderCheckOutByUser = (req , res) => {

    const id = req.params.id;
    const findsData =  checkout.detail.filter((item) => item.userID === Number(id));
    if(findsData === undefined) return res.json({code:6 , msg:"data not found"});
   
    findsData.sort((a,b) => {

        return new Date(b["createDate"]) - new Date(a["createDate"]);

    })

    res.json({code:1 , list:findsData})

}

const updateNotifyOrder = async (req , res) =>{
    const id = req.params.id;
    const slip = req.body.slip;
    const findData = checkout.detail.find((item) => item.orderID ===  id);
    if(findData === undefined) return res.json({code:6 , msg:"data not found"});
    findData["notify"] = true;

    findData["imgslip"] = slip;

    const otherData = checkout.detail.filter((data) => data.orderID !== id);

    checkout.setCheckout([...otherData , findData]);

    await fsPromises.writeFile(
        path.join(__dirname , '..' , 'model' , 'checkout.json') , 
        JSON.stringify(checkout.detail)
    )

    res.json({code:1 , orderID:id})
 }

 const updateCancelOrder = async (req , res) => {
    const ids = req.params.id;
    const findsData = checkout.detail.find((item) => item.orderID === ids);
    if(findsData === undefined) return res.json({code:6 , msg:"not found"});
    findsData["status"] = "cancel";
    findsData["payment"] = false;
    findsData["notify"] = false;

    //console.log(findsData)

    const othersData = checkout.detail.filter((item) =>  item.orderID !== ids);
    checkout.setCheckout([...othersData , findsData]);
    

    await fsPromises.writeFile(
        path.join(__dirname , ".." ,"model" , "checkout.json") , 
        JSON.stringify(checkout.detail)
    )

    res.json({code:1})

 }
 const updatePayment = async (req , res) => {

    const orderID = req.body.orderID; 
    const finds = checkout.detail.find((order) => order.orderID === orderID);
    if(finds === undefined) return res.json({code: 6 , msg:"not found"});
    finds["status"] = "pending";
    finds["payment"] = true;
    const others = checkout.detail.filter((order) => order.orderID !==  orderID);
    checkout.setCheckout([...others , finds]);
    await fsPromises.writeFile(
        path.join(__dirname , ".." ,"model" , "checkout.json") , 
        JSON.stringify(checkout.detail)
    )
    res.json({code:1})
 }
 const getCheckOutAll = (req , res) =>{

    const data = checkout.detail.length > 0 ? checkout.detail : [];
    res.json({code:1 , list:data })
 }
 const checkOutProfile = (req , res) => {

    const userID = req.params.id;
    const findsData = userProfile.find((user) => user.userid ===  Number(userID));
    if(findsData === undefined) return res.json({code:6 , msg:"not found"});
    const addrActive = findsData.address.filter((data) => data.active === true)
    findsData["address"] = addrActive;
    res.json({code:1 , list:findsData});

 }
 const addShipping = async (req , res) => {

    const id = req.body.id;
    const shipno = req.body.shipno;
    const finds = checkout.detail.find((item) => item.orderID ===  id);
    if(finds === undefined) return res.json({code:6 , msg:"not found"})
    finds["status"] = "closed";
    finds["shippingNo"] = shipno;
    finds["shipping"] = true;
    const other = checkout.detail.filter((item) => item.orderID !==  id);
    checkout.setCheckout([...other , finds]);

    await fsPromises.writeFile(
        path.join(__dirname , ".." ,"model" , "checkout.json") , 
        JSON.stringify(checkout.detail)
    )

    res.json({code:1})
 }

module.exports = {addCheckout , 
                  getOrderCheckOutByUser , 
                  updateNotifyOrder ,
                  updateCancelOrder,
                  getCheckOutAll ,
                  checkOutProfile ,
                  updatePayment , 
                  addShipping
                }