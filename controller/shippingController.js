const checkout = {
    detail: require('../model/checkout.json') , 
    setCheckout:function(data){
         this.detail = data;
    }
}

const fsPromises = require('fs').promises;
const path = require('path');

const getAllShipping = (req ,res) => {

    const data = checkout.detail.filter((order) => order.status === "closed");
    res.json({code:1 , list: data})


}
const updateShippingProbiem = async (req , res) => {

    const orderID = req.body.order;
    const shippingStatus = req.body.shipstatus;
    const shippingText = req.body.shiptext;
    const finds = checkout.detail.find((item) => item.orderID === orderID);
    if(finds === undefined) return res.json({code:6 , msg:"data not found"});
    finds["shipping"] = false;
    finds["shippingstatus"] = shippingStatus;
    finds["shippingtext"] = shippingText;
    const others = checkout.detail.filter((item) => item.orderID !==  orderID);
    checkout.setCheckout([...others , finds]);
    await fsPromises.writeFile(
        path.join(__dirname , '..' , "model" , "checkout.json"),
        JSON.stringify(checkout.detail)
    )
    res.json({code:1})
}

const updateRecheck = async (req , res) => {
    const orderID = req.body.order;
    const shippingStatus = req.body.shipstatus;
    const shippingText = req.body.shiptext;
    const finds = checkout.detail.find((item) => item.orderID === orderID);
    if(finds === undefined) return res.json({code:6 , msg:"no data"});
    finds["shipping"] = true;
    finds["shippingstatus"] = shippingStatus;
    if(shippingStatus === "resend"){
        finds["shippingNo"] = shippingText;
        finds["shippingtext"] = "";
       
    }else{
        finds["shippingtext"] = shippingText;
    }
    const otherArr = checkout.detail.filter((item) => item.orderID !==  orderID);
    checkout.setCheckout([...otherArr , finds]);
    await fsPromises.writeFile(
        path.join(__dirname , '..' , "model" , "checkout.json"),
        JSON.stringify(checkout.detail)
    )
    res.json({code:1})

    
}

module.exports = {getAllShipping , updateShippingProbiem , updateRecheck}