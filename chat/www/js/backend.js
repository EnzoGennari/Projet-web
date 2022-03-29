var socket = io.connect('http://localhost:8866');

//Au chargement de la page
$(function() {

    //Pour envoyer le choix du pseudo au serveur
    $('#join').bind('click', function() {
        $('#error').html('&nbsp;');
        if (!$('#nickname').val().length) {
            $('#error').html('Vous devez choisir un pseudo !');
            return;
        }
        socket.emit('adduser', $('#nickname').val());
    });

    //Lorsque l'utilisateur fait entrée dans le input du chat : clique sur un bouton (invisible) et laisse le focus sur l'input pour retapper directement
    $('#data').keypress(function(e) {
        if (e.which == 13) {
            $(this).blur();
            $('#datasend').focus().click();
            $(this).focus().select();
        }
    });
    
    //Le bouton cliqué permet d'envoyer au serveur le message
    $('#datasend').click(function() {
        var message = $('#data').val();
        $('#data').val('');
        if (message) {
            socket.emit('sendchat', message);
        }
    });

});

// Pour maj le chat
socket.on('updatechat', function(username, data) {
    $('#conversation').append('<b>' + username + '</b>' + data + '<br>');
});

// Pour afficher le nb de personnes
socket.on('updateUsersCount', function(number) {
    if (!number) {
        numerb = "0";
    }
    $('#users').html(number);
});

//Permet d'empecher de parler tant que l'on est pas connecté
socket.on('notconnected', function() {
    alert("Tu dois te connecter avant de pouvoir accéder au chat !");
});

//empêche de prendre un surnom déjà pris
socket.on('usernametaken', function() {
    $('#error').html('Ce pseudo est déjà pris !');
});

//Fonctions pour cacher le panneau d'accueil
socket.on('switchwelcomevisibility', function() {
    $('#welcome').toggle();
});