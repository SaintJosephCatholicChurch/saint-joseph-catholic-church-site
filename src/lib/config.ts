import config from "../../content/config.json";

interface Config {
  readonly base_url: string;
  readonly site_title: string;
  readonly site_description: string;
  readonly logo: string;
  readonly site_keywords: { keyword: string }[];
  readonly posts_per_page: number;
  readonly twitter_account: string;
  readonly github_account: string;
};

export default config as Config;
