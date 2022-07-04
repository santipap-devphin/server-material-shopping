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

module.exports = {addBlogs , getBlogs , getBlogByID , updateBlog ,delBlog}