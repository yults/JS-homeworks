'use strict';

/**
 * Складывает два целых числа
 * @param {Number} a Первое целое
 * @param {Number} b Второе целое
 * @throws {TypeError} Когда в аргументы переданы не числа
 * @returns {Number} Сумма аргументов
 */
function abProblem(a, b) {
    if (!(Number.isFinite(a) && Number.isFinite(b))) throw TypeError("Not numbers");
    return a + b;
}

/**
 * Определяет век по году
 * @param {Number} year Год, целое положительное число
 * @throws {TypeError} Когда в качестве года передано не число
 * @throws {RangeError} Когда год – отрицательное значение
 * @returns {Number} Век, полученный из года
 */
function centuryByYearProblem(year) {
    if (!(Number.isFinite(year))) throw TypeError("Not number");
    if (year <= 0) throw RangeError("Not positive");
    year--;
    return (year - year % 100) / 100 + 1;
}

/**
 * Переводит цвет из формата HEX в формат RGB
 * @param {String} hexColor Цвет в формате HEX, например, '#FFFFFF'
 * @throws {TypeError} Когда цвет передан не строкой
 * @throws {RangeError} Когда значения цвета выходят за пределы допустимых
 * @returns {String} Цвет в формате RGB, например, '(255, 255, 255)'
 */
function colorsProblem(hexColor) {
    if (!(typeof hexColor === "string")) throw TypeError("Not string");
    if (!(/^#[0-9A-Fa-f]{6}$/.test(hexColor))) throw RangeError("Not RGB");
    let converter = parseInt(hexColor.split('#')[1], 16);
    let r = (converter >> 16) & 255;
    let g = (converter >> 8) & 255;
    let b = converter & 255;
    return '(' + r + ', ' + g +', ' + b + ')';
}

/**
 * Находит n-ое число Фибоначчи
 * @param {Number} n Положение числа в ряде Фибоначчи
 * @throws {TypeError} Когда в качестве положения в ряде передано не число
 * @throws {RangeError} Когда положение в ряде не является целым положительным числом
 * @returns {Number} Число Фибоначчи, находящееся на n-ой позиции
 */
function fibonacciProblem(n) {
    if (!Number.isFinite(n)) throw TypeError("Not number");
    if (n < 1) throw RangeError('Not positive');
    if (n < 3) return 1;
    let prev = 1;
    let fib = 1;
    for (let i = 0; i < n - 2; i++) {
        let prev_mem = prev;
        prev = fib;
        fib = prev_mem + fib;
    }
    return fib;
}

/**
 * Транспонирует матрицу
 * @param {(Any[])[]} matrix Матрица размерности MxN
 * @throws {TypeError} Когда в функцию передаётся не двумерный массив
 * @returns {(Any[])[]} Транспонированная матрица размера NxM
 */
function matrixProblem(matrix) {
    if (!(matrix instanceof Array && matrix[0] instanceof Array)) throw TypeError("Not matrix");
    if (matrix.length === 0) return matrix;
    let n = matrix[0].length;
    let m = matrix.length;
    let ans = new Array(n);
    for (let i = 0; i < n; i++) {
        ans[i] = new Array(m);
        for (let j = 0; j < m; j++) {
            ans[i][j] = matrix[j][i];
        }
    }
    return ans;
}

/**
 * Переводит число в другую систему счисления
 * @param {Number} n Число для перевода в другую систему счисления
 * @param {Number} targetNs Система счисления, в которую нужно перевести (Число от 2 до 36)
 * @throws {TypeError} Когда переданы аргументы некорректного типа
 * @throws {RangeError} Когда система счисления выходит за пределы значений [2, 36]
 * @returns {String} Число n в системе счисления targetNs
 */
function numberSystemProblem(n, targetNs) {
    if (!(Number.isFinite(n) && Number.isFinite(targetNs))) throw TypeError("Not numbers");
    if (targetNs > 36 || targetNs < 2) throw RangeError("Incorrect SS");
    return n.toString(targetNs);
}


/**
 * Проверяет соответствие телефонного номера формату
 * @param {String} phoneNumber Номер телефона в формате '8–800–xxx–xx–xx'
 * @throws {TypeError} Когда в качестве аргумента передаётся не строка
 * @returns {Boolean} Если соответствует формату, то true, а иначе false
 */
function phoneProblem(phoneNumber) {
    if (!(typeof phoneNumber === "string")) throw TypeError("Not string");
    return (/^(8-800-)[0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(phoneNumber));
}

/**
 * Определяет количество улыбающихся смайликов в строке
 * @param {String} text Строка в которой производится поиск
 * @throws {TypeError} Когда в качестве аргумента передаётся не строка
 * @returns {Number} Количество улыбающихся смайликов в строке
 */
function smilesProblem(text) {
    if (!(typeof text === "string")) throw TypeError("Not string");
    let cnt = 0;
    let smile = /(:-\))|(\(-:)/g;
    let finder = smile.exec(text);
    while (finder != null) {
        cnt++;
        finder = smile.exec(text);
    }
    return cnt;
}

/**
 * Определяет победителя в игре "Крестики-нолики"
 * Тестами гарантируются корректные аргументы.
 * @param {(('x' | 'o')[])[]} field Игровое поле 3x3 завершённой игры
 * @returns {'x' | 'o' | 'draw'} Результат игры
 */
function ticTacToeProblem(field) {
    let sign;
    for (let t = 0; t < 2; t++) {
        if (t === 0) sign = "x"; else sign = "o";
        let diag1 = 0;
        let diag2 = 0;
        for (let i = 0; i < 3; i++) {
            let row = 0;
            let col = 0;
            for (let j = 0; j < 3; j++) {
                if (field[i][j] === sign) {
                    row++;
                }
                if (field[j][i] === sign) {
                    col++;
                }
            }
            if (field[i][i] === sign) {
                diag1++;
            }
            if (field[i][3 - i] === sign) {
                diag2++;
            }
            if (row === 3 || col === 3) {
                return sign;
            }
        }
        if (diag1 === 3 || diag2 === 3) {
            return sign;
        }
    }
    return "draw";
}

export default {
    abProblem,
    centuryByYearProblem,
    colorsProblem,
    fibonacciProblem,
    matrixProblem,
    numberSystemProblem,
    phoneProblem,
    smilesProblem,
    ticTacToeProblem
};

// Пример 1
abProblem(1, 1)
/*
    2
*/

// Пример 2
centuryByYearProblem(2018)
/*
    21
*/

// Пример 3
colorsProblem('#FFFFFF')
/*
    (255, 255, 255)
*/

// Пример 4
fibonacciProblem(1)
/*
    1
*/

// Пример 5
matrixProblem([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
])
/*
    [
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9]
    ]
*/

// Пример 6
numberSystemProblem(5, 2)
/*
    '101'
*/

// Пример 7
phoneProblem('8-800-333-51-73')
/*
    true
*/

// Пример 8
smilesProblem(':-)')
/*
    1
*/

// Пример 9
ticTacToeProblem([
    ['x', 'x', 'x'],
    ['o', 'o', 'x'],
    ['o', 'x', 'o']
])
/*
    'x'
*/
