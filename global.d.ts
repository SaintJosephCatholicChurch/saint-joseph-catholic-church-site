declare module '*.svg' {
  import type { FunctionComponent, SVGProps } from 'react';

  export const ReactComponent: FunctionComponent<SVGProps<SVGSVGElement>>;

  export default ReactComponent;
}

declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*.yml' {
  const value: any;
  export default value;
}

declare module '!!raw-loader!*.css' {
  const value: string;
  export default value;
}
