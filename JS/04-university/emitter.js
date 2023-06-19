/**
 * Возвращает новый emitter
 * @returns {Object}
 */

function getEmitter() {
    const evt_map = new Map();
    return {
 
        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         */
        on: function (event, context, handler) {
            if (evt_map.has(event)) {
                evt_map.get(event).push({context: context, handler: handler})
                return this;
            }
            evt_map.set(event, [{ context: context, handler: handler }]);
            return this;
        },
 
        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         */
        off: function (event, context) {
            if (!evt_map.has(event)) return this;
            for (evt of evt_map.keys()){
                if (evt === event || evt.startsWith(`${event}.`)) {
                    evt_map.set(evt, evt_map.get(evt).filter(
                        (x) => x.context !== context
                    ))
                }
            }
            return this;
        },
 
        /**
         * Уведомить о событии
         * @param {String} event
         */
        emit: function (event) {
            if (evt_map.has(event)) {
                for (evt of evt_map.get(event)) {
                    evt.handler.call(evt.context)
                }
            }
            let len = event.length - 1;
            for (let i = 0; i <= len; i++) {
                if (event[len - i] === '.') {
                    let eventEmit = event.substr(0, len - i);
                    if (evt_map.has(eventEmit)) {
                        for (evt of evt_map.get(eventEmit)) {
                            evt.handler.call(evt.context)
                        }
                    }
                }
            }
            return this;
        },
 
        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         */
        several: function (event, context, handler, times) {
            let timesi = times;
            return this.on(event, context,
                () => { if (timesi) { handler.call(context); timesi--; } })
        },
 
        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            let frequencyi = frequency;
            return this.on(event, context,
                () => {
                    if (frequencyi === frequency)
                    { handler.call(context); frequencyi = 0 } frequencyi++;
                })
        }
    };
}
 
module.exports = {
    getEmitter
};