import express from 'express';
import userRouter from './routes/user.Routes.js';
import cookieParser from 'cookie-parser';
import errorMiddleware from './middleware/errorMiddleware.js';
import limiter from './middleware/ratelimitermiddleware.js';

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(limiter)

app.get('/',(req,res)=>{
    res.json({message:"hello world"})
})

app.use('/api/user',userRouter)

app.use(errorMiddleware)

export default app;
