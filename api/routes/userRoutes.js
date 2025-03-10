
/* Controller import starts */
const userCntrl = require('../controllers/userController');
/* Controller import  ends */

/* validate model import starts */
const userModel = require('../validate-models/userModel');
/* validate model  import  ends */
const auth = require('../middleware/auth');


module.exports = function (app, validator) {
   app.post('/api/user/signup',validator.body(userModel.signupUser),userCntrl.signupUser);
   app.post('/api/user/signin',validator.body(userModel.signinUser),userCntrl.signInUser);
   app.put('/api/user/update/:id',validator.params(userModel.commonId),userCntrl.updateUser);
   app.get('/api/user/getAllUser',userCntrl.getAllUser);
   app.get('/api/user/details/:id',validator.params(userModel.commonId),userCntrl.getUserDetails);
   app.delete('/api/user/delete/:id',validator.params(userModel.commonId),userCntrl.deleteUser);
   app.post('/api/user/change-password',auth,validator.body(userModel.changePassword),userCntrl.changePassword);


/**Contact Routes Start */
app.post('/api/Contact/add',validator.body(userModel.addContact),userCntrl.addContact);
app.get('/api/contact/getAllContact',userCntrl.getAllContact);
/**Contact Routes Ends */
 
/**Address Routes Start */
app.post('/api/address/add',auth,validator.body(userModel.addAddress),userCntrl.addAddress);
app.get('/api/address/getUserAddress',auth,userCntrl.getAllAddress);
/**Address Routes Ends */

/**Rating Routes Start */
app.post('/api/rating/add',auth,validator.body(userModel.addRating),userCntrl.addRating);
/**Rating Routes Ends */


/**order Routes start */
app.post('/api/order/add',auth,validator.body(userModel.addOrder),userCntrl.addOrders);
app.get('/api/order/getAllOrder',auth,userCntrl.getAllOrder);
app.get('/api/order/details/:order_id',auth,userCntrl.getOrderDetails);

/**order Routes ends */

}




