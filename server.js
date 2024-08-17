const express = require("express");
const server = express();
const path = require("path");
const sequelize = require("./data/db");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const csurf = require("csurf");
const config = require("./config");
const auth = require("./middlewares/auth");


// View engine ayarı
server.set("view engine", "ejs");


// Statik dosyalar için ayar
server.use("/static", express.static(path.join(__dirname, "public")));


// Middleware'ler
server.use(cookieParser());
server.use(session({
    secret: config.secret.secretkey,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 30
    },
    store: new SequelizeStore({
        db: sequelize
    })
}));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));


// CSRF koruma middleware'i
server.use(csurf());


// CSRF tokenini view'lere gönderme
server.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

// Routerlar
const authRoutes = require("./routes/authRoutes");
server.use("/account", authRoutes);


//DATABASE TANIMLAMALARI
const User = require("./models/user");
const Role = require("./models/role");

Role.belongsToMany(User, {through: "userRoles"});
User.belongsToMany(Role, {through: "userRoles"});


//DATABASE OLAYLARI
const dummyData = require("./data/dummy-data");
(async () => {
    await sequelize.sync({ force: true });
    await dummyData();
})();  


server.get('/', auth, (req, res) => {
    res.send('Congratulations, you have logged in to your account.');
});


// Sunucuyu başlatma
server.listen(3000, function() {
    console.log("listening on port 3000");
});
