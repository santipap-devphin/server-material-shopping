
const categorys = {
    category : require('../model/category.json'),
    setCate : function (data) { this.category = data }
}

const {format} = require('date-fns');
const fsPromises = require('fs').promises;
const path = require('path');

const sortData = (arr) => {

    arr.sort(function(a,b) {
       
        if(a["id"] < b["id"]) return -1; // ขยันตำแน่งไปด้านหัลัง
        if(a["id"] > b["id"]) return 1; // ขยับตำแหน่งไปด้านหน้า
        return 0;

    })

}

const addCategory = async (req , res) => {

    const catename = req.body.catename;
    const catenameen = req.body.catenameen;
    const catedetail = req.body.catedetail;
    const imgfile = req.body.imgfile;
    const catestatus = req.body.status;
    const id = categorys.category.length > 0 ? categorys.category[categorys.category.length-1].id + 1 : 1
    const createdate =  `${format(new Date() , 'yyyyMMdd_HH:mm:ss')}`;
    const newobj = {
                    id ,
                    catename , 
                    catenameen,
                    catedetail,
                    imgfile,
                    status:catestatus,
                    createdate
                   }
                   

    categorys.setCate([...categorys.category , newobj]);

    sortData(categorys.category);
    
    await fsPromises.writeFile(
        path.join(__dirname , '..' , 'model' , 'category.json'),
        JSON.stringify(categorys.category)
    )

    console.log(newobj)

    res.json({code:1 , msg:"success"});


}



const updateCategory = async(req , res) => {

    const id = parseInt(req.body.id);
    const catename = req.body.catename;
    const catenameen = req.body.catenameen;
    const catedetail = req.body.catedetail;
    const imgfile = req.body.imgfile;
    const status = req.body.status;
    const createdate =  `${format(new Date() , 'yyyyMMdd_HH:mm:ss')}`;
    //console.log(id)
    const finds = categorys.category.filter((data) => data.id !== parseInt(id));
    
    //console.log(finds)
    var obj = {id:id , catename , catenameen , catedetail , imgfile , status , createdate}
   
    const newObj = [...finds , obj];
    //const newObj = [...finds , obj];

    categorys.setCate([...newObj]);

    sortData(categorys.category);

    await fsPromises.writeFile(
        path.join(__dirname , '..' , 'model' , 'category.json'),
        JSON.stringify(categorys.category)
    )
   
    res.json({code:1 , msg:"success"});


}

const delCategory = async(req , res) => {

    const id = req.cateid;
    
    const findCate = categorys.category.filter((data) => data.id !== parseInt(id));

    //console.log(findCate)
    categorys.setCate([...findCate]);

    sortData(categorys.category);

    await fsPromises.writeFile(
        path.join(__dirname , '..' , 'model' , 'category.json'),
        JSON.stringify(categorys.category)
    )
     res.json({code:1 , list:categorys.category})


}

const getCateByID = (req , res) => {

    const id = req.body.id;
    const findCate = categorys.category.find((data) => data.id === parseInt(id));
    if(findCate === undefined) return res.json({code:4 , msg:"nodata"})

    res.json({code:1 , list:findCate})


}

const getCategoryAll = (req , res) => {

    //const data = categorys.category;
    res.json(categorys.category)


}

module.exports = {
                addCategory,
                getCategoryAll,
                updateCategory,
                getCateByID,
                delCategory
               }