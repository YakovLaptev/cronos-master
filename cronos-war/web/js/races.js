var details = "";

function getDetail(id) {
    request.open('POST', 'RaceController', id);
    request.send();
    if (request.status !== 200) {
        alert(request.status + ': ' + request.statusText);
    } else {
        details = JSON.parse(request.responseText);
    }
}

var details = {
    id: "details",
    view: "label",
    align: "center",
    datatype: "json",
    width: 400,
    hidden: false
};

var raceArchive = {
    id: "raceArchive",
    view: "list",
    type: {
        width: "auto",
        template: "#id#. Место проведения: #location# Время: #eventTime#  Тип гонки: #type.raceTypeName# Количество участников: #type.participantsNumber# Количество выстрелов: #type.shootingNumber#"
    },
    url: "http://localhost:8080/cronos-war/RaceController",
    datatype: "json"
};









