// page du serveur
var express = require('express');
//var path = require("path");
var ejs=require('ejs');
var app = express();
var bcrypt =require("bcrypt");
var https = require("https");
var {response} = require("express");
var session =require("express-session");
var fs = require("fs");
var bodyParser =require("body-parser");

app.use(express.static('public'));
app.use(bodyParser.json());

/// Configuration du serveur ///
app.set("view engine","ejs");
app.set('views','views');

// Thomas : Je dois le relier avec les différentes pages d'Elie
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('public'));
app.use(bodyParser.json());
//let db = require("./db")
//const {getUser} = require("./db");
/// cookie ///
app.use(session({
    secret: "propre123",
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 3600000
    }
}));

///////////////////  GET   ////////////////////////////////////////////////////////
app.get('/',async (req,res)=>{
    res.render("menu");
    // Thomas: I have to direct to the main page
})

app.get("/login", (req, res) => {
    if (req.session.nightmode === "style.css"){
        res.render("login",{username:req.session.username,error2:req.session.error2});
    }else {
        res.render("login",{username:req.session.username,error2:req.session.error2});
    }
});


app.get("/Gadget_electronique",(req, res)=>{
    res.render("Gadget_electronique");
})


app.get("/Ordinateurs_et_accesoires",(req, res)=>{
    res.render("Ordinateurs_et_accesoires");
})
///////////////////  POST   ////////////////////////////////////////////////////////
app.post("/",async (req,res)=>{
    const users = await db.getUser(req.session.username);
})

app.post("/register",async (req,res)=> {
    req.session.error1 = "";
    var salt = bcrypt.genSaltSync(10)
    var cryp_mdp = bcrypt.hashSync(req.body.password, salt) // ache le mdp pour l'enregistrer
    if (await db.getUser(req.body.username)) { // si le pseudo est déjà dans la bdd ça n'enregistre pas l'utilisateur
        console.log("pseudo déjà utilisé")
        req.session.error1 = "Pseudo déjà utilisé";
        res.redirect("/register")
    }
    else {
        await db.addUser(req.body.username,cryp_mdp,req.body.email);  // ajoute l'utilisateur à la bdd
        req.session.username = req.body.username
        req.session.email = req.body.email
        console.log("nouvel utilisateur ajouté à la base de donnée")
        res.redirect("/");
    }

})

app.post("/login",async (req,res)=>{ // async pour dire que fonction est asynchrone
    req.session.error2 = "";
    await db.getUser(req.body.username).then(user=>{ // "await" pour dire que on attend "getUser" pour continuer
        if(user){
            bcrypt.compare(req.body.password,user.password).then(passwordCorrect =>{
                if(passwordCorrect){
                    console.log("Utilisateur trouvé")
                    req.session.username = req.body.username;
                    //res.redirect('/incident');
                    //Thomas : on doit le rediriger vers la page principale
                }else{
                    console.log("mauvais mot de passe");
                    req.session.error2 = "Mauvais mot de passe , veuillez réessayez"
                    res.redirect("/login");
                }
            });
        }
        else{
            console.log("Utilisateur non trouvée");
            req.session.error2 = "Ce pseudo ne correspond à aucun utilisateur"
            res.redirect("/login")
            // Thomas: y a t il une page pour s'enregistrer pour la première fois ?
        }
    });
});
//////////////////////////////////////////////////////////////////////////////////

https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: 'ingi'
}, app).listen(8080);