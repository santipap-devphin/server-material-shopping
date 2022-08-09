const coupon = {
    detail: require('../model/coupon.json'),
    setCoupon:function(data){
        this.detail = data;
    }
}

const fsPromises = require('fs').promises;
const path = require('path');
const {format} = require('date-fns');
const { json } = require('express');

const sortData = (arr) => {

    arr.sort(function(a,b) {
        return a["id"]- b["id"]
    })

}
const addCoupon = async(req , res) => {

     const id = coupon.detail.length > 0 ? coupon.detail[coupon.detail.length -1].id+1 : 1;
     var newobj = {};
     newobj["id"] = parseInt(id);
     for (const [key, value] of Object.entries(req.body)) {

        newobj[key] = value;
       
    }
    newobj["createdate"] = `${format(new Date() , 'yyyyMMdd_HH:mm:ss')}`;
    coupon.setCoupon([...coupon.detail , newobj]);

    await fsPromises.writeFile(
        path.join(__dirname , ".." ,"model" , "coupon.json"),
        JSON.stringify(coupon.detail)
    )

    res.json({code:1,msg:"success"})

}
const getCouponByID = (req , res) => {

    const id = req.params.id;
    const findData = coupon.detail.find((data) => data.id === parseInt(id));
    if(findData === undefined) return res.json({code:5 , msg:"notfound"})
    res.json({code:1 , msg:"success" , list:findData})

}
const getCouponAll = (req , res) =>{

    const data = coupon.detail.length > 0 ? coupon.detail : [];

    res.json({code:1, msg:"success" , list:data});

}
const chkCoupon = (req , res) => {

    const reqParam = req.params.id;
    const findcou = coupon.detail.find((data) => data.codecoupon === reqParam)
    if(findcou === undefined) return res.json({code:6 , msg:"coupon not found"});
    if(findcou.status !== true){
        return res.json({code:7 , msg:"coupon expire"});
    }
    else if(Number(findcou.limitcoupon) === 0){

        return res.json({code:8 , msg:"coupon limit"});
    }
    
    else{

        res.json({code:1 , list:findcou});
    }

}
const updateCoupon = async (req , res) => {
    
    if(typeof req.body && req.body.id !== "")
    {
        var newobj = {};
        for (const [key, value] of Object.entries(req.body)) {

             if(key === "id"){
                newobj[key] = parseInt(value);
             }else{
                newobj[key] = value;
             }
        }
        newobj["createdate"] = `${format(new Date() , 'yyyyMMdd_HH:mm:ss')}`;
        const otherData = coupon.detail.filter((data) => data.id !== newobj["id"]);
        coupon.setCoupon([...otherData , newobj]);
        sortData(coupon.detail);

        await fsPromises.writeFile(
            path.join(__dirname , ".." , "model" , "coupon.json"),
            JSON.stringify(coupon.detail)
        )

        res.json({code:1 ,msg:"success"})
    }else{
        res.json({code:6 , msg:"no object send"});
    }
    


}
const delCoupon = async (req , res) => {
    const id = req.params.id;
    const filds = coupon.detail.filter((data) => data.id !== parseInt(id));
    coupon.setCoupon(filds);
    sortData(coupon.detail);

    await fsPromises.writeFile(
            path.join(__dirname , ".." , "model" , "coupon.json"),
            JSON.stringify(coupon.detail)
    )

    res.json({code:1 , msg:"success"});

}

module.exports = {addCoupon , getCouponByID , getCouponAll , updateCoupon , delCoupon , chkCoupon}