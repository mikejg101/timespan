[![Build Status](https://img.shields.io/github/actions/workflow/status/mikejg101/timespan/publish.yml)](https://img.shields.io/github/actions/workflow/status/mikejg101/timespan/publish.yml) [![Issues Status](https://img.shields.io/github/issues/mikejg101/timespan)](https://img.shields.io/github/issues/mikejg101/timespan) [![Pull Request Status](https://img.shields.io/github/issues-pr-raw/mikejg101/timespan)](https://img.shields.io/github/issues-pr-raw/mikejg101/timespan) [![NPM Version Status](https://img.shields.io/npm/v/@undercroft/timespan)](https://img.shields.io/npm/v/@undercroft/timespan) [![License Status](https://img.shields.io/github/license/mikejg101/timespan)](https://img.shields.io/github/license/mikejg101/timespan)  


# Working with Timespans in JavaScript using the Timespan Class

When dealing with time durations or intervals in JavaScript, it's often useful to have a reliable way to represent and manipulate them. The `Timespan` class provides a convenient and powerful solution for working with timespans in JavaScript.

# Installation

```shell
npm install @undercroft/timespan
```

# Creating Timespans

To create a `Timespan` object, we can use the `fromString` method or directly instantiate it with start and end dates.

# Creating a Timespan from a String

```javascript
const { Timespan } = require('@undercroft/timespan');

const input = '3d 5h 30m'; // Example input string representing a timespan
const timespan = Timespan.fromString(input);

console.log(timespan.toString()); // Output: '3d 5h 30m'
console.log(timespan.toHours()); // Output: 77.5
```

In the example above, we create a `Timespan` object from an input string using the `fromString` method. The input string specifies a timespan of 3 days, 5 hours, and 30 minutes. We then output the string representation of the timespan using `toString()` and calculate the total duration in hours using `toHours()`.

# Creating a Timespan with Start and End Dates

```javascript
const { Timespan } = require('@undercroft/timespan');

const start = new Date('2023-01-01');
const end = new Date('2023-01-15');
const timespan = new Timespan(start, end);

console.log(timespan.toDays()); // Output: 14
```

In this example, we create a `Timespan` object by providing the start and end dates directly. We then calculate the total duration in days using `toDays()`.

# Retrieving Timespan Information

The Timespan class provides various methods to retrieve information about a timespan.

```javascript
const { Timespan } = require('@undercroft/timespan');

const start = new Date('2023-01-01');
const end = new Date('2023-01-15');
const timespan = new Timespan(start, end);

console.log(timespan.start); // Output: 2023-01-01T00:00:00.000Z
console.log(timespan.end); // Output: 2023-01-15T00:00:00.000Z
console.log(timespan.toTimeframe()); // Output: { years: 0, months: 0, weeks: 2, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }
console.log(timespan.toMilliseconds()); // Output: 1209600000
```

In the example above, we retrieve the start and end dates of the timespan using the start and end properties. We also obtain the timespan represented as a TimeFrame object using `toTimeframe()`, which provides the individual components of the timespan such as years, months, weeks, days, hours, minutes, seconds, and milliseconds. Lastly, we calculate the total duration in milliseconds using `toMilliseconds()`.

# Converting Timespans

The Timespan class provides convenient methods to convert a timespan to different units of time.

```javascript
const { Timespan } = require('@undercroft/timespan');

const start = new Date('2023-01-01');
const end = new Date('2023-01-15');
const timespan = new Timespan(start, end);

console.log(timespan.toHours()); // Output: 336
console.log(timespan.toWeeks()); // Output: 2
console.log(timespan.toMonths()); // Output: 0.4609733700642582
console.log(timespan.toYears()); // Output: 0.03841444750535485
```

In this example, we convert the timespan to various units such as hours, weeks, months, and years using the respective conversion methods.
