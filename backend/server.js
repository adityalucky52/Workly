import 'dotenv/config';
import db from './database/db.js'
import app from './app.js';


app.listen(process.env.PORT,()=>{
    db();
    console.log(`Server is running on port ${process.env.PORT}`);
})