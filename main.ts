// deno-lint-ignore-file no-explicit-any
import { parse } from 'jsr:@std/csv@1.0.6';
import { z } from 'npm:/zod@4.1.11';

export type Data = string[][];

export type Value = string | number | boolean;

export type Row = {
  header: string[];
  values: Value[];
};

export type Column = {
  header: string;
  values: Value[];
};

export type RowCol = Row | Column;

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

export const rowByIndex =
  (index: number) =>
  (rows: Row[]): Row => {
    const res = rows[index];
    if (!res) {
      throw new Error(`Row ${index} not found`);
    }
    return res;
  };

export const floats: z.ZodTransform<number, string> = z.transform(parseFloat);
export const integers: z.ZodTransform<number, string> = z.transform(
  (str: string) => parseInt(str, 10)
);
export const booleans: z.ZodTransform<boolean, unknown> = z.transform(Boolean);
export const strings: z.ZodTransform<string, string> = z.transform(String);

export const transform =
  (schema: z.ZodTransform<any, any>) =>
  (data: RowCol): RowCol => {
    return {
      ...data,
      values: z.string().pipe(schema).array().parse(data.values),
    };
  };

export const choose = (data: RowCol): RowCol => {
  return {
    ...data,
    values: data.values.filter(
      (v) => v == v && v !== '' && v !== null && v !== undefined
    ),
  };
};

export const tap = (data: RowCol): RowCol => {
  console.log(data);
  return data;
};

export const values = (data: RowCol) => data.values;

export const header = (data: RowCol) => data.header;
