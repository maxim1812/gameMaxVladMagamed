"use strict";

// класс для реализация многопользовательской игры
export default class TwoPlayersGameManager{
    constructor(url,isAuthorized, message, twoPlayersCanvasManager){
        let thisManager = this;
        this.url = url;
        this.isAuthorized = isAuthorized;
        this.message = message;
        this.twoPlayersCanvasManager = twoPlayersCanvasManager;
        this.message.setText("Ожидание соперника ... ... ");
        twoPlayersCanvasManager.renderMap();

        this.socket = new WebSocket(this.url);
        let socket = this.socket;

        this.loginFirst = "";
        this.loginSecond = "";
        this.socketFirst = "";
        this.socketSecond = "";
        this.field = "";

        this.whoIAm = null;

        let gotFirstMessage = false;

        socket.onopen = function() {
            console.log("Соединение установлено");
            let myLogin = thisManager.isAuthorized.login;
            let myObj = {
                content: ""
            };
            myObj.content = myLogin.toString();
            let query = JSON.stringify(myObj);
            socket.send(query);
        };

        socket.onclose = function(event) {
            console.log('Соединение закрыто');
        };

        socket.onmessage = function(event) {
            if(gotFirstMessage === false) {
                console.log("Получены самое первое сообщение " + event.data);
                gotFirstMessage = true;
                thisManager.getMessage();
            } else {
                console.log("Получены сообщение " + event.data);
            }
        };

        socket.onerror = function(error) {
            console.log("Ошибка");
        };

    }

    getMessage(){
        let thisManager = this;
        let s = decodeURIComponent(event.data);
        let myJSON = JSON.parse(s);
        let stringWithMes = myJSON.message;
        myJSON = JSON.parse(stringWithMes);
        thisManager.loginFirst = myJSON.loginFirst;
        thisManager.loginSecond = myJSON.loginSecond;
        thisManager.socketFirst = myJSON.first;
        thisManager.socketSecond = myJSON.second;

        console.log(thisManager.loginFirst);
        console.log(thisManager.loginSecond);

        if(thisManager.isAuthorized.login === thisManager.loginFirst)
        {
            thisManager.whoIAm = true;
            thisManager.message.setText("Вы играете за крестики против игрока " + thisManager.loginSecond);
            if(thisManager.whoseTurnNow() === true){
                thisManager.addText("Ваш ход");
            }else{
                thisManager.addText("Ходит противник");
            }

        }else{
            thisManager.whoIAm = false;
            thisManager.message.setText("Вы играете за нолики против игрока " + thisManager.loginFirst);
            if(thisManager.whoseTurnNow() === false){
                thisManager.addText("Ваш ход");
            }else{
                thisManager.message.addText("Ходит противник");
            }
        }
    }


    whoseTurnNow(){
        let field = this.twoPlayersCanvasManager.getStringContentOfMap();
        let number = 0;
        for(let i = 0; i < field.length; i++){
            if(field.charAt(i) === "@"){
                number++;
            }
        }
        if(number % 2 === 0){
            return false;
        }
        return true;
    }


    // метод для получения номера клетки по её координатам
    getNumberOfKvByCoordinats(xKv,yKv){
        // создаём переменную для сохранения ответа
        let answerNumber = 0;
        // создаём строку и сохраняем в неё координаты клетки, которые разделены символом "_"
        const s = xKv + "_" + yKv;
        // в зависимости от значения данной строки получаем номер клетки - ответ
        switch(s){
            case "0_0":
                answerNumber = 0;
                break;
            case "1_0":
                answerNumber = 1;
                break;
            case "2_0":
                answerNumber = 2;
                break;
            case "0_1":
                answerNumber = 3;
                break;
            case "1_1":
                answerNumber = 4;
                break;
            case "2_1":
                answerNumber = 5;
                break;
            case "0_2":
                answerNumber = 6;
                break;
            case "1_2":
                answerNumber = 7;
                break;
            case "2_2":
                answerNumber = 8;
                break;
        }
        // возвращаем номер искомой клетки
        return answerNumber;
    }

    // метод для получения типа клетки под номером NUMBER
    getType(number){
        // возвращаем тип клетки
        return this.twoPlayersCanvasManager.getElementOfMap(number).type;
    }


    // метод для проверки, победи ли Крестики
    isKrestWin(){
        // задаём тип клетки - тип крестик
        let type = "X";
        return this.isManWin(type);
    }

    // метод для проверки, победили ли нолики
    isZeroWin(){
        // задаём тип клетки - тип нолик
        let type = "0";
        return this.isManWin(type);
    }

    isManWin(type){
        let situationWhenWinSmb = [];
        situationWhenWinSmb[0] = (this.getType(0) === type && this.getType(1) === type && this.getType(2) === type);
        situationWhenWinSmb[1] = (this.getType(3) === type && this.getType(4) === type && this.getType(5) === type);
        situationWhenWinSmb[2] = (this.getType(6) === type && this.getType(7) === type && this.getType(8) === type);
        situationWhenWinSmb[3] = (this.getType(0) === type && this.getType(4) === type && this.getType(8) === type);
        situationWhenWinSmb[4] = (this.getType(2) === type && this.getType(4) === type && this.getType(6) === type);
        situationWhenWinSmb[5] = (this.getType(0) === type && this.getType(3) === type && this.getType(6) === type);
        situationWhenWinSmb[6] = (this.getType(1) === type && this.getType(4) === type && this.getType(7) === type);
        situationWhenWinSmb[7] = (this.getType(2) === type && this.getType(5) === type && this.getType(8) === type);
        for(let i = 0; i < situationWhenWinSmb.length; i++){
            if(situationWhenWinSmb[i] === true){
                return true;
            }
        }
        return false;
    }

    // метод для проверки, все ли клетки игрового поля заняты
    areAllBusy(){
        // пробегаемся по всем клеткам игрового поля
        for(let i = 0; i < 9; i++){
            // получаем тип клетки под номером i
            const type = this.getType(i);
            // если данная клетка пустая (типу пустой клетки соответствует значение "@")
            if(type === "@"){
                // возвращаем результат, что НЕ все клетки заняты
                return false;
            }
        }
        // если до этого нас не выкинуло из цикла, это значит, что все клетки заняты
        // возвращаем результат проверки
        return true;
    }
}