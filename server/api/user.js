const router = require('express').Router();
const CommonHelper = require('../helpers/CommonHelper');
const ValidationHelper = require('../helpers/ValidationHelper');
const UserHelper = require('../helpers/UserHelper');

const addUser = async(req,res) => {
    try {
        // check validation input
        ValidationHelper.userValidation(req.body);
        // get data from json
        const data = await UserHelper.addUser(req);
       
        // return response success
        return res.send(data);
      } catch (error) {
        // return response error
        CommonHelper.log(['User', 'Add User', 'ERROR'], {
          message: `${error}`,
          transaction_id: req.headers.transaction_id
        });
        return res.send(CommonHelper.errorResponse(error));
    }
}

const loginUser = async(req,res) => {
  try {
      // check validation input
      ValidationHelper.loginValidation(req.body);
      // get data from json
      // return res.send("ok");
      const data = await UserHelper.loginUser(req,res);
      // // return response success
      return res.send(data[0]);
    } catch (error) {
      // return response error
      
      CommonHelper.log(['User', 'Login User', 'ERROR'], {
        message: `${error}`,
        transaction_id: req.headers.transaction_id
      });
      return res.send(CommonHelper.errorResponse(error));
  }
}

router.post('/user/register', CommonHelper.preHandler, addUser);
router.post('/user/login', CommonHelper.preHandler, loginUser);
// router.get('/v2/laptop', CommonHelper.preHandler, getListLaptopV2);
// router.put('/v2/laptop/:id', CommonHelper.preHandler, editLaptopV2);
// router.delete('/v2/laptop/:id', CommonHelper.preHandler, deleteLaptopV2);
module.exports = router;

