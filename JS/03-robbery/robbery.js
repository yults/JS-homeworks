'use strict';

const isExtraTaskSolved = true;
let bankTimeFrom = [];
let bankTimeTo = [];
let scheduleFrom = [] 
let scheduleTo = []
let timeZoneBank = 0;
const MINUT = 60;
const DAY = 60 * 24;

function toweek(str) {
    switch(str) {
        case "ПН": return 0;
        case "ВТ": return 1;
        case "СР": return 2;
        case "ЧТ": return 3;
        case "ПТ": return 4;
        case "СБ": return 5;
        case "ВС": return 6;
    }
}

function toNum(val) {
    if (val < DAY) return [val , 'ПН'];
    if (val < DAY * 2) return [val - DAY, 'ВТ'];
    else return [val - DAY * 2, 'СР'];
}

function bankParsing(bankhours) {
    //from: '10:00+5', to: '18:00+5'
    let dayWeek = [];
    dayWeek[0] = 0;
    dayWeek[1] = DAY;
    dayWeek[2] = 2 * DAY;

    let timeFrom = bankhours.from.split(':')[0] * MINUT + bankhours.from.split(':')[1].split('+')[0] / 1;
    let timeTo = bankhours.to.split(':')[0] * MINUT + bankhours.to.split(':')[1].split('+')[0] / 1;
    bankTimeFrom = [], bankTimeTo = [];
    for (let i = 0; i < 3; i++) {
        bankTimeFrom.push(dayWeek[i] + timeFrom);
        bankTimeTo.push(dayWeek[i] + timeTo);
    }
}

//Schedule Parse

function scheduleParsing(robber) {
    scheduleFrom.push([]); scheduleTo.push([]);

    robber.forEach(strofsche => {
        //from: 'ПН 12:00+5'
        let timeZoneDF = timeZoneBank - parseInt(strofsche.from.split('+')[1]);
        scheduleFrom[scheduleFrom.length - 1][0] = Math.min(timeZoneDF * MINUT, 0);
        let dayWeekFrom = toweek(strofsche.from.split(' ')[0]) * DAY;
        let timehour = parseInt(strofsche.from.split(' ')[1].split(':')[0]);
        let timemin = parseInt(strofsche.from.split(':')[1].split('+')[0]);

        let totalTimeFrom = dayWeekFrom + (timehour + timeZoneDF) * MINUT + timemin;
        scheduleTo[scheduleTo.length - 1].push(totalTimeFrom)

        // to: 'ПН 17:00+5'
        let timeZoneDT = timeZoneBank - parseInt(strofsche.to.split('+')[1]);
        let dayWeekTo = toweek(strofsche.to.split(' ')[0]) * DAY;
        timehour = parseInt(strofsche.to.split(' ')[1].split(':')[0]);
        timemin = parseInt(strofsche.to.split(':')[1].split('+')[0]);

        let totalTimeTo = dayWeekTo + (timehour + timeZoneDT) * MINUT + timemin;
        scheduleFrom[scheduleFrom.length - 1].push(totalTimeTo / 1)
    }); 
    scheduleTo[scheduleTo.length - 1].push(7 * DAY - 1)
}

// Складывание промежутков

function findFrom12(fir, sec, x, y) { 
    let ssize = scheduleFrom.length - 1;
    if (scheduleFrom[fir][x] === scheduleFrom[sec][y]) { 
        if (scheduleTo[fir][x] === scheduleTo[sec][y]) { 
            scheduleFrom[ssize].push(scheduleFrom[fir][x]);
            scheduleTo[ssize].push(scheduleTo[fir][x]);
            x++;
            y++;
            if (x < scheduleFrom[fir].length && y < scheduleFrom[sec].length) findFrom12(fir, sec, x, y);
        } else if (scheduleTo[fir][x] > scheduleTo[sec][y]) {
            scheduleFrom[ssize].push(scheduleFrom[sec][y]);
            scheduleTo[ssize].push(scheduleTo[sec][y]);
            y++;
            if (x < scheduleFrom[fir].length && y < scheduleFrom[sec].length) findFrom12(sec, fir, y, x);
        } else if (scheduleTo[fir][x] < scheduleTo[sec][y]) {
            scheduleFrom[ssize].push(scheduleFrom[fir][x]);
            scheduleTo[ssize].push(scheduleTo[fir][x]);
            x++;
            if (x < scheduleFrom[fir].length && y < scheduleFrom[sec].length) findFrom12(fir, sec, x, y);
        }
    } else if (scheduleFrom[fir][x] < scheduleFrom[sec][y]) {
                if (scheduleTo[sec][y] === scheduleTo[fir][x]) {
                    scheduleFrom[ssize].push(scheduleFrom[sec][y]);
                    scheduleTo[ssize].push(scheduleTo[sec][y]);
                    y++;
                    x++;
                    if (x < scheduleFrom[fir].length && y < scheduleFrom[sec].length) findFrom12(sec, fir, y, x);
                }  else if (scheduleTo[fir][x] < scheduleFrom[sec][y]) {
                    x++;
                    if (x < scheduleFrom[fir].length && y < scheduleFrom[sec].length) findFrom12(fir, sec, x, y);
                } else if (scheduleTo[fir][x] > scheduleTo[sec][y]) {
                    scheduleFrom[ssize].push(scheduleFrom[sec][y]);
                    scheduleTo[ssize].push(scheduleTo[sec][y]);
                    y++;
                    if (x < scheduleFrom[fir].length && y < scheduleFrom[sec].length) findFrom12(sec, fir, y, x);
                } else if (scheduleTo[fir][x] < scheduleTo[sec][y]) {
                    scheduleFrom[ssize].push(scheduleFrom[sec][y]);
                    scheduleTo[ssize].push(scheduleTo[fir][x]);
                    x++;
                    if (x < scheduleFrom[fir].length && y < scheduleFrom[sec].length) findFrom12(fir, sec, x, y);
        }
    }
    else {
        findFrom12(sec, fir, y, x);
    }
}


/**
 * @param {Object} schedule Расписание Банды
 * @param {number} duration Время на ограбление в минутах
 * @param {Object} workingHours Время работы банка
 * @param {string} workingHours.from Время открытия, например, "10:00+5"
 * @param {string} workingHours.to Время закрытия, например, "18:00+5"
 * @returns {Object}
 */
function getAppropriateMoment(schedule, duration, workingHours) {
    bankTimeFrom = []; bankTimeTo = []; scheduleFrom = []; scheduleTo = []
    timeZoneBank = workingHours.from.split('+')[1];
    let existsFlag = false;
    bankParsing(workingHours);
    scheduleParsing(schedule.Danny); //schedule[0] = Danny
    scheduleParsing(schedule.Rusty); //schedule[1] = Rusty
    scheduleParsing(schedule.Linus); //schedule[2] = Linus
    scheduleFrom.push([]);
    scheduleTo.push([]);
    findFrom12(0, 1, 0, 0) // res = schedule 3
    scheduleFrom.push([]);
    scheduleTo.push([]);
    findFrom12(2, 3, 0, 0) // res = schedule 4
    scheduleFrom.push(bankTimeFrom) // res = schedule 5
    scheduleTo.push(bankTimeTo)
    scheduleFrom.push([]);
    scheduleTo.push([]);
    findFrom12(4, 5, 0, 0)
    let timeOfRobStart = []
    for (let i = 0; i < scheduleFrom[6].length; i++)
    {
        let [start, dayStart] = toNum(scheduleFrom[6][i]);
        let [end, dayEnd] = toNum(scheduleFrom[6][i] + duration);
        if (scheduleTo[6][i] - scheduleFrom[6][i] >= duration && dayStart === dayEnd) {
            existsFlag = true;
            timeOfRobStart.push(scheduleFrom[6][i])
        }
        let j = 1;
        let [start2, dayStart2] = toNum(scheduleFrom[6][i] + 30);
        let [end2, dayEnd2] = toNum(scheduleFrom[6][i] + 30 + duration);
        while (scheduleTo[6][i] - scheduleFrom[6][i] - 30 * j >= duration && dayStart2 === dayEnd2) {
            timeOfRobStart.push(scheduleFrom[6][i] + 30 * j);
            j++;
            [start2, dayStart2] = toNum(scheduleFrom[6][i] + 30 * j);
            [end2, dayEnd2] = toNum(scheduleFrom[6][i] + 30 * j + duration);
            //console.log(dayEnd2, dayStart2, scheduleFrom[6][i] + 30 * j, scheduleTo[6][i])
            
        }
    }
    let laterx = 0;

    return {
        /**
         * Найдено ли время
         * @returns {boolean}
         */
        exists() {
            return existsFlag;
        },

        /**
         * Возвращает отформатированную строку с часами
         * для ограбления во временной зоне банка
         *
         * @param {string} template
         * @returns {string}
         *
         * @example
         * ```js
         * getAppropriateMoment(...).format('Начинаем в %HH:%MM (%DD)') // => Начинаем в 14:59 (СР)
         * ```
         */
        format(template) {
            if (existsFlag === false) return '';
            let [start, dayStart] = toNum(timeOfRobStart[laterx])
            let hours = Math.floor(start / MINUT);
            let minutes = start - hours * MINUT;

            return template
                .replace(/%DD/, dayStart)
                .replace(/%HH/, String(hours).padStart(2, '0'))
                .replace(/%MM/, String(minutes).padStart(2, '0'));
        },

        /**
         * Попробовать найти часы для ограбления позже [*]
         * @note Не забудь при реализации выставить флаг `isExtraTaskSolved`
         * @returns {boolean}
         */
        tryLater() {
            laterx++;
            if (laterx < timeOfRobStart.length) return true;
            laterx--;
            return false;
        }
    };
}

module.exports = {
    getAppropriateMoment, isExtraTaskSolved
};
