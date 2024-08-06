// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const Boom = require('boom');
const CommonHelper = require('./CommonHelper');

const verifyToken = (req,res,next)=>{
    try {
        const tokenHeader = req.headers['x-access-token'];
        if(!tokenHeader) {
            return res.status(401).send(Boom.unauthorized());

        }
        if (tokenHeader.split(' ')[0] !== 'Bearer') {
            return res.status(403).send(Boom.unauthorized('Incorrect token format'));

        }
        
        const token = tokenHeader.split(' ')[1];
    
            if (!token) {
                return res.status(403).send(Boom.forbidden('No token provided'));
            }
           
            jwt.verify(token, 'july24', (err, decoded) => {
                if (err) {
                  
                    return res.status(403).send(Boom.forbidden('Forbidden'));
                }
                req.email = decoded.email;
                req.status = decoded.status;
               
                next();
            });
    }catch (error) {
        CommonHelper.log(['Middleware Helper', 'verifTokwn', 'ERROR'], { message: `${error}` });
        throw CommonHelper.errorResponse(error);
    }
   

}

const isStaff = (req, res, next) =>{
 
    if(req.status === 'staff'){
        next();
        return;
    }
    res.status(403).send(Boom.forbidden('Require Staff Role'));
   
  

}
module.exports = {verifyToken,isStaff };
