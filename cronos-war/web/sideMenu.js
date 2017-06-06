var sideWidth = document.documentElement.clientHeight / 18;

var startButton = {
    id: "startButton",
    view: 'button',
    value: "Старт",
    type:"iconTop",
    icon:"play",
    align: "center",
    click: function () {
        //старт
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