const tags = {
    tag:require('../model/tags.json'),
    setTag:function(data){
        this.tag = data;
    }
}

const fsPromises = require('fs').promises;
const path = require('path');
const {format} = require('date-fns');

const sortData = (arr) => {

    arr.sort(function(a , b){
       return a["id"] - b["id"]
    })

}
const addTag = async (req ,res) => {

    const id = tags.tag.length > 0 ? tags.tag[tags.tag.length-1].id +1 : 1;
    const tagname = req.body.tagname;
    const status = req.body.status;
    const createdate = `${format(new Date() , 'yyyyMMdd_HH:mm:ss')}`;
    const newsObj = {
        id,
        tagname,
        status,
        createdate
    }
     tags.setTag([...tags.tag , newsObj]);

     await fsPromises.writeFile(
        path.join(__dirname , ".." , "model" , "tags.json"),
        JSON.stringify(tags.tag)
     )

     res.json({code:1 , msg:"success"});
}

const getTagsAll = (req , res) =>{

    const data =  tags.tag.length > 0 ? tags.tag : [];

    res.json({code:1 , list:data})
}

const getTagsByID = (req ,res) => {


} 

const updateTags = async(req , res) =>{

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
    const otherData = tags.tag.filter((data) => data.id !== newobj["id"]);
    tags.setTag([...otherData , newobj]);

    sortData(tags.tag)

    await fsPromises.writeFile(
        path.join(__dirname , ".." , "model" , "tags.json"),
        JSON.stringify(tags.tag)
     )

     res.json({code:1})


}

const delTags = async (req , res) => {
    const id = req.params.id;
    const filterData = tags.tag.filter((data) => data.id !== parseInt(id));
    tags.setTag(filterData);
    sortData(tags.tag);
    await fsPromises.writeFile(
        path.join(__dirname , ".." , "model" , "tags.json"),
        JSON.stringify(tags.tag)
     )

     res.json({code:1})


}

module.exports = {addTag , getTagsAll , getTagsByID , updateTags ,delTags}
