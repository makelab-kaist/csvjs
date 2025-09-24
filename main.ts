// deno-lint-ignore-file no-explicit-any
import { parse } from 'jsr:@std/csv';
import { z } from 'npm:zod';

type Data = string[][];

type Value = string | number | boolean;

type Row = {
  header: string[];
  values: Value[];
};

type Column = {
  header: string;
  values: Value[];
};

type RowCol = Row | Column;

export async function getData(filename: string): Promise<Data> {
  const text = await Deno.readTextFile(filename);

  return parse(text, {
    skipFirstRow: false,
    strip: true,
  });
}

export function rows(data: Data): Row[] {
  const [header, ...values] = data;
  const r = values.map((v) => ({ header, values: v }));
  return r;
}

export function columns(data: Data): Column[] {
  const [first, ...values] = data;
  return first.map((name, i) => ({
    header: name,
    values: values.map((v) => v[i]),
  }));
}

export const columnByName =
  (name: string) =>
  (columns: Column[]): Column => {
    const res = columns.find((c) => c.header === name);
    if (!res) {
      throw new Error(`Column ${name} not found`);
    }
    return res;
  };

export const getRowByIndex =
  (index: number) =>
  (rows: Row[]): Row => {
    const res = rows[index];
    if (!res) {
      throw new Error(`Row ${index} not found`);
    }
    return res;
  };

export const floats = z.transform(parseFloat);
export const integers = z.transform((str: string) => parseInt(str, 10));
export const booleans = z.transform(Boolean);
export const strings = z.transform(String);

export const transform =
  (schema: z.ZodTransform<any, any>) =>
  (data: RowCol): RowCol => {
    return {
      ...data,
      values: z.string().pipe(schema).array().parse(data.values),
    };
  };

const choose = (data: RowCol) => {
  return {
    ...data,
    values: data.values.filter(
      (v) => v == v && v !== '' && v !== null && v !== undefined
    ),
  };
};

const tap = (data: RowCol) => {
  console.log(data);
  return data;
};

export const values = (data: RowCol) => data.values;

export const header = (data: RowCol) => data.header;

await getData('data1.csv') //
  .then(columns)
  .then(columnByName('Test1'))
  .then(transform(floats))
  .then(choose)
  .then(tap)
  // .then(header)
  .then(values)
  .then(console.log);

await getData('data1.csv') //
  .then(rows)
  .then(getRowByIndex(2))
  // .then(tap)
  .then(choose)
  // .then(header)
  .then(values)
  .then(console.log);

// console.log(d);
