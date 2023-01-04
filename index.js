var used = [], letters = [], points = 0, setList = [], choiceSet = [];
var maxLetters = 8;
var page = 'home';
var consonants = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"];
var vowels = ['a','e','i','o','u'];
var key = "";

function load() {
    if('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js', {scope: '.'})
        .then(function (registration) {}, function (err) {
            console.error('PWA: ServiceWorker registration failed: ', err);
        });
    }
    window.addEventListener('keydown', function() {
    if(event.keyCode === 13) {
        submit(document.getElementById('answer'));
    }
    else if(page === 'game') {
        document.getElementById("answer").focus();
        filter(document.getElementById("answer"));
    }
    });
    setList = eight;
}

function tab(t) {
    var tabs = document.getElementsByClassName("container");
    for(var i = 0; i < tabs.length; i++) {
        tabs[i].style.display = "none";
    }
    document.getElementById(t).style.display = "block";
    page = t;
}
function newGame() {
    points = 0;
    letters = [];
    used = [];
    tab('game');
    document.getElementById("wordBank").innerHTML = "";
    document.getElementById("wordCount").innerHTML = "0 WORDS";
    document.getElementById("answer").focus();
    chooseLetters();
    document.getElementById('points').innerHTML = "0<span id='label'>PTS</span>";
    startClock(60);
}
function chooseLetters() {
    document.getElementById("letters").innerHTML = "";
    var index = Math.floor(Math.random()*setList.length);
    console.log(index);
    key = setList[index];
    letters = key.split("");
    displayLetters();
}
function displayLetters() {
    letters.shuffle();
    document.getElementById("letters").innerHTML = "";
    for(var i = 0; i < letters.length; i++) {
        document.getElementById("letters").innerHTML += '<div id="letter_'+i+'" onclick="toggleLetter(this)" class="letter">'+letters[i]+'</div>';
    }
}
function submit(elem) {
    if(page !== 'game') {return;}
    var str = elem.value;
    if(wordExists(str) && used.indexOf(str) === -1 && filter(elem) && str.length > 2) {
        points += str.length*str.length * 50;
        used.push(str);
        document.getElementById("wordBank").innerHTML += '<div class="word">'+str+'</div>';
        document.getElementById("wordCount").innerHTML = used.length !== 1 ? '<b>' + used.length + '</b> WORDS' : '<b>' + used.length + '</b> WORD';
    }
    else {
        shake(elem);
    }
    elem.value = "";
    showLetters([""]);
    document.getElementById("points").innerHTML = comma(points) + '<span id="label">PTS</span>';
}

function filter(elem) {
    var val = elem.value.split('');
    var stack = letters.slice();
    var good = true;
    for(var i = 0;i<val.length;i++) {
        if(stack.indexOf(val[i]) === -1) {
            val.splice(i,1);
            good = false;
        }
        else {
            val[i] = val[i].toLowerCase();
            stack.splice(stack.indexOf(val[i]), 1);
        }
    }
    showLetters(val);
    elem.value = val.join('');
    return good;
}
function showLetters(val) {
    var stack = val.slice();
    for(var i = 0; i < letters.length; i++) {
        if(stack.indexOf(letters[i]) > -1) {
            document.getElementById("letter_"+i).className = "letter on";
            stack.splice(stack.indexOf(letters[i]),1);
        }
        else {
            document.getElementById("letter_"+i).className = "letter";
        }
    }
}

function toggleLetter(elem) {
    if(elem.className.indexOf('on') > -1) {
        document.getElementById('answer').value = document.getElementById('answer').value.replace(elem.innerHTML,'');
    }
    else {
        document.getElementById('answer').value += elem.innerHTML;
    }
    filter(document.getElementById('answer'));
}

function shake(elem) {
    elem.style.transition = ".1s margin-left";
    elem.style.marginLeft = "0 0 0 -10px";
    elem.style.border = "1px solid var(--error)";
    setTimeout(function() {elem.style.marginLeft = '10px';}, 100);
    setTimeout(function() {elem.style.marginLeft = '-10px';}, 200);
    setTimeout(function() {elem.style.marginLeft = '10px';}, 300);
    setTimeout(function() {elem.style.marginLeft = '-10px';}, 400);
    setTimeout(function() {elem.style.marginLeft = '10px';}, 500);
    setTimeout(function() {elem.style.marginLeft = '-10px';}, 600);
    setTimeout(function() {elem.style.marginLeft = '0';}, 700);
    setTimeout(function() {
        elem.style.border = "1px solid var(--accent)";
    }, 700);
}

Array.prototype.shuffle = function() {
    var currentIndex = this.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = this[currentIndex];
        this[currentIndex] = this[randomIndex];
        this[randomIndex] = temporaryValue;
    }
    return this;
}




function comma(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

var timer = 0;
var time = 0;
function startClock(sec) {
    time = sec;
    clock();
    timer = setInterval(clock,1000);
}
function clock() {
    if(time === 0) {
        clearInterval(timer);
        gameOver();
    }
    var mins = Math.floor(time/60);
    var secs = time - mins*60;
    if(secs.toString().length == 1) {secs = "0"+secs;}
    document.getElementById('clock').innerHTML = mins + ":" + secs;
    time --;
}
function gameOver() {
    document.getElementById("end_points").innerHTML = comma(points) + '<span id="label">PTS</span>';
    document.getElementById("end_wordCount").innerHTML = used.length !== 1 ? '<b>' + used.length + '</b> WORDS' : '<b>' + used.length + '</b> WORD';
    document.getElementById("end_wordBank").innerHTML = "";
    for(var i = 0;i<used.length;i++) {
        document.getElementById("end_wordBank").innerHTML += '<div class="word">'+used[i]+'</div>';
    }
    tab('end');
}
function wordExists(x) {
    var i = hash(x), result;
    if (!words[i]) {
        return false;
    }
    return true;
}
function hash(s) {
    for(var i=0, h=1; i<s.length; i++) {
        h=Math.imul(h+s.charCodeAt(i)|0, 2654435761);
    }
    return (h^h>>>17)>>>0;
};