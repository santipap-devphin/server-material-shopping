const products = {
    detail:require('../model/products.json') ,
    setProduct:function(data){
        this.detail = data
    }
}

const fsPromise = require('fs').promises;
const path = require('path');
const {format} = require('date-fns');

const sortData = (arr) => {

    arr.sort((a,b) => {

        return a["id"] - b ["id"]

    })

}
const addProduct = async (req , res) => {

     const id = products.detail.length > 0 ? products.detail[products.detail.length-1].id + 1 : 1;
     //console.log(req.body)
     var newobj = {};
    
     newobj["id"] = parseInt(id);

     console.log(req.body.imgMain)
     for (const [key, value] of Object.entries(req.body)) {
        //console.log(key , value)
            newobj[key] = value;
    }
    
    const createdate =  `${format(new Date() , 'yyyyMMdd_HH:mm:ss')}`;
    newobj["createdate"] = createdate;

    //console.log(newobj)
    
    products.setProduct([...products.detail , newobj ]);

    //console.log(products.detail)

    await fsPromise.writeFile(
        path.join(__dirname , '..' , 'model' , 'products.json'),
        JSON.stringify(products.detail)
    )

    const check = products.detail.find((data)=> data.id === id);
    if(check !== undefined) res.json({code:1 , msg:"success"});
    



}
const getProductAll = (req , res) => {

     const data = products.detail.length > 0 ? products.detail : [];

      res.json({code:1 ,list:data});

}
const getProductByID  = (req , res) => {
    const params = req.params.id;
    const filterData = products.detail.find((data) => data.id === parseInt(params));
    if(filterData === undefined) return res.json({code:6 , msg:"data not found"});
    res.json({code:1 , list:filterData});

}
const updateProduct = async (req , res) => {

    let newobj = {};
    for (const [key, value] of Object.entries(req.body)) {
        //console.log(key , value)
            if(key === "id"){
                newobj[key] = parseInt(value);
            }else{
                newobj[key] = value;
            }
            
    }
    const createdate =  `${format(new Date() , 'yyyyMMdd_HH:mm:ss')}`;

    newobj["createdate"] = createdate;
    
    const others = products.detail.filter((data) => data.id !== newobj["id"]);
    
    products.setProduct([...others , newobj]);

    sortData(products.detail);

    await fsPromise.writeFile(
        path.join(__dirname , ".." , "model" , "products.json"),
        JSON.stringify(products.detail)
    )

   res.json({code:1})


}
const delProduct = async (req , res) => {
    const id = req.params.id;
    const findData = products.detail.filter((data) => data.id !== parseInt(id));
   
    products.setProduct(findData);

    sortData(products.detail);


    await fsPromise.writeFile(
        path.join(__dirname , '..' , 'model' , 'products.json'),
        JSON.stringify(products.detail)
    )

    res.json({code:1})

}
module.exports = {addProduct , getProductAll , getProductByID , updateProduct , delProduct}