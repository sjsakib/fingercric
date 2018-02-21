Vue.component('playerbar', {
  props: ['player'],
  template: '\
            <span>\
              {{player.name}} {{player.score}}\
              <span v-if="player.batting"> (batting)</span>\
            </span>\
            '
});
Vue.component('modal', {
  template: '#modal-template',
});

var serverUrl = window.fingercric.serverUrl;

function vmCreated() {
  this.socket = io(serverUrl);
  var socket = this.socket;

  var vm = this;
  socket.on('connect', function(){
    socket.emit('join room', vm.roomId);
  });

  socket.on('toss', function(res){
    if(res === 0) {
      vm.p1.batting = false;
      vm.p2.batting = true;
    }
    vm.waiting = false;
  });

  socket.on('move', function(n){
    console.log('received move');
    vm.move(n, 2);
  });
}

function move(n, player) {
  if(player === 1) this.socket.emit('move', {roomId: this.roomId, n: n});
  var p1 = this.p1;
  var p2 = this.p2;
  if (player === 1) p1.moved = n;
  else p2.moved = n;

  if (p1.moved && p2.moved) {
    this.last.p1 = p1.moved;
    this.last.p2 = p2.moved;

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
      this.last.status += "out!";

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
}

var app = new Vue({
  el: '#app',
  data: {
    roomId: getRoomId(),
    waiting: true,
    href: window.location.href,
    p1: {
      name: 'You',
      moved: 0,
      score: 0,
      batting: true,
    },
    p2: {
      name: 'Your friend',
      moved: 0,
      score: 0,
      batting: false,
    },
    chasing: false,
    last: {
      p1: '...',
      p2: '...',
      status: ''
    },
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
