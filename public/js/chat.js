var socket = io.connect('http://radiant-peak-9351.herokuapp.com/');
socket.on('connect', function(){
    var profileimg = $('#profile-img').attr('src');
    console.log('connected!!');
    socket.emit('adduser',profileimg);
});

socket.on('updatechat', function (username, data) {

    if(userid == username) {
        $('.direct-chat-messages').append('<div class="direct-chat-msg right">'+
                '<div class="direct-chat-info clearfix">'+
                '<span class="direct-chat-name pull-right"></span>'+
                '<span class="direct-chat-timestamp pull-left"></span>'+
            '</div>'+
            '<img class="direct-chat-img" src="'+data.profileimg+'" alt="message user image">'+
                '<div class="direct-chat-text">'+ data.message +
            '</div>'+
            '</div>');
    } else {
        $('.direct-chat-messages').append('<div class="direct-chat-msg"><div class="direct-chat-info clearfix">'+
            '<span class="direct-chat-name pull-left">'+data.username+'</span>'+
            '<span class="direct-chat-timestamp pull-right"></span>'+
            '</div>'+
            '<img class="direct-chat-img" src="'+data.profileimg+'" alt="message user image">'+
            '<div class="direct-chat-text">'+ data.message +
            '</div>'+
            '</div>');
    }
});
// listener, whenever the server emits 'updateusers', this updates the username list
socket.on('updateusers', function(chatmessage) {
    $('#users').empty();
    $.each(chatmessage, function(key, value) {
        $('#users').append('<div>' + value + '</div>');
    });
});

socket.on('draw', function (data) {
    $('.messageplane').append('<b>'+username + ':</b> ' + chatmessage + '<br>');
});
/*** chat append **/
$(function(){
    // when the client clicks SEND
    $('#chatmessagesend').click( function() {
        var message = $('#chatmessage').val();
        var profileimg = $('#profile-img').attr('src');
        var username = $('#usernameforchat').text();
        if( message !== '') {
            var data =  {
                username: username,
                message: message,
                profileimg: profileimg
            }

            $('#chatmessage').val('');
            // tell server to execute 'sendchat' and send along one parameter
            socket.emit('sendchat', data);
        }

    });

    // when the client hits ENTER on their keyboard
    $('#chatmessage').keypress(function(e) {
        if(e.which == 13) {
            $(this).blur();
            $('#chatmessagesend').focus().click();
        }
    });
});
/**
 * Created by teymur on 24.08.2015.
 */
