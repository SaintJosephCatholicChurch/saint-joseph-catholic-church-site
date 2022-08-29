import config from "../../content/styles.json";

type StylesConfig = {
  readonly header_background: string;
  readonly header_color: string;
  readonly header_font_style: 'normal' | 'italic';
  readonly footer_background: string;
};

export default config as StylesConfig;
