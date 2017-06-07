/* global $$ */

var sideWidth = 60;
var wsUri = "ws://" + document.location.host + "/cronos-war/ResultBroadcast";
var websocket = new WebSocket(wsUri);
var lapsMass = [];
var shootings = [];
shootings.lenght = 0;

var laps = {
    id: "laps",
    view: "list",
    label: "laps",
    align: "center",
    data: lapsMass,
    template: "#raceResult.racer.name#. #type# #id# time: #markTime/1000#"
};

var shootingList = {
    id: "shootingList",
    view: "list",
    label: "shootings",
    align: "center",
    data: shootings,
    type:{height:60},
    template: function (obj) {
        var result = obj.sportsmanName + ". Shooting "+obj.id + 
                ": <div class=containerForRounds>";
        for (var i = 0; i < 5; i++) {
            if (obj.marks[i] == undefined) {
                result += "<div class=round></div>";
            } else if (obj.marks[i].slip == true) {
                result += "<div class=redRound></div>";
            } else {
                result += "<div class=whiteRound></div>";
            }            
        }
        result+="</div>";
        return result;
        //webix.css 7962
    }
};


var shoots = {
    id: "shoots",
    view: "label",
    label: "shoots",
    align: "center"
};

websocket.onerror = function (evt) {
    onError(evt);
};
websocket.onmessage = function (evt) {
    onMessage(evt);
};

function onError(evt) {
    writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}
function sendText(text) {
    console.log("sending text: " + text);
    websocket.send(text);
}

function onMessage(evt) {
    var mark = JSON.parse(evt.data);
    if (mark.type === "Lap") {
        lapsMass.push(mark);
        $$("laps").define("data", lapsMass);
        $$("laps").refresh();
    }
    if (mark.type == "Shoot") {
        var resultNum = -1;
        for (var i = 0; i < shootings.lenght; i++) {
            if (shootings[i].id == mark.shootingID)
            {
                resultNum = i;
                break;
            }
        }
        if (resultNum == -1) { //ничего не нашли, создаем новый
            shootings.push({
                id: mark.shootingID, 
                marks: [mark], 
                length: 0,
                sportsmanName:mark.raceResult.racer.name
            });
            shootings.lenght++;
            //тут сделаем рефреш
            //тут найдем эту плашку не знаю пока как
            //тут нарисуем ей черные кружочки
        } else { //нашли, пишем в старый
            shootings[resultNum].marks.push(mark);
            shootings[resultNum].length++;
            //снова находим соответсвтующую плашку и в ней у сооответствующего кружочка меняем класс
        }
        //или это все фигня, в темлейте напишем функцию добавления даты в лист внутри элемента листа

        $$("shootingList").define("data", shootings);
        $$("shootingList").refresh();
        console.log(shootings);
    }



//для каждого марк смотрим результата
//для каждой новой марки типа лап рисуем новую плашечку
//для стрельб нужен контейнер - shootingID
//проверяем айди контейнера стрельбы - рисуем кружочек в соответствующий див
//
//итак, проверка на тип марки
//если стрельба - проверка на айди контейнера
//записываем его в сет
//если в сете его не было, рисуем новую плашку
//если был - дорисовываем в старую
//нужен номер выстрела в контейнере - numberInShooting

//    var newdiv = document.createElement('div');
//    newdiv.innerHTML = mark.raceResult.id;
//    newdiv.className = 'containerForRounds';
//    document.body.appendChild(newdiv);
}

var role = "";
var answer = "";

var labelLogin = {
    id: "labelLogin",
    view: "label",
    label: role,
    align: "center"
};

var startButton = {
    id: "startButton",
    view: 'button',
    value: "Старт",
    type: "iconTop",
    icon: "play",
    align: "center",
    click: function () {
        sendText("start");
    },
    width: sideWidth,
    height: 45,
    css: "startButton"

};

var startButtonForm = {
    id: "startButtonForm",
    view: 'form',
    elements: [startButton,{}],
    hidden: true,
    padding: 0
};

var loginForm = {
    id: "loginForm",
    view: 'form',
    elements: [
        {height: 2},
        {rows: [labelLogin]},
        {
            name: "login",
            view: "text",
            placeholder: "Введите логин",
            align: "center",
            width: 250
        },
        {
            name: "pass",
            view: "text",
            placeholder: "Введите пароль",
            align: "center",
            width: 250
        },
        {
            view: 'button',
            value: "Войти",
            type: "form",
            align: "center",
            click: function () {
                login();
            },
            width: 250
        },
        {
            view: 'button',
            value: "Отменить",
            type: "form",
            align: "center",
            click: function () {
                $$('loginForm').hide();
                $$('loginForm').clear();
            },
            width: 150
        },
        {height: 5}
    ],
    hidden: true,
    padding: 0
};

function login() {
    var login = $$('loginForm').getValues().login;
    var pass = $$('loginForm').getValues().pass;
    var request = new XMLHttpRequest();
    request.open('POST', 'LoginController', false);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.send("login=" + encodeURIComponent(login) + "&pass=" + encodeURIComponent(pass));
    answer = request.responseText;
    if (request.status === 200) {
        if (answer === "\"Incorrect password, pls try again\"") {
            $$("labelLogin").define("label", answer);
            $$("labelLogin").refresh();
        } else {
            role = answer;
            $$('loginForm').hide();
            $$('loginForm').clear();
            //$$("startButtonForm").define("label", role);
            $$("startButtonForm").refresh();
            $$("startButtonForm").show();
            $$("loginButton").hide();
        }
    } else {
        answer = "Incorrect login, pls try again";
        $$("labelLogin").define("label", answer);
        $$("labelLogin").refresh();
    }
}
;

var loginButton = {
    id: "loginButton",
    view: 'button',
    value: "Войти",
    type: "form",
    align: "center",
    click: function () {
        $$('loginForm').show();
    },
    width: sideWidth,
    height: 45
};


var sideMenu = {
    width: sideWidth,
    rows: [
//        {template: "<img src='icons/norway.png' height=20 alt='Log in'></>", height: 30, id: "login"},
//        {template: "<img src='icons/russia.png' height=20></>", height: 30},
//        {template: "<img src='icons/france.png' height=20></>", height: 30},
        {height: 2},
        {rows: [startButtonForm]},
        {rows: [loginButton]},
        {}
    ]
};
