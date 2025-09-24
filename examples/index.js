import {
  Data,
  Value,
  Row,
  Column,
  RowCol,
  getData,
  columnByName,
  columns,
  rows,
  rowByIndex,
  choose,
  tap,
  floats,
  integers,
  booleans,
  strings,
  transform,
  header,
  values,
} from '@makelab/csv';

await getData('example_data.csv')
  .then(columns)
  .then(columnByName('C'))
  .then(transform(floats))
  .then(choose)
  .then(tap)
  // .then(header) // header
  .then(values) // extract the array of values
  .then(console.log);

await getData('example_data.csv')
  .then(rows)
  .then(rowByIndex(2))
  .then(tap)
  .then(choose)
  .then(values) // get the values
  .then(console.log);
