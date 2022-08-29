import Box from '@mui/material/Box';
import GitHub from '../../../assets/github-alt.svg';
import Twitter from '../../../assets/twitter-alt.svg';
import config from '../../../lib/config';

const SocialList = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <a
        title="Twitter"
        href={`https://twitter.com/${config.twitter_account}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Twitter width={24} height={24} fill={'#222'} />
      </a>
      <a title="GitHub" href={`https://github.com/${config.github_account}`} target="_blank" rel="noopener noreferrer">
        <GitHub width={24} height={24} fill={'#222'} />
      </a>
    </Box>
  );
};

export default SocialList;
