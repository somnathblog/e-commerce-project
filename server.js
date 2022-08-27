const app = require('express')()
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
require('dotenv').config()

// Route Imports
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')
const addressRoutes = require('./routes/address')
const productRoutes = require('./routes/product')
const categoryRoutes = require('./routes/category')
const developerRoutes = require('./routes/developer')
const themeRoutes = require('./routes/serverTheme')
const orderRoutes = require('./routes/order')
const sellerRoutes = require('./routes/seller')
const contactRoutes = require('./routes/contact')
const problemRoutes = require('./routes/problem')

// Database Connection
mongoose.connect(process.env.DB_URI,{useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res=>{
    console.log('DB CONNECTED <3');
}).catch(e=>{
    console.log(e);
})

// Middlewares
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

// Actual Routes
app.use('/api',authRoutes)
app.use('/api',userRoutes)
app.use('/api',adminRoutes)
app.use('/api',addressRoutes)
app.use('/api',productRoutes)
app.use('/api',categoryRoutes)
app.use('/api',developerRoutes)
app.use('/api',themeRoutes)
app.use('/api',orderRoutes)
app.use('/api',sellerRoutes)
app.use('/api',contactRoutes)
app.use('/api',problemRoutes)

// Server Connection
const PORT = process.env.PORT || 8000
app.listen(PORT,()=>{
    console.log(`Server started at port ${PORT}`);
})