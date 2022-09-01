import { styled as muiStyled } from '@mui/material/styles';

function styled<Tag extends keyof JSX.IntrinsicElements>(
  componentOrTag: Tag,
  propsToIgnore?: string[]
): ReturnType<typeof muiStyled> {
  const options = propsToIgnore?.length
    ? {
        shouldForwardProp: (prop) => !propsToIgnore.includes(prop)
      }
    : {};

  return muiStyled(componentOrTag, options);
}

export default styled;
