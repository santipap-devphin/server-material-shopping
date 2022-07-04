const promotion = {
    detail:require('../model/promotion.json'),
    setPromotion:function(data){
            this.detail = data;
    }
}

const fsPromise = require('fs').promises;
const path = require('path');
const {format} = require('date-fns');


const sordData = (arr) => {

    arr.sort((a,b) => {

        return a["id"] - b["id"];

    })

}

const addPromotion = async (req , res) => {
 const ids = promotion.detail.length > 0 ? promotion.detail[promotion.detail.length-1].id+1 : 1;
 let newobj = {};
 newobj["id"] = ids;
    for (const [key, value] of Object.entries(req.body)) {
        
         newobj[key] = value;
            
    }
 const createdate =  `${format(new Date() , 'yyyyMMdd_HH:mm:ss')}`;
 newobj["createdate"] = createdate;

 promotion.setPromotion([...promotion.detail , newobj])

 await fsPromise.writeFile(
    path.join(__dirname , ".." , "model" , "promotion.json"),
    JSON.stringify(promotion.detail)
 )

 res.json({code:1})


}
const getPromotionByID = (req , res) => {

    const idd = req.params.id;
    const findData = promotion.detail.find((item) => item.id === parseInt(idd));
    if(findData === undefined) return res.json({code:6 , msg:"not found"});
    res.json({code:1 , list:findData});

}

const getPromotionAll = (req ,res) => {

    const data = promotion.detail.length > 0 ? promotion.detail : [];

    //console.log(promotion.detail)
    
    res.json({code:1 , list:data});

}

const updatePromotion = async (req , res) => {

    let newobj = {};
    
    for (const [key, value] of Object.entries(req.body)) {
        
        if(key === "id"){
            newobj[key] = parseInt(value);
        }else{
            newobj[key] = value;
        }
       
   }
   const createdate =  `${format(new Date() , 'yyyyMMdd_HH:mm:ss')}`;
   newobj["createdate"] = createdate;
   const others = promotion.detail.filter((item) => item.id !== newobj["id"]);
   promotion.setPromotion([...others , newobj]);
   sordData(promotion.detail);

   await fsPromise.writeFile(
        path.join(__dirname , ".." , "model" , "promotion.json"),
        JSON.stringify(promotion.detail)
   )

   res.json({code:1});



}
const delPromotion = async (req ,res) => {

    const id = req.params.id;
    
    const filterData = promotion.detail.filter((item) => item.id !== parseInt(id));
    
    promotion.setPromotion(filterData);

    sordData(promotion.detail);

    await fsPromise.writeFile(
        path.join(__dirname , ".." , "model" , "promotion.json"),
        JSON.stringify(promotion.detail)
   )

   res.json({code:1});


}
module.exports = {
    addPromotion , 
    getPromotionByID , 
    getPromotionAll , 
    updatePromotion , 
    delPromotion
}