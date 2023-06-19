'use strict';

const fetch = require('node-fetch');

const API_KEY = require('./key.json');

/**
 * @typedef {object} TripItem Город, который является частью маршрута.
 * @property {number} geoid Идентификатор города
 * @property {number} day Порядковое число дня маршрута
 */

class TripBuilder {
  constructor(geoId) {
    this.geoId = geoId;
    this.weathers = [];
    this.combo = 7;
  }
  /**
   * Метод, добавляющий условие наличия в маршруте
   * указанного количества солнечных дней
   * Согласно API Яндекс.Погоды, к солнечным дням
   * можно приравнять следующие значения `condition`:
   * * `clear`;
   * * `partly-cloudy`.
   * @param {number} daysCount количество дней
   * @returns {object} Объект планировщика маршрута
   */
  sunny(daysCount) {
    this.weathers.push(...Array(daysCount).fill('sunny'));
    return this;
  }

  /**
   * Метод, добавляющий условие наличия в маршруте
   * указанного количества пасмурных дней
   * Согласно API Яндекс.Погоды, к солнечным дням
   * можно приравнять следующие значения `condition`:
   * * `cloudy`;
   * * `overcast`.
   * @param {number} daysCount количество дней
   * @returns {object} Объект планировщика маршрута
   */
  cloudy(daysCount) {
    this.weathers.push(...Array(daysCount).fill('cloudy'));
    return this;
  }

  /**
   * Метод, добавляющий условие максимального количества дней.
   * @param {number} daysCount количество дней
   * @returns {object} Объект планировщика маршрута
   */
  max(daysCount) {
    this.combo = daysCount
    return this;
  }


  /**
   * Метод, возвращающий Promise с планируемым маршрутом.
   * @returns {Promise<TripItem[]>} Список городов маршрута
   */
  build() {
    return Promise.all(this.geoId.map(weatherById)).then(towns => {
      let mapCombo = new Map();
      let search = (used, prev) => {
        console.log(this.weathers.length, used.length)
        if (this.weathers.length === used.length) return used;
        towns.forEach(town => {
          const id = town.id
          console.log(id, used.length)
          let curDur = 0;
          if (mapCombo.has(id)) curDur = mapCombo.get(id);
          console.log(town.weather[used.length]=== this.weathers[used.length])
          if (town.weather[used.length] === this.weathers[used.length]) {
            if (curDur === 0 || id === prev && curDur < this.combo) {
              mapCombo.set(id, curDur + 1)
              let path = search(used.concat({
                geoid: id, day: used.length + 1
              }), id)
              console.log(path)
              if (path !== null) return path
              mapCombo.set(id, curDur)
            }
          }
        })
        return null;
      }
      let ans = search([], -1)
      console.log(ans)
      if (ans === null) throw new Error('Не могу построить маршрут!')
      return ans
    })
  }
}

function weatherById(geoId) {
  return fetch(`https://api.weather.yandex.ru/v2/forecast?limit=7&hours=false&geoid=${geoId}`, {
      method: 'GET',
      headers: { 'X-Yandex-API-Key': API_KEY.key }
    })
    .then(res => res.json())
    .catch(error => { throw new Error('Error Api ' + error)})
    .then(json => ({
      id: geoId,
      weather: json.forecasts.map(day => day.parts['day_short']['condition'])
        .map((weath) => {
          if (weath === 'cloudy' || weath === 'overcast')
            return 'cloudy';
          if (weath === 'clear' || weath === 'partly-cloudy')
            return 'sunny';
          return 'not';
        })
    }))
    .catch(error => { throw new Error('Error Api ' + error)})
}

/**
 * Фабрика для получения планировщика маршрута.
 * Принимает на вход список идентификаторов городов, а
 * возвращает планировщик маршрута по данным городам.
 *
 * @param {number[]} geoids Список идентификаторов городов
 * @returns {TripBuilder} Объект планировщика маршрута
 * @see https://yandex.ru/dev/xml/doc/dg/reference/regions-docpage/
 */
function planTrip(geoids) {
  return new TripBuilder(geoids);
}

module.exports = {
  planTrip
};
