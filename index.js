const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

// Add the database connection
mongoose.connect('mongodb+srv://admin:admin1234@zuitt-bootcamp.2q2jw.mongodb.net/csp3?retryWrites=true&w=majority', 
	{
		useNewUrlParser: true, 
		useUnifiedTopology: true
	})

// mongoose.connect("mongodb+srv://admin:admin123@cluster0.7iowx.mongodb.net/csp3?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'))

// Server 
const app = express();

const corsOptions = {
	origin: ['http://localhost:3000', 'https://enigmatic-crag-04546.herokuapp.com'],
	optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}))

//connect routes
app.use("/products", productRoutes);
app.use("/users", userRoutes);

app.listen(process.env.PORT || 4000, () => {
    console.log(`API is now online on port ${ process.env.PORT || 4000 }`)
});
