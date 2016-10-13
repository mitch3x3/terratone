var express = require('express')
var bodyParser = require('body-parser')
var nodemailer = require('nodemailer');
var app = express()
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
    response.sendFile(__dirname + '/index.html');
})
app.get('/about', function(request, response) {
    response.sendFile(__dirname + '/about.html');
})
app.get('/contact', function(request, response) {
    response.sendFile(__dirname + '/contact.html');
})
app.get('/contact-success', function(request, response) {
    response.sendFile(__dirname + '/contact-success.html');
})
app.get('/contact-error', function(request, response) {
    response.sendFile(__dirname + '/contact-error.html');
})
app.get('/submit', function(request, response) {
    response.sendFile(__dirname + '/submit.html');
})
app.get('/submit-success', function(request, response) {
    response.sendFile(__dirname + '/submit-success.html');
})
app.get('/submit-error', function(request, response) {
    response.sendFile(__dirname + '/submit-error.html');
})

app.post('/contact', function(request, response) {
    //request.body.company = "Apple Inc."; // Honeypot test

    var smtpConfig = {
        host: 'smtp.comcast.net',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'mitchell.jones@comcast.net',
            pass: 'Godzilla!'
        }
    };

    //Setup nodemailer transport
    var smtpTransport = nodemailer.createTransport(smtpConfig);

    // Fill mail options
    var mailOptions = {
        from: request.body.name +'<'+ request.body.email +'>', // sender address
        to: 'contact@terratone.io', // list of receivers
        subject: "Terratone: Contact Form Submission", // Subject line
        text: request.body.message // Email body
    };

    // Honeypot with bogus company field
    if (request.body.company.length == 0) {
        smtpTransport.sendMail(mailOptions, function(error, info){
            if (error) {
                //response.send(500);
                console.log(error);
                response.redirect('/contact-error');
            }
            else {
                //response.send(200);
                console.log('Message sent: ' + info.response);
                response.redirect('/contact-success');
            };
            smtpTransport.close();
        });
    }
    else {
        console.log("Honeypot: spambot detected");
        response.redirect('/contact-error');
    }
});

app.post('/submit', function(request, response) {
    //document.getElementById('file-upload');
    console.log(request);
    //request.body.company = "Apple Inc."; // Honeypot test

    var smtpConfig = {
        host: 'smtp.comcast.net',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'mitchell.jones@comcast.net',
            pass: 'Godzilla!'
        }
    };

    //Setup nodemailer transport
    var smtpTransport = nodemailer.createTransport(smtpConfig);

    // Fill mail options
    var mailOptions = {
        from: request.body.name +'<'+ request.body.email +'>', // sender address
        to: 'submit@terratone.io', // list of receivers
        subject: "Terratone: Audio Submission", // Subject line
        text: 'Terratone Submission', // Email Body
        html: '<p>Name: ' + request.body.name + '</p>' +
              '<p>Email: ' + request.body.email + '</p>' +
              '<p>Lat: ' + request.body.latitude + '</p>' +
              '<p>Long: ' + request.body.longitude + '</p>' +
              '<p>Datetime: ' + request.body.datetime + '</p>'
    };

    // Honeypot with bogus company field
    if (request.body.company.length == 0) {
        smtpTransport.sendMail(mailOptions, function(error, info){
            if (error) {
                //response.send(500);
                console.log(error);
                response.redirect('/submit-error');
            }
            else {
                //response.send(200);
                console.log('Message sent: ' + info.response);
                response.redirect('/submit-success');
            };
            smtpTransport.close();
        });
    }
    else {
        console.log("Honeypot: spambot detected");
        response.redirect('/submit-error');
    }
});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
})
