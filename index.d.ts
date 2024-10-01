import { HTMLAttributes } from "react";

declare module '@animxyz/react' {
}

namespace React {
  interface SVGProps<T> extends SVGAttributes<T>, ClassAttributes<T> {
    xyz?: string;
  }
  
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    xyz?: string;
  }
}
