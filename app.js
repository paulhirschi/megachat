var user;
var peoples;
var id;
var socket = io();

$('form.get_user_name').submit(function() {
  user = $('#user_name').val();
  $('.get_user_name_wrapper').hide();
  id = socket.id;
  socket.emit('join', user); // Send event to server
  $('#m').focus();
  return false;
});

$('#m').on('input', function() {
  socket.emit('user typing', { // Send event to server
    user: user,
    id: id
  });
});

$('form.send_message').submit(function() {
  if (!$('#m').val()) {
    return false;
  }
  socket.emit('chat message', { // Send event to server
    user: user,
    id: id,
    message: $('#m').val()
  });
  $('#m').val('');
  return false;
});

window.setInterval(function() {
  $('.chat-bubble').each(function() {
    var e = $(this);
    e.remove();
  });
}, 5000);

function removeSpeachBubble(d) {
  $('.chat-bubble').each(function() {
    var e = $(this);
    if (e.attr('data-id') == d) {
      e.remove();
    }
  });
}

function addSpeachBubble(d) {
  if (!$('.chat-bubble').length) {
    $('.chat-bubble-container').append('<span class="chat-bubble" data-id="' + d.id + '">' + d.user + '<span>&hellip;</span></span>');
  } else {
    $('.chat-bubble').each(function() {
      var e = $(this);
      if (d.id == e.attr('data-id')) {
        return;
      } else {
        $('.chat-bubble-container').append('<span class="chat-bubble" data-id="' + d.id + '">' + d.user + '<span>&hellip;</span></span>');
      }
    });
  }
}

/*======================================================
=            Receive events from the Server            =
======================================================*/

socket.on('update', function(d) {
  var e = $('<li>').html(d + '&nbsp;&nbsp;').hide().appendTo($('#user-list')).fadeIn();
  setTimeout(function() {
    e.fadeOut();
  }, 2000);
});

socket.on('update-people', function(d) {
  peoples = Object.values(d);
  $('#users-joined').html('');
  for (var i = peoples.length - 1; i >= 0; i--) {
    $('#users-joined').append($('<li>').html(peoples[i]));
  }
});

socket.on('user typing', function(d) {
  if (d.id == id) {
    return;
  } else {
    addSpeachBubble(d);
  }
});

socket.on('chat message', function(msg) {
  removeSpeachBubble(msg.id);
  if (msg.id == id) {
    $('#messages').append($('<li style="background-color: #328CC1; color: #FFF;">').html('<span>' + msg.user + ' :</span> ' + msg.message)).append($('<br>'));
  } else {
    $('#messages').append($('<li style="background-color: #eee;">').html('<span>' + msg.user + ' :</span> ' + msg.message)).append('<br>');
  }
  var z = $('.chat-window');
  z.animate({
    scrollTop: z.prop("scrollHeight")
  }, 1000);
});
