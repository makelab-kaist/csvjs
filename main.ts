// deno-lint-ignore-file no-explicit-any
import { parse } from 'jsr:@std/csv@1.0.6';
import { z } from 'npm:/zod@4.1.11';

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

// Parse

/**
 * Parse a csv file
 * @param filename The csv file to parse
 * @param skipFirstRow  Whether to skip the first row (header)
 * @param separator The character used to separate values
 * @returns The parsed data
 */
export async function parseFile(
  filename: string,
  skipFirstRow: boolean = false,
  separator: string = ','
): Promise<Data> {
  const text = await Deno.readTextFile(filename);

  return parse(text, {
    skipFirstRow,
    strip: true,
    separator,
  }) as Data;
}

/**
 * Convert the data to rows
 * @param data The data to convert to rows
 * @returns The converted rows
 */
export function asRows(data: Data): Row[] {
  const [header, ...values] = data;
  const r = values.map((v) => ({ header, values: v }));
  return r;
}

/**
 * Get a row by its index
 * @param index The index of the row to get
 * @returns The row at the specified index
 */
export const getRowByIndex =
  (index: number) =>
  (rows: Row[]): Row => {
    const res = rows[index];
    if (!res) {
      throw new Error(`Row ${index} not found`);
    }
    return res;
  };

/**
 * Get the data as columns
 * @param data The data to convert to columns
 * @returns The converted columns
 */
export function asColumns(data: Data): Column[] {
  const [first, ...values] = data;
  return first.map((name, i) => ({
    header: name,
    values: values.map((v) => v[i]),
  }));
}

/**
 * Get a column by its name
 * @param name The name of the column to get
 * @returns The column with the specified name
 */
export const getColumnByName =
  (name: string) =>
  (columns: Column[]): Column => {
    const res = columns.find((c) => c.header === name);
    if (!res) {
      throw new Error(`Column ${name} not found`);
    }
    return res;
  };

// Transformations
export const floats: z.ZodTransform<number, string> = z.transform(parseFloat);
export const integers: z.ZodTransform<number, string> = z.transform(
  (str: string) => parseInt(str, 10)
);
export const booleans: z.ZodTransform<boolean, unknown> = z.transform(Boolean);
export const strings: z.ZodTransform<string, string> = z.transform(String);

/**
 * Transform the data using a zod schema
 * @param schema The zod schema to use for the transformation
 * @returns A function that takes the data and returns the transformed data
 */
export const transform =
  (schema: z.ZodTransform<any, any>) =>
  (data: RowCol): RowCol => {
    return {
      ...data,
      values: z.string().pipe(schema).array().parse(data.values),
    };
  };

/**
 * Transform the data to strings
 * @param data The data to transform
 * @returns The transformed data
 */
export function asStrings(data: RowCol): RowCol {
  return transform(strings)(data);
}

/**
 * Transform the data to numbers
 * @param data The data to transform
 * @returns The transformed data
 */
export function asNumbers(data: RowCol): RowCol {
  return transform(floats)(data);
}

/**
 * Transform the data to booleans
 * @param data The data to transform
 * @returns The transformed data
 */
export function asBooleans(data: RowCol): RowCol {
  return transform(booleans)(data);
}

/**
 * Choose the non-nullish values from the data
 * @param data The data to filter
 * @returns The filtered data
 */
export const choose = (data: RowCol): RowCol => {
  return {
    ...data,
    values: data.values.filter(
      (v) => v == v && v !== '' && v !== null && v !== undefined
    ),
  };
};

/**
 * Log the data and return it
 * @param data The data to log
 * @returns The original data
 */
export const tap = (data: RowCol): RowCol => {
  console.log(data);
  return data;
};

/**
 * Get the values of the data
 * @param data The data to get the values from
 * @returns The values of the data
 */
export const values = (data: RowCol) => data.values;

/**
 * Get the headears of the data
 * @param data The data to get the header from
 * @returns The headers of the data
 */
export const header = (data: RowCol) => data.header;
