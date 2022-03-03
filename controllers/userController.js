const User = require("../models/User");
const Product = require("../models/Product");
const auth = require("../auth"); 
const bcrypt = require("bcryptjs");
let salt = bcrypt.genSaltSync(10);

module.exports.registerUser = (body) => {
	return User.find({email : body.email}).then(result => {
		if (result.length > 0){
			return false; 
		} else {
			let newUser = new User({
				email : body.email,
				password : bcrypt.hashSync(body.password, salt)
			});
		
			return newUser.save().then((user, error) => {
				if (error){
					return false; 
				} else {
					return true; 
				}
			})
		}
	})
}

module.exports.loginUser = (body) => {
	return User.findOne({email : body.email}).then(result => {
		if(result == null){
			return false;
		} else {
			const isPasswordCorrect = bcrypt.compareSync(body.password, result.password);

			if(isPasswordCorrect){
				return {access : auth.createAccessToken(result.toObject())}
			} else {
				return false; 
			}
		}
	})
}

module.exports.setAsAdmin = (userId) => {
	return User.findById(userId).then(user => {
		if(user === null){
			return false;
		}else{
			user.isAdmin = true;
			return user.save().then((updatedUser, error) => {
				if(error){
					return false;
				} else {
					return true;
				}
			})
		}
	})
}

module.exports.checkout = (userId, cart) => {
	console.log(cart.products[0].productName);

	return User.findById(userId).then(user => {
		if(user === null){
			return false;
		} else {
			user.orders.push(
				{
					products: cart.products,
					totalAmount: cart.totalAmount
				}
			);
			console.log(user.orders);
			return user.save().then((updatedUser, error) => {
				if(error){
					return false;
				} else {
					const currentOrder = updatedUser.orders[updatedUser.orders.length-1];
					
					currentOrder.products.forEach(product => {
						Product.findById(product.productId).then(foundProduct => {
							foundProduct.orders.push({orderId: currentOrder._id})

							foundProduct.save()
						})
					});

					return true;
				}
			})
		}
	})
}

module.exports.getMyOrders = (userId) => {
	return User.findById(userId).then(user => {
		if(user === null){
			return false;
		} else {
			return user.orders;
		}
	})
}

module.exports.getAllOrders = () => {
	return User.find({isAdmin: false}).then(users => {
		let allOrders = [];
		users.forEach(user => {
			allOrders.push({
				email: user.email,
				userId: user._id,
				orders: user.orders
			});
		})
		return allOrders;
	})
}


module.exports.getProfile = (data) => {
	return User.findById(data.userId).then(result => {
		result.password = undefined;
		return result;
	})
}