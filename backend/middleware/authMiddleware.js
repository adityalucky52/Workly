import jwt from 'jsonwebtoken';
import {User} from '../modals/userModel.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            const status = 401;
            const message = "Unauthorized, No token found";
            next({status,message});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // {id: "someUserId"}
        console.log("req.user:", req.user );
        
      
        
        next();
    } catch (error) {
        const status = 401;
        const message = "Unauthorized";
        next({status,message});
    }
}