const pbql = require('pbql.js');

// Пример 1
pbql.run('Покажи имя для контактов, где есть ий;')
/*
    []
*/

// Пример 2
pbql.run(
    'Создай контакт Григорий;' +
    'Создай контакт Василий;' +
    'Создай контакт Иннокентий;' +
    'Покажи имя для контактов, где есть ий;'
)
/*
    [
        'Григорий',
        'Василий',
        'Иннокентий'
    ]
*/

// Пример 3
pbql.run(
    'Создай контакт Григорий;' +
    'Создай контакт Василий;' +
    'Создай контакт Иннокентий;' +
    'Покажи имя и имя и имя для контактов, где есть ий;'
)
/*
    [
        'Григорий;Григорий;Григорий',
        'Василий;Василий;Василий',
        'Иннокентий;Иннокентий;Иннокентий'
    ]
*/

// Пример 4
pbql.run(
    'Создай контакт Григорий;' +
    'Покажи имя для контактов, где есть ий;' +
    'Покажи имя для контактов, где есть ий;'
)
/*
    [
        'Григорий',
        'Григорий'
    ]
*/

// Пример 5
pbql.run(
    'Создай контакт Григорий;' +
    'Удали контакт Григорий;' +
    'Покажи имя для контактов, где есть ий;'
)
/*
    []
*/

// Пример 6
pbql.run(
    'Создай контакт Григорий;' +
    'Добавь телефон 5556667787 для контакта Григорий;' +
    'Добавь телефон 5556667788 и почту grisha@example.com для контакта Григорий;' +
    'Покажи имя и телефоны и почты для контактов, где есть ий;'
)
/*
    [
        'Григорий;+7 (555) 666-77-87,+7 (555) 666-77-88;grisha@example.com'
    ]
*/

// Пример 7
pbql.run(
    'Создай контакт Григорий;' +
    'Добавь телефон 5556667788 для контакта Григорий;' +
    'Удали телефон 5556667788 для контакта Григорий;' +
    'Покажи имя и телефоны для контактов, где есть ий;'
)
/*
    [
        'Григорий;'
    ]
*/