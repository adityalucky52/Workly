import 'dotenv/config';
import db from './src/config/db.js'
import app from './src/app.js';


app.listen(process.env.PORT,()=>{
    db();
})