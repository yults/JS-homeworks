'use strict';

/**
 * Телефонная книга
 */

const phoneBook = new Map();

class Contact {
    constructor() {
        this.tel = new Set();
        this.mail = new Set();
    }
}

/** 
 *  Exceptions 
 */


/**
 * Вызывайте эту функцию, если есть синтаксическая ошибка в запросе
 * @param {number} lineNumber – номер строки с ошибкой
 * @param {number} charNumber – номер символа, с которого запрос стал ошибочным
 */
function syntaxError(lineNumber, charNumber) {
    throw new Error(`SyntaxError: Unexpected token at ${lineNumber}:${charNumber}`);
}

function EOFException() {
    if (pos === len)
        syntaxError(lineNum, posInLine);
}

/**
 * globals
 */

let request, len, ans; // запрос, его длина и ответ на запрос
let lineNum, posInLine; // for exceptions lineNumber charNumber
let emailAr, telAr; 
let pos; // globalPos in all request


/**
 * comporator
 */

function cmp(word) {
    for (let i = 0; i < word.length; i++) {
        if (word[i] !== request[pos + i])
            return false;
    }
    pos += word.length;
    posInLine += word.length;
    return true;
}

function skipWS() {
    if (request[pos] !== " ")
        syntaxError(lineNum, posInLine);
    pos++;
    posInLine++;
}

/**
 * parse name email tel
 */

function parseName() {
    skipWS();
    let name = "";
    while (pos < len) {
        if (request[pos] === ";")
            break;
        EOFException();
        name += request[pos];
        pos++;
        posInLine++;
    }
    return name;
}

function parseEmail() {
    skipWS();
    let email = "";
    let emailLen = 0;
    while (pos < len) {
        if (request[pos] === " " || request[pos] === ";")
            break;
        email += request[pos];
        pos++;
        emailLen++;
    }
    if (pos === len)
        syntaxError(lineNum, posInLine);
    posInLine += emailLen;
    return email;
}

function parseTel() {
    skipWS();
    let telef = "";
    if (/\d/.test(request[pos + 10]))
        syntaxError(lineNum, posInLine);
    for (let i = pos; i < pos + 10; i++)
        if (!(/\d/.test(request[i])))
            syntaxError(lineNum, posInLine);
        else telef += request[i];
    pos += 10
    posInLine += 10;
    return telef;
}

function parseTelemail() {
    telAr = [];
    emailAr = [];
    while (pos < len) {
        if (cmp("телефон"))
            { telAr.push(parseTel()); }
        else
            if (cmp("почту"))
                emailAr.push(parseEmail());
            else
                syntaxError(lineNum, posInLine);
        skipWS();
        if (!cmp("и")) break;
        skipWS();
    }
    EOFException();
    if (!cmp("для")) syntaxError(lineNum, posInLine);
    skipWS();
    if (!cmp("контакта"))
        syntaxError(lineNum, posInLine);
    let name = parseName();
    if (request[pos] === ";")
        pos++;
    return name;
}

/**
 * help functions
 */

function checkPart(part, telemail) {
    let checker = false;
    telemail.forEach(element => {
        if (element.includes(part))
            checker = true;
    });
    return checker;
}

function telChange(n) {
    return `+7 (${n.substr(0, 3)}) ${n.substr(3, 3)}-${n.substr(6, 2)}-${n.substr(8, 2)}`;
}

/**
 * parse after First
 */

function parseNew() {
    skipWS();
    if (!cmp("контакт"))
        syntaxError(lineNum, posInLine);
    let name = parseName();
    if (request[pos] === ";")
        pos++;
    if (!phoneBook.has(name))
        phoneBook.set(name, new Contact());
}

function parseDel() {
    skipWS();
    if (cmp("контакты")) {
        if (!cmp(","))
            syntaxError(lineNum, posInLine);
        skipWS();
        if (!cmp("где"))
            syntaxError(lineNum, posInLine);
        skipWS();
        if (!cmp("есть"))
            syntaxError(lineNum, posInLine);
        let part = parseName();
        pos++;
        if (part.length > 0) {
            let names = [];
            for (let contact of phoneBook.keys()) {
                if (contact.includes(part) || checkPart(part, phoneBook.get(contact).tel) || checkPart(part, phoneBook.get(contact).mail))
                    names.push(contact);
            }
            for (let contact of names)
                phoneBook.delete(contact);
        }
        return;
    }
    else if (cmp("контакт")) {
        let name = parseName();
        //if (request[pos] === ";")
        pos++;
        if (phoneBook.has(name))  phoneBook.delete(name);
        return;
    }
    else { // телефон/ы (и) почту/ы
        telAr = []
        emailAr = []
        let name = parseTelemail();
        if (phoneBook.has((name))) {
            for (const elem of telAr)
                if (phoneBook.get(name).tel.has(elem))
                    phoneBook.get(name).tel.delete(elem);
            for (const elem of emailAr)
                if (phoneBook.get(name).mail.has(elem))
                    phoneBook.get(name).mail.delete(elem);
            phoneBook.set(name, phoneBook.get(name));
        }
        return;
    }
    syntaxError(lineNum, posInLine);
}

function parseAdd() {
    skipWS();
    telAr = [];
    emailAr = [];
    let name = parseTelemail();
    if (phoneBook.has((name))) {
        for (const elem of telAr)
            if (!phoneBook.get(name).tel.has(elem))
                phoneBook.get(name).tel.add(elem);
        for (const elem of emailAr)
            if (!phoneBook.get(name).mail.has(elem))
                phoneBook.get(name).mail.add(elem);
        phoneBook.set(name, phoneBook.get(name));
    }
}

function parseShow() {
    let findFlag = [];
    skipWS();
    while (pos < len) {
        if (cmp("имя"))
            findFlag.push("имя");
        else if (cmp("почты"))
            findFlag.push("почты");
        else if (cmp("телефоны"))
            findFlag.push("телефоны");
        else
            syntaxError(lineNum, posInLine);
        skipWS();
        if (!cmp("и"))
            break;
        skipWS();
    }
    if (!cmp("для")) syntaxError(lineNum, posInLine);
    EOFException();
    skipWS();
    if (!cmp("контактов"))
        syntaxError(lineNum, posInLine);
    if (!cmp(","))
        syntaxError(lineNum, posInLine);
    skipWS();
    if (!cmp("где"))
        syntaxError(lineNum, posInLine);
    skipWS();
    if (!cmp("есть"))
        syntaxError(lineNum, posInLine);
    if (pos + 1 < len && request[pos + 1] === ";") {
        pos += 2;
        return;
    }
    let part = parseName();
    if (part === "") return;
    EOFException();
    pos++;
    let show = [];
    if (part.length === 0) return [];
    let names = [];
    for (let contact of phoneBook.keys()) {
                if (contact.includes(part) || checkPart(part, phoneBook.get(contact).tel) || checkPart(part, phoneBook.get(contact).mail))
                    names.push(contact);
            }
    for (let contact of names) {
        let showBefore = "";
        for (let flag of findFlag) {
            switch (flag) {
                case "имя" : {
                    showBefore += contact + ";";
                    break;
                }
                case "телефоны": {
                    //if (phoneBook.get(contact).tel.size > 0)
                    showBefore += Array.from(phoneBook.get(contact).tel).map(telChange).toString() + ";";
                    break;
                }
                case "почты": {
                    //if (phoneBook.get(contact).mail.size > 0)
                    showBefore += Array.from(phoneBook.get(contact).mail).toString() + ";";
                    break;
                }
            }
        }
        show.push(showBefore.substr(0, showBefore.length - 1));
    }
    ans = ans.concat(show);
}

/**
 * Выполнение запроса на языке pbQL
 * @param {string} query
 * @returns {string[]} - строки с результатами запроса
 */
function run(query) {
    ans = [];
    request = query;
    len = query.length;
    lineNum = 1;
    pos = 0;
    while (pos !== len) {
        posInLine = 1;
        if (cmp("Создай")) {
            parseNew();
        }
        else if (cmp("Удали")) {
            parseDel();
        }
        else if (cmp("Добавь")) {
            parseAdd();
        }
        else if (cmp("Покажи")) {
            parseShow();
        }
        else syntaxError(lineNum, posInLine);
        //if (request[pos] !== ";") EOFException();
        lineNum++;
    }
    console.log(ans)
    return ans;
}

run(
    'Добавь телефон 55566677' +
    'Добавь телефон 5556667788 и' +
    'Покажи и имя для контактов, где есть ий;'
)