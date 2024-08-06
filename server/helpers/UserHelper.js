const Boom = require('boom');

const jwt = require("jsonwebtoken");
const CommonHelper = require('./CommonHelper');

const user = require('../services/User');

const addUser = async (req) => {
    try {
        // check email if already exist
        const getEmailAction = await user.getEmailUser(req.body.email);
        
        if (getEmailAction.length !==0) {
            return Boom.conflict(`Email ${req.body.email} is already register`);
        }
        // Check password
        const passwordHash = await CommonHelper.hashPassword(req.body.password);
        await user.addUser(req.body.email, req.body.nama,passwordHash);
        return "registration successful";
    } catch (error) {
        CommonHelper.log(['User Helper', 'addUser', 'ERROR'], { message: `${error}` });
        throw CommonHelper.errorResponse(error);
    }
};

const loginUser = async (req,res) => {
    try {
        const getEmailAction = await user.getEmailUser(req.body.email);
        if (getEmailAction.length === 0 ) {
            return res.status(404).send(Boom.notFound(`Email / password incorrect`));
            // return Boom.notFound(`Email / password incorrect`);
        }
        const checkPassword = await CommonHelper.comparePassword(req.body.password, getEmailAction[0].password);
        if(!checkPassword){
            // return Boom.notFound(`Email / password incorrect`);
            return res.status(404).send(Boom.notFound(`Email / password incorrect`));
        }
        const token = jwt.sign(
            {
                email: getEmailAction[0].email,
                status: getEmailAction[0].status
            },
            "july24",
            { expiresIn: "1h" });
        delete getEmailAction[0].password;
        // Object.assign(getEmailAction[0], {token});
        getEmailAction[0].token = token;
        return getEmailAction;
    } catch (error) {
        CommonHelper.log(['User Helper', 'loginUser', 'ERROR'], { message: `${error}` });
        throw CommonHelper.errorResponse(error);
    }
   
}


module.exports = {
    addUser,
    loginUser
};
