Vue.component('playerbar', {
  props: ['player'],
  template: '\
            <span>\
              {{player.name}} {{player.score}}\
              <span v-if="player.batting"> (batting)</span>\
            </span>\
            '
});

var serverUrl = window.fingercric.serverUrl;

function vmCreated() {
  this.socket = io(serverUrl);
  var socket = this.socket;

  var vm = this;
  socket.on('connect', function(){
    socket.emit('join room', vm.roomId);
  });
}

function move(n, player) {
  var p1 = this.p1;
  var p2 = this.p2;
  if (player === 1) p1.moved = n;
  else p2.moved = n;

  if (p1.moved && p2.moved) {
    this.last = p1.moved + " <----> " + p2.moved;

    if (p1.moved !== p2.moved) {
      if (p1.batting) p1.score += p1.moved;
      else p2.score += p2.moved;
    }
    if (this.chasing &&
      ((p1.batting && p1.score > p2.score) ||
        (p2.batting && p2.score > p1.score))) {
      p1.moved = 0;
      p2.moved = 0;
    }
    if (p2.moved === p1.moved) {
      this.last += " (out!)";

      // select winner
      if (!this.chasing) this.chasing = true;
      else {
        var winner;
        if (p1.score > p2.score) winner = this.p1;
        if (p2.score > p1.score) winner = this.p2;
        if (winner) {
          window.alert(winner.name + ' won the game!');
        } else {
          window.alert("Match draw!");
        }
        this.chasing = false;
        p1.score = 0;
        p2.score = 0;

      }

      if (p1.batting) {
        p1.batting = false;
        p2.batting = true;
      } else {
        p2.batting = false;
        p1.batting = true;
      }

    }

    p1.moved = 0;
    p2.moved = 0;
  }

  if (player === 1) this.move(Math.ceil(Math.random() * 6), 2);
}

var app = new Vue({
  el: '#app',
  data: {
    roomId: getRoomId(),
    p1: {
      name: 'You',
      moved: 0,
      score: 0,
      batting: true,
    },
    p2: {
      name: 'Player 2',
      moved: 0,
      score: 0,
      batting: false,
    },
    chasing: false,
    last: '',
  },
  methods: {
    move: move,
  },
  created: vmCreated,
});


// get room id from url or create a random roomId
function getRoomId() {
  var roomId = window.location.href.split('#')[1];
  if(!roomId) {
    roomId  = Math.floor(Math.random() * 1000000);
    window.location.href += '#' + roomId;
  }
  return roomId;
}