var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
    //response.send('')
    response.sendFile(__dirname + '/index.html');
})
app.get('/about', function(request, response) {
    //response.send('')
    response.sendFile(__dirname + '/about.html');
})
app.get('/submit', function(request, response) {
    //response.send('')
    response.sendFile(__dirname + '/submit.html');
})

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
})
