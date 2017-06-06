var wsUri = "ws://" + document.location.host + "/cronos-war/ResultBroadcast";
var websocket = new WebSocket(wsUri);
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
    console.log("received: " + evt.data);
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
    var mark = JSON.parse(evt.data);
    var newdiv = document.createElement('div');
    newdiv.innerHTML = mark.raceResult.id;
    newdiv.className = 'containerForRounds';
    document.body.appendChild(newdiv);
}