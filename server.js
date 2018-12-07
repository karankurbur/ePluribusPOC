var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser');
const crypto = require('crypto');

var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.use(cors())

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "epluribusemail",
        pass: "CivicRules1",
    },
});



class Account {
    constructor(email, pin, verifier) {
        this.email = email
        this.pin = pin
        this.verifier = verifier
    }
}


var accountData = [];
var SECRET = "secret";

app.post('/registerEmail', async (req, res) => {
    var emailToConfirm = req.body.email;
    console.log(emailToConfirm);

    // if (!alreadyRegistered(emailToConfirm)) {
    //     accountData.push(new Account(email, randomPin(), false));
        var confirmUrl = "http://localhost:80/confirm?token=";
        var token = jwt.sign({ "email": emailToConfirm }, SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });
        var url = confirmUrl+token;

        await transporter.sendMail({
            to: emailToConfirm,
            subject: 'Confirm Email',
            html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
        });

    //     res.send(true);
    // }
    // else {
    //     res.send(false);
    // }

})
var privateKey;

app.get('/confirm', async (req, res) => {
    var token = req.query.token;
    var correct = jwt.verify(token,SECRET);
    if(correct) {
        console.log("email confirmation worked");
    }
    //send back credential here
    res.send(true);
})

app.listen(80, async function () {
    console.log('CORS-enabled web server listening on port 80')
    console.log();




    
})



function randomPin() {
    return Math.floor((Math.random() * 9999) + 1);
}

function alreadyRegistered(email) {
    // for (var i = 0; i < accountData.length; i++) {
    //     if (accountData[i].email == email) {
    //         return true;
    //     }
    // }
     return false;
}