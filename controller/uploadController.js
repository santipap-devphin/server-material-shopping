


const uploadImgCategory = (req , res) => {

    console.log(req.file)

    res.send(req.file)
     //return upload.single('file');

}
const uploadImgProduct = (req , res) => {

    //console.log(req.files)

    res.send(req.files)
     //return upload.single('file');

}

module.exports = {uploadImgCategory , uploadImgProduct}