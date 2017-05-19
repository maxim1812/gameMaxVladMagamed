"use strict";

// класс для управления авторизацией пользователя
export default class AuthorizationControl{
    // конструктор
    // инициализация полей класса
    constructor(elementFinder,stringController,messageElement,boxRender){
        // инициализируем поля класса вспомогательными объектами
        this.elementFinder = elementFinder;
        this.stringController = stringController;
        this.message = messageElement;
        this.boxRender = boxRender;
    }

    // метод для проверки корректности логина и пароля
    controlLoginAndPasswordStringsInAuthorizationForm(){
        // получаем содержимое логина и пароля
        // получаем логин
        const loginString = this.elementFinder.getElement("authorization-box__login-field_black-shadow").value;
        // получаем пароль
        const passwordString = this.elementFinder.getElement("authorization-box__password-field_black-shadow").value;
        // очищаем элемент для вывода сообщений
        this.message.clear();
        // переменная - флаг, для контроля, обе ли строки логина и пароля корректны
        let stringsOK = true;
        // проверка логина на корректность
        //const loginResult = this.stringController.isNormalString(loginString);
		let loginResult =  true;
		
		if (loginString ==='') {
			loginResult = "EMPTY";
		}
		else {
			loginResult =  true;
		}
        switch(loginResult){
            // если логин - пустая строка
            case "EMPTY":
                this.message.addText("Поле ввода логина пусто.");
                stringsOK = false;
                break;
            // если логин содержит некорректные символы
            case "NO_CORRECT":
                this.message.addText("Поле ввода логина содержит запретные символы.");
                stringsOK = false;
                break;
        }
        // проверка пароля на корректность
        const passwordResult = this.stringController.isNormalString(passwordString);
        // если пароль - пустая строка
        switch(passwordResult){
            case "EMPTY":
                this.message.addText("Поле ввода пароля пусто.");
                stringsOK = false;
                break;
            // если пароль содержит некорректные символы
            case "NO_CORRECT":
                this.message.addText("Поле ввода пароля содержит запретные символы.");
                stringsOK = false;
                break;
        }
        // возврат результата проверки
        return stringsOK;
    }

    // метод для попытки авторизации пользователя
    authorize(url,router,isAuthorized){
        // проверяем, корректны ли логин и пароль
        const flag = this.controlLoginAndPasswordStringsInAuthorizationForm();
        // если логин и пароль прошли проверку на корректность
        if(flag === true){
            // получаем логин и пароль
            // получаем логин
            const emailString = this.elementFinder.getElement("authorization-box__login-field_black-shadow").value;
            // получаем пароль
            const passwordString = this.elementFinder.getElement("authorization-box__password-field_black-shadow").value;
            // создаём JSON объект
            let myObjJSON = {
                email: emailString,
                password: passwordString
            };
			//Первобразуем в JSON строку с телом запроса
			let strJSON = JSON.stringify(myObjJSON); 
            // объект для вывода сообщений
            let message = this.message;
            // объект для поиска элемента
            let elementFinder = this.elementFinder;
            // объект для отображения бокса
            let boxRender = this.boxRender;
            // отправка данных на сервер
            // создаём строку - запрос
            const query = url + "auth/login";
            // создаём объект для отправки запроса
            let request = new XMLHttpRequest();
            request.open("POST",query);
            request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
            request.send(strJSON);
            // при получении ответа с сервера
            request.onreadystatechange = function(){
                // если ответ нормальный
                if(request.readyState === 4 ){
                    switch(request.status){
						case 200:
							// авторизация прошла успешно
							// меняем содержимое полей объекта, отвечающего за авторизованность пользователя
							isAuthorized.flag = true;
							let userName = JSON.parse(request.responseText).userProfile.username;
							isAuthorized.login = userName;
							// выводим содержимое логина на странице профиля
							elementFinder.getElement("my-profile-box__user-login_big-text").innerHTML = "Логин: " + isAuthorized.login;
							// переходим на страницу профиля
							router.setPathName("/profile");
							break;
						case 400:
							// ошибка авторизации, неверный логин
							message.setText("Пользователя с таким e-mail-ом не существует!");
							break;
						case 404:
							// ошибка авторизации, неверный логин или пароль
							message.setText("Вы ввели некорректные данные.");
							break;
						default:
							break;
					}
				}
			}
		}
	}
}