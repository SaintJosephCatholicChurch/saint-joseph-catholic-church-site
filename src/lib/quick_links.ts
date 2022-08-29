import data from '../../content/quick_links.json';

type QuickLink = {
  readonly title: string;
  readonly subtitle?: string;
  readonly url: string;
  readonly background: string;
};

export default data.quick_links as QuickLink[];
