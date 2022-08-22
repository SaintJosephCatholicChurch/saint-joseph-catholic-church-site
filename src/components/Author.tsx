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
      <style jsx>
        {`
          span {
            color: #9b9b9b;
          }
        `}
      </style>
    </>
  );
}
