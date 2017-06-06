/* global $$, webix */

var sideWidth = document.documentElement.clientHeight / 17;



var role = "";
var answer = "";



var labelRole = {
    id: "labelRole",
    view: "label",
    label: role
};

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
        //старт
    },
    width: sideWidth,
    height: 45,
    css: "startButton"

};

var startButtonForm = {
    id: "startButtonForm",
    view: 'form',
    elements: [startButton, labelRole],
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
            $$("labelRole").define("label", role);
            $$("labelRole").refresh();
            $$("startButtonForm").define("label", role);
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