'use strict';
 
/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */

const cmp = (f, s) => f.name.localeCompare(s.name)

function getGuestsList(friends, filter, maxLevel = Infinity) {
    const guests = [];
    let level = 0;
    const set = new Set();
    let bestFriends = friends.filter(friend => friend.best).sort(cmp);
    while (bestFriends.length > 0 && level < maxLevel) {
        bestFriends.sort(cmp).forEach(function (friend) {
                guests.push(friend);
                set.add(friend.name);
            });
        const leastFriends = new Set();
        for (let friend of bestFriends) {
            for (let friend2depth of friend.friends) {
                if (!set.has(friend2depth))
                    leastFriends.add(friend2depth)
            }
        }
        bestFriends = friends.filter(fr => leastFriends.has(fr.name))
        level++;
    }
    return guests.filter(filter.gender)
}

function Iterator(friends, filter) {
    this.guestsList = getGuestsList(friends, filter, this.maxLevel)
    this.done = function () { return !(this.guestsList.length) };
    this.next =  () => this.done() ? null : this.guestsList.shift();
}

/**
 * Итератор по друзям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel – максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
    this.maxLevel = maxLevel;
    Iterator.call(this, friends, filter)
}
 

LimitedIterator.prototype = Object.create(Iterator.prototype);
LimitedIterator.prototype.constructor = LimitedIterator;

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.gender = () => true;
}
 
/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.gender = ({ gender }) => gender === "male";
}

MaleFilter.prototype = Object.create(Filter.prototype);
MaleFilter.prototype.constructor = MaleFilter;

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.gender = ({ gender }) => gender === "female";
}

FemaleFilter.prototype = Object.create(Filter.prototype);
FemaleFilter.prototype.constructor = FemaleFilter;
 
exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;
 
exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;