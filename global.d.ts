declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*.css?raw' {
  const value: string;
  export default value;
}

declare module 'lodash/escapeRegExp' {
  export default function escapeRegExp(value: string): string;
}
