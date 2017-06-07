var sideWidth = document.documentElement.clientHeight / 18;
var wsUri = "ws://" + document.location.host + "/cronos-war/ResultBroadcast";
var websocket = new WebSocket(wsUri);
var lapsMass = [{
            "id": 1,
            "markTime": 0,
            "startOrEnd": true,
            "raceResult": {
                "id": 1,
                "racer": {
                    "id": 1
                },
                "race": {
                    "id": 1
                }
            },
            "type": "Lap"
        }];
var shootings = [];

var laps = {
    id: "laps",
    view: "list",
    label: "laps",
    align: "center",
    data: lapsMass,
    template: "#type#: #markTime#",
    onClick: function(){this.refresh();console.log("refresh");}
    
};

document.
 
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
    //console.log("received: " + evt.data);    
    var mark = JSON.parse(evt.data);
//    console.log(mark);
    if (mark.type === "Lap"){
        lapsMass.push(mark);        
    }
    if (mark.type === "Shoot"){
        shootings.push(mark);    
    }
    console.log("Laps: ");
    console.log(lapsMass);
    console.log("Shootings: ");
    console.log(shootings);

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

var startButton = {
    id: "startButton",
    view: 'button',
    value: "Старт",
    type:"iconTop",
    icon:"play",
    align: "center",
    click: function () {
        sendText("start");
    },
    width: sideWidth,
    height: 40,
    css: "startButton",
    hidden: false
};



var sideMenu = {
    width: sideWidth,
    rows: [
        {template: "<img src='icons/norway.png' height=20 alt='Log in'></>", height: 30, id: "login"},
        {template: "<img src='icons/russia.png' height=20></>", height: 30},
        {template: "<img src='icons/france.png' height=20></>", height: 30},
        {cols: [startButton]}
    ]
};