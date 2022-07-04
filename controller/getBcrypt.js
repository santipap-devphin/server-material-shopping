const bcrypt = require('bcrypt');

const genBcrypt = async (req , res) => {

const pass  = await bcrypt.hash("Cip1q2w@" , 10);

        res.json({pass:pass});

}

module.exports = {genBcrypt};