require("dotenv").config();
const mongoose= require("mongoose");
mongoose.set('strictQuery', false);

const connectDB = async () => {
    try {
        const conn =  mongoose.connect(process.env.DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
           
        });
        console.log('MongoDB CONNECTED');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
module.exports = connectDB;