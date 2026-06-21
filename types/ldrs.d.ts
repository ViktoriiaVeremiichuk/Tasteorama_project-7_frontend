declare namespace JSX {
  interface IntrinsicElements {
    "l-hatch": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      size?: string;
      stroke?: string;
      speed?: string;
      color?: string;
    };
  }
}