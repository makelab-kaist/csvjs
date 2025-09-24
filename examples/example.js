import {
  parseFile,
  getColumnByName,
  getRowByIndex,
  asRows,
  asColumns,
  choose,
  asNumbers,
  header,
  values,
  asBooleans,
} from '@makelab/csv';

// Rows
const cols = parseFile('example_data.csv').then(asColumns);

const colA = await cols.then(getColumnByName('A')).then(asNumbers).then(choose);

const colB = await cols.then(getColumnByName('B')).then(choose);
const colC = await cols
  .then(getColumnByName('C'))
  .then(asBooleans)
  .then(choose);

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
