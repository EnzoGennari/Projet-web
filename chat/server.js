var connect = require('connect'),
    app = connect(),
    http = require('http'),
    server = http.createServer(app),
    urlrouter = require('urlrouter'),
    io = require('socket.io').listen(server),
    port = 8866;

app.use(urlrouter(function(app) {
    app.get('/', function(req, res, next) {
        req.url = '/index.html';
        connect.utils.parseUrl(req);
        next();
    });
}));

app.use(connect.static(__dirname + '/www'));
server.listen(port);
io.set('log level', 2);


var usernames = {};
// Pour cacher la conversation avant connexion, on utilise un salon
var default_room = 'Salon';

io.sockets.on('connection', function(socket) {

    //Permet d'afficher le nombre de personnes connectées sur la page d'accueil à l'utilisateur qui se connecte
    socket.emit('updateUsersCount', Object.keys(usernames).length);

    //Lorsque l'utilisateur rentre un pseudo on va vérifier que le pseude n'est pas pris
    socket.on('adduser', function(newusername) {

        if (usernames.hasOwnProperty(newusername)) {
            socket.emit('usernametaken');
            return;
        }

        socket.username = newusername;
        usernames[newusername] = newusername;

        //On cache le panneau d'entrée
        socket.emit('switchwelcomevisibility');

        //On le connecte au salon grâce à la gestion de salon fournie par socket
        socket.join(default_room);
        socket.room = default_room;
        
        //On signale dans le chat que la personne est connectée (message différent pour la personne qui se connecte et les autres qui le voient se connecter)
        socket.emit('updatechat', '', 'Vous êtes connecté !');
        socket.broadcast.to(default_room).emit('updatechat', '', '<span style="color:gray;">' + newusername + ' s\'est connecté !</span>');
    });

    // Gestion des messages
    socket.on('sendchat', function(data) {
        io.sockets.in(socket.room).emit('updatechat', socket.username + ' : ', data);
    });

    // Gestion des déconnexions
    socket.on('disconnect', function() {
        delete usernames[socket.username];
        socket.broadcast.to(default_room).emit('updatechat', '', '<span style="color:grey;">' + socket.username + ' s\'est déconnecté</span>');
        socket.leave(socket.room);
    });
});