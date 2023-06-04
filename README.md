# Working with Timespans in JavaScript using the Timespan Class

When dealing with time durations or intervals in JavaScript, it's often useful to have a reliable way to represent and manipulate them. The `Timespan` class provides a convenient and powerful solution for working with timespans in JavaScript.

[![Build Status](https://img.shields.io/github/actions/workflow/status/mikejg101/timespan/publish.yml)](https://img.shields.io/github/actions/workflow/status/mikejg101/timespan/publish.yml) [![Issues Status](https://img.shields.io/github/issues/mikejg101/timespan)](https://img.shields.io/github/issues/mikejg101/timespan) [![Pull Request Status](https://img.shields.io/github/issues-pr-raw/mikejg101/timespan)](https://img.shields.io/github/issues-pr-raw/mikejg101/timespan) [![NPM Version Status](https://img.shields.io/npm/v/@undercroft/timespan)](https://img.shields.io/npm/v/@undercroft/timespan) [![License Status](https://img.shields.io/github/license/mikejg101/timespan)](https://img.shields.io/github/license/mikejg101/timespan)  

# Installation

```shell
npm install @undercroft/timespan
```

Usage
To use the Timespan class in your JavaScript project, import it as follows:

```javascript
import { Timespan } from '@undercroft/timespan';
```

# Creating Timespans

To create a `Timespan` object, we can use the `fromString` method or directly instantiate it with start and end dates.

# Creating a Timespan from a String

```javascript
import { Timespan } from '@undercroft/timespan';

const input = '3d 5h 30m'; // Example input string representing a timespan
const timespan = Timespan.fromString(input);

console.log(timespan.toString()); // Output: '3d 5h 30m'
console.log(timespan.toHours()); // Output: 77.5
```

In the example above, we create a `Timespan` object from an input string using the `fromString` method. The input string specifies a timespan of 3 days, 5 hours, and 30 minutes. We then output the string representation of the timespan using `toString()` and calculate the total duration in hours using `toHours()`.

# Creating a Timespan with Start and End Dates

```javascript
import { Timespan } from '@undercroft/timespan';

const start = new Date('2023-01-01');
const end = new Date('2023-01-15');
const timespan = new Timespan(start, end);

console.log(timespan.toDays()); // Output: 14
```

In this example, we create a `Timespan` object by providing the start and end dates directly. We then calculate the total duration in days using `toDays()`.

# Retrieving Timespan Information

The Timespan class provides various methods to retrieve information about a timespan.

```js
import { Timespan } from '@undercroft/timespan';

const start = new Date('2023-01-01');
const end = new Date('2023-01-15');
const timespan = new Timespan(start, end);

// Output: 2023-01-01T00:00:00.000Z
console.log(timespan.start);

// Output: 2023-01-15T00:00:00.000Z
console.log(timespan.end);

// Output: { years: 0, months: 0, weeks: 2, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }
console.log(timespan.toTimeframe());

// Output: 1209600000
console.log(timespan.toMilliseconds());
```

In the example above, we retrieve the start and end dates of the timespan using the start and end properties. We also obtain the timespan represented as a TimeFrame object using `toTimeframe()`, which provides the individual components of the timespan such as years, months, weeks, days, hours, minutes, seconds, and milliseconds. Lastly, we calculate the total duration in milliseconds using `toMilliseconds()`.

# Converting Timespans

The Timespan class provides convenient methods to convert a timespan to different units of time.

```js
import { Timespan } from '@undercroft/timespan';

const start = new Date('2023-01-01');
const end = new Date('2023-01-15');
const timespan = new Timespan(start, end);

console.log(timespan.toHours()); // Output: 336
console.log(timespan.toWeeks()); // Output: 2
console.log(timespan.toMonths()); // Output: 0
console.log(timespan.toYears()); // Output: 0
```

In this example, we convert the timespan to various units such as hours, weeks, months, and years using the respective conversion methods.

# More Examples of Creating TimeSpans

You can create a Timespan object using the static methods provided by the class. Here are the available methods:

Timespan.fromMilliseconds(milliseconds: number, startDate?: Date): Timespan
Creates a Timespan object from a specified number of milliseconds.

```js
import { Timespan } from '@undercroft/timespan';

const timespan = Timespan.fromMilliseconds(5000);
Timespan.fromSeconds(seconds, startDate);
```
Creates a Timespan object from a specified number of seconds.

```js
import { Timespan } from '@undercroft/timespan';

const timespan = Timespan.fromSeconds(120);
Timespan.fromMinutes(minutes, startDate);
```
Creates a Timespan object from a specified number of minutes.

```js
import { Timespan } from '@undercroft/timespan';

const timespan = Timespan.fromMinutes(60);
Timespan.fromHours(hours, startDate);
```
Creates a Timespan object from a specified number of hours.

```js
import { Timespan } from '@undercroft/timespan';

const timespan = Timespan.fromHours(24);
Timespan.fromDays(days, startDate);
```
Creates a Timespan object from a specified number of days.

```js
import { Timespan } from '@undercroft/timespan';

const timespan = Timespan.fromDays(7);
Timespan.fromWeeks(weeks, startDate);
```
Creates a Timespan object from a specified number of weeks.

```js
import { Timespan } from '@undercroft/timespan';

const timespan = Timespan.fromWeeks(4);
Timespan.fromMonths(months, startDate);
```
Creates a Timespan object from a specified number of months.

```js
import { Timespan } from '@undercroft/timespan';

const timespan = Timespan.fromMonths(6);
Timespan.fromYears(years, startDate);
```
Creates a Timespan object from a specified number of years.

```js
import { Timespan } from '@undercroft/timespan';

const timespan = Timespan.fromYears(2);
```
Performing Calculations and Comparisons
Once you have a Timespan object, you can perform various calculations and comparisons using the provided methods. Here are some examples:

```js
import { Timespan } from '@undercroft/timespan';

const timespan1 = Timespan.fromHours(12);
const timespan2 = Timespan.fromDays(2);

const addedTimespan = timespan1.add(timespan2);
const subtractedTimespan = timespan2.subtract(timespan1);
const areEqual = timespan1.equals(timespan2);
const comparisonResult = timespan1.compareTo(timespan2);
```
Please refer to the API documentation, or the source code for more details on the available methods and their usage.

## Contributing
Contributions to the Timespan class are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the GitHub repository.

## License
The Timespan class is licensed under the MIT License. See the LICENSE file for more information.
