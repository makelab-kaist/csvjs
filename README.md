# make::lab csv utilities

Make it easy to parse CSV files, extract columns and rows, and transform the data to numbers, strings, or booleans.

## Usage

### Parse the CSV file

You can extract columns or rows.

```js
import {
  parseFile,
  getColumnByName,
  getRowByIndex,
  asRows,
  asColumns,
} from '@makelab/csv';

// Rows
const cols = parseFile('example_data.csv').then(asColumns);

const colA = cols.then(getColumnByName('A'));

const row0 = await parseFile('example_data.csv')
  .then(asRows)
  .then(getRowByIndex(0));
```

### Transforming data

You can now convert the data in the columns/rows to number, strings (default) or booleans

```js
import { choose, asNumbers, header, values, asBooleans } from '@makelab/csv';

const colA = await cols.then(getColumnByName('A')).then(asNumbers).then(choose);
const colB = await cols.then(getColumnByName('B')).then(choose);
const colC = await cols
  .then(getColumnByName('C'))
  .then(asBooleans)
  .then(choose);
```

### Extract data

You can extract headers and values from rows and co,umns

```js
console.log('--- COLUMNS ---');
console.log(`Column ${colA.header} (as numbers):`, values(colA));
console.log(`Column ${colB.header} (as strings):`, values(colB));
console.log(`Column ${colC.header} (as booleans):`, values(colC));

// Rows
console.log('--- ROWS ---');
await parseFile('example_data.csv')
  .then(asRows)
  .then(getRowByIndex(0))
  .then(header) // get the header
  .then((s) => s.join(', ')) // join as string
  .then((s) => `All headers: ${s}`) // format
  .then(console.log);
```

## Example

See a [complete example](./examples/example.js) here.

## Credits

Made with ♥️ by [MAKinteract](https://make.kaist.ac.kr)
