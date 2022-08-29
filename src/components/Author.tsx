import { AuthorContent } from "../lib/authors";

type Props = {
  author?: AuthorContent;
};
export default function Author({ author }: Props) {
  if (!author) {
    return null;
  }

  return (
    <>
      <span>{author.name}</span>
    </>
  );
}
