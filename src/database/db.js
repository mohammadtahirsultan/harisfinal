const mongoose = require("mongoose");

const connectDB = async (req, res) => {
    try {
        await mongoose.connect("mongodb://admin:_isHacked@ac-3rlel4d-shard-00-00.daqohrw.mongodb.net:27017,ac-3rlel4d-shard-00-01.daqohrw.mongodb.net:27017,ac-3rlel4d-shard-00-02.daqohrw.mongodb.net:27017/hariswallet?replicaSet=atlas-t5xj5a-shard-0&ssl=true&authSource=admin")
        console.log('Connected With Database');
    } catch (error) {
        console.log(`Error Occured While Connecting With Database : ${error.message}`);
    }

}


module.exports = { connectDB };