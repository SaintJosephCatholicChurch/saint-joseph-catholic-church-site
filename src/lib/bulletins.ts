import details from "../../content/bulletins.json";

type Bulletin = {
  readonly name: string;
  readonly date: string;
  readonly pdf: string;
};

export default details.bulletins as Bulletin[];
