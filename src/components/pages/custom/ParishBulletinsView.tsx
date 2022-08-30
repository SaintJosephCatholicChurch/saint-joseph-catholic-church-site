import Box from '@mui/material/Box';
import format from 'date-fns/format';
import { Bulletin } from '../../../interface';
import contentStyles from '../../../../public/styles/content.module.css';

interface ParishBulletinsView {
  bulletins: Bulletin[];
}

const ParishBulletinsView = ({ bulletins }: ParishBulletinsView) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }} className={contentStyles.content}>
      <h3>Parish Bulletins</h3>
      {bulletins?.map((bulletin) => (
        <p key={bulletin.date}>
          <Box component="a" href={bulletin.pdf} sx={{ fontSize: '18px', lineHeight: '18px' }}>
            <strong>
              {format(new Date(bulletin.date), 'MMM dd, yyyy')} - {bulletin.name} (PDF)
            </strong>
          </Box>
        </p>
      ))}
    </Box>
  );
};

export default ParishBulletinsView;
