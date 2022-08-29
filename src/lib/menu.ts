import data from "../../content/menu.json";

export interface MenuItem extends MenuLink {
  menu_links?: MenuLink[];
}

export interface MenuLink {
  readonly title: string
  readonly url?: string;
  readonly page?: string;
};

export default data.menu_items as MenuItem[];
