// calling all dependencies
import express  from "express"
import cors from "cors"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import connectDB from './SRC/DB/database.js'
import router from "./SRC/routes/index.js"

//initializing the dot env method
dotenv.config()

//assigning the express method to a variable
const app = express()



//using the express functions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    // Set headers to allow requests from any origin
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5503');
    // Allow specific methods
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    // Allow specific headers
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Continue to the next middleware
    next();
  });
  
  
  app.use(cors({origin: "http://127.0.0.1:5503"}))
  


// app.use(cors({origin: "*"}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use('/egov', router)



const startserver = async () => {
    const PORT = process.env.PORT || 3008 
    try {
        app.listen(PORT, () => {console.log(`APP IS RUNNING ON PORT : ${PORT}`);})
        connectDB()
    } catch (error) {
        console.log(error);
    }
};

startserver();

app.get("/",(req,res) => {
    res.send(`API IS RUNNING`)
})