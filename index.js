'use strict';

var Moment = require('moment');
var iMoment = require('moment-hijri');
var extendMoment = require('moment-range').extendMoment;

var moment = extendMoment(Moment);
var arWeekDays = {
  weekdays : 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
  weekdaysShort : 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
  weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_')
}
moment.updateLocale('ar-sa', arWeekDays);
var symbolMap = {
  1: '۱',
  2: '۲',
  3: '۳',
  4: '٤',
  5: '۵',
  6: '٦',
  7: '۷',
  8: '۸',
  9: '۹',
  0: '۰',
};

function parse(value, format) {
  return iMoment(value, format);
}

function toIMoment(date) {
  return iMoment(date ? date.clone() : undefined);
}

var Utils = function utils() { };

Utils.prototype.toIMoment = toIMoment;

Utils.prototype.date = Utils.prototype.parse = parse;

Utils.prototype.isValid = function isValid(date) {
  return date.isValid();
};

Utils.prototype.isNull = function isNull(date) {
  return date.parsingFlags().nullInput;
};

Utils.prototype.isEqual = function isEqual(value, comparing) {
  return parse(value).isSame(comparing);
};

Utils.prototype.isAfter = function isAfter(date, value) {
  return date.isAfter(value);
};

Utils.prototype.isBefore = function isBefore(date, value) {
  return date.isBefore(value);
};

Utils.prototype.isAfterDay = function isAfterDay(date, value) {
  return date.isAfter(value, 'day');
};

Utils.prototype.isBeforeDay = function isBeforeDay(date, value) {
  return date.isBefore(value, 'day');
};

Utils.prototype.isBeforeYear = function isBeforeYear(date, value) {
  return date.iYear() < value.iYear();
};

Utils.prototype.isAfterYear = function isAfterYear(date, value) {
  return date.iYear() > value.iYear();
};

Utils.prototype.startOfDay = function startOfDay(date) {
  return date.startOf('day');
};

Utils.prototype.endOfDay = function endOfDay(date) {
  return date.endOf('day');
};

Utils.prototype.format = function format(date, formatString) {
  return date.format(formatString);
};

Utils.prototype.formatNumber = function formatNumber(num) {
  return (num || '').replace(/\d/g, function (match) {
    return symbolMap[match];
  }).replace(/,/g, '،');
};

Utils.prototype.getMeridiemText = function getMeridiemText(ampm) {
  return ampm === 'am' ? toIMoment().hours(2).format('A') : toIMoment().hours(14).format('A');
};

Utils.prototype.addDays = function addDays(date, count) {
  return count < 0 ? date.clone().subtract(Math.abs(count), 'days') : date.clone().add(count, 'days');
};

Utils.prototype.isSameDay = function isSameDay(date, comparing) {
  return date.isSame(comparing, 'day');
};

Utils.prototype.getHours = function getHours(date) {
  return date.get('hours');
};

Utils.prototype.setHours = function setHours(date, value) {
  return date.clone().hours(value);
};

Utils.prototype.getMinutes = function getMinutes(date) {
  return date.get('minutes');
};

Utils.prototype.setMinutes = function setMinutes(date, value) {
  return date.clone().minutes(value);
};

Utils.prototype.getMonth = function getMonth(date) {
  return date.iMonth();
};

Utils.prototype.getStartOfMonth = function getStartOfMonth(date) {
  return date.clone().startOf('iMonth');
};

Utils.prototype.getNextMonth = function getNextMonth(date) {
  return date.clone().add(1, 'iMonth');
};

Utils.prototype.getPreviousMonth = function getPreviousMonth(date) {
  return date.clone().subtract(1, 'iMonth');
};

Utils.prototype.getYear = function getYear(date) {
  return date.iYear();
};

Utils.prototype.setYear = function setYear(date, year) {
  return date.clone().iYear(year);
};

Utils.prototype.mergeDateAndTime = function mergeDateAndTime(date, time) {
    return this.setMinutes(this.setHours(date, this.getHours(time)), this.getMinutes(time));
};

Utils.prototype.getDiff = function getDiff(date, comparing) {
  return date.diff(comparing);
}

Utils.prototype.getWeekdays = function getWeekdays() {
  return [0, 1, 2, 3, 4, 5, 6].map(function (dayOfWeek) {
    return toIMoment().weekday(dayOfWeek).format('dd');
  });
};

Utils.prototype.getWeekArray = function getWeekArray(date) {
  var start = toIMoment(date).startOf('iMonth').startOf('week');
  var end = toIMoment(date).endOf('iMonth').endOf('week');

  var weeks = Array.from(moment.range(start, end).by('week'));

  var nestedWeeks = [];

  weeks.forEach(function (week) {
    var end = week.clone().endOf('week');
    nestedWeeks.push(Array.from(moment.range(week, end).by('day')).map(toIMoment));
  });

  return nestedWeeks;
};

Utils.prototype.getYearRange = function getYearRange(start, end) {
  var startDate = parse(start);
  var endDate = parse(end);
  var years = [];

  var current = startDate;
  while (current.isBefore(endDate)) {
    years.push(current);
    current = current.clone().add(1, 'iYear');
  }

  return years;
};

Utils.prototype.getCalendarHeaderText = function getCalendarHeaderText(date) {
  return date.format('iMMMM iYYYY');
};

Utils.prototype.getYearText = function getYearText(date) {
  return date.format('iYYYY');
};

Utils.prototype.getDatePickerHeaderText = function getDatePickerHeaderText(date) {
  return date.format('ddd, iMMM iD');
};

Utils.prototype.getDateTimePickerHeaderText = function getDateTimePickerHeaderText(date) {
  return date.format('iMMM iD');
};

Utils.prototype.getDayText = function getDayText(date) {
  return date.format('iD');
};

Utils.prototype.getHourText = function getHourText(date, ampm) {
  return date.format(ampm ? 'hh' : 'HH');
};

Utils.prototype.getMinuteText = function getMinuteText(date) {
  return date.format('mm');
};

Utils['default'] = Utils;

module.exports = Utils;
