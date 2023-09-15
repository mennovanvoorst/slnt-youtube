import contentJson from "../content.json";

const regex = /{([^}]+)}/g;

export const parse = (key: string, values?: Record<string, any>): string => {
  const keys = key.split(".");
  let str = contentJson[keys[0]][keys[1]];

  if (!values)
    return str;

  const args = str.match(regex).map((arg) => arg.replace(/{|}/g, ""));

  args.forEach((arg) => {
    const reg = new RegExp(`{${arg}}`);
    str = str.replace(reg, values[arg]);
  });

  return str;
};
