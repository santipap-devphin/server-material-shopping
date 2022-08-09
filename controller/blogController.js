const blogs = {
    detail:require('../model/blogs.json'),
    setBlog:function(data){
        this.detail = data;
    }   
}

const fsPromise = require('fs').promises;
const path = require('path');
const {format} = require('date-fns');

const sortData =  (arr) => {

    arr.sort((a ,b) => {
        return a["id"] - b["id"]
    })

}

const addBlogs = async (req , res) => {

    const id = blogs.detail.length > 0 ? blogs.detail[blogs.detail.length-1].id +1 : 1;
    let newobj = {};
    newobj["id"] = id;
    for (const [key, value] of Object.entries(req.body)) {
        
         newobj[key] = value;
            
    }
    const createdate =  `${format(new Date() , 'yyyyMMdd_HH:mm:ss')}`;
    newobj["createdate"] = createdate;

    blogs.setBlog([...blogs.detail , newobj]);

    await fsPromise.writeFile(
        path.join(__dirname , ".." , "model" , "blogs.json"),
        JSON.stringify(blogs.detail)
    )

    res.json({code:1})
    

}
const getBlogs = (req , res) => {

    const data = blogs.detail.length > 0  ? blogs.detail : [];
    res.json({code:1 , list:data})
}
const getBlogByID = (req ,res) => {

    const id = req.params.id;
    const findBlog = blogs.detail.find((news) => news.id === parseInt(id));
    if(findBlog === undefined) return res.json({code:6 , msg:"not found"});
    res.json({code:1 , list:findBlog});


}
const updateBlog = async (req , res) => {

    if(typeof req.body === "object"){

        var newObj = {};
        for(var [key , value] of Object.entries(req.body))
        {
            if(key === "id"){
                newObj[key] =  parseInt(value);
            }else{
                newObj[key] = value;
            }
         }
        const createdate =  `${format(new Date() , 'yyyyMMdd_HH:mm:ss')}`;
        newObj["createdate"] = createdate;
        const otherData = blogs.detail.filter((item) => item.id !== newObj["id"]);
        blogs.setBlog([...otherData , newObj]);
        sortData(blogs.detail);

        await fsPromise.writeFile(
            path.join(__dirname , ".." , "model" , "blogs.json"),
            JSON.stringify(blogs.detail)
        )

        res.json({code:1})

   }else{

        res.json({code:6 ,msg:"no send param"})
    }

    

}

const delBlog = async (req ,res) => {

    const id = parseInt(req.params.id);
    const fillData = blogs.detail.filter((item) => item.id !== id);
    blogs.setBlog(fillData);
    sortData(blogs.detail);

    await fsPromise.writeFile(
        path.join(__dirname , ".." , "model" , "blogs.json"),
        JSON.stringify(blogs.detail)
    )

    res.json({code:1})



}
const getBlogforFrontend = (req , res) =>{

    const idd = req.params.id;
    const category = require('../model/category.json');
    const tags = require('../model/tags.json');
    let tagslist = "";
    const findBlog = blogs.detail.find((list) => list.id === Number(idd));
    if(findBlog === undefined) return res.json({code:6 , msg:"no data"});
    const findCate = category.find((data) => data.id  === findBlog.cateid);
    
    for (const [key, value] of Object.entries(tags)) {

         if(findBlog.tag.indexOf(value.id) >-1){

             tagslist += value["tagname"] + ",";
         }
           
       
    }
    let tagslice = tagslist.slice(0, tagslist.length-1);
    findBlog["catename"] = findCate.catename;
    findBlog["taglist"] = tagslice;

    //console.log(findBlog)

    res.json({code:1 , list:findBlog , blogall:blogs.detail});

} 
const getBlogForSlug = (req , res) => {

    const slugs = req.params.id;
    const category = require('../model/category.json');
    const findCate = category.find((cate) => cate.catename ===  slugs.trim());
    if(findCate === undefined) return res.json({code:6 , msg:"no data"});
    const filterData = blogs.detail.filter((item) => item.cateid ===  findCate.id);

    res.json({code:1 , list:filterData});
    
}

const getTagGroup = (req ,res) => {
    const tagslug = req.params.slug;
    const tag = require('../model/tags.json');
    const findTag = tag.find((items) => items.tagname === tagslug.trim())
    var listBlog = [];
    //console.log(findTag)
    if(findTag === undefined) return res.json({code:6 , msg:"no data"});
    for(const [key , val] of Object.entries(blogs.detail)){

        //console.log("taglist " + val["tag"] , " " , findTag.id)
        if(val["tag"].indexOf(findTag.id) >-1){
                listBlog.push(val)
             //console.log("blog = "+val["id"]);
        }
    }
     res.json({code:1 , list:listBlog})
 }


module.exports = {addBlogs , getBlogs , getBlogByID , updateBlog ,delBlog , getBlogforFrontend , getBlogForSlug , getTagGroup}