
/* Controller import starts */
const productCntrl = require('../controllers/productController');
/* Controller import  ends */

/* validate model import starts */
const categoryModel = require('../validate-models/productModel');
/* validate model  import  ends */
const auth = require('../middleware/auth');


module.exports = function (app, validator) {

    /**category routes start */
    app.post('/api/category/add', validator.body(categoryModel.addCategory), productCntrl.addCategory);
    app.put('/api/category/update/:id', validator.params(categoryModel.commonId), validator.body(categoryModel.updateCategory), productCntrl.updateCategory);
    app.get('/api/category/getAllCategory', productCntrl.getAllCategory);
    app.delete('/api/category/delete/:id', validator.params(categoryModel.commonId), productCntrl.deleteCategory);
    app.get('/api/category/details/:id', validator.params(categoryModel.commonId), productCntrl.detailsCategory);
    /**category routes ends */

    /**product routes start */
    app.post('/api/product/add', validator.body(categoryModel.addProduct), productCntrl.addProduct);
    app.put('/api/product/update/:id', validator.params(categoryModel.commonId), validator.body(categoryModel.updateProduct), productCntrl.updateProduct);
    app.get('/api/product/list', productCntrl.getAllProducts);
    app.delete('/api/product/delete/:id', validator.params(categoryModel.commonId), productCntrl.deleteProduct);
    app.get('/api/product/details/:id', validator.params(categoryModel.commonId), productCntrl.getProductDetails);
    app.get('/api/product/category-list', productCntrl.getCategoryByProduct);
    app.post('/api/product/wishlist',validator.body(categoryModel.wishlistProduct), productCntrl.productWishlist);
    app.get('/api/wishlist/list',auth, productCntrl.getAllWishlist);
 /**product routes ends */
//Changes
  /**Cart routes start */
  app.post('/api/cart/add-item',auth,validator.body(categoryModel.addCart), productCntrl.addUpdateCartItem);
  app.get('/api/cart/get-item',auth, productCntrl.getUserCartItem);
  app.delete('/api/cart/remove-item/:id',auth, validator.params(categoryModel.commonId), productCntrl.removeCartItem);

   /**cart routes ends */
    
}
