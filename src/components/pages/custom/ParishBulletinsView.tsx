import format from 'date-fns/format';
import contentStyles from '../../../../public/styles/content.module.css';
import { Bulletin } from '../../../interface';
import styled from '../../../util/styled.util';

const StyledParishBulletinsView = styled('div')`
  display: flex;
  flex-direction: column;
`;

const StyledBulletinLink = styled('a')`
  font-size: 18px;
  line-height: 18px;
`;

interface ParishBulletinsView {
  bulletins: Bulletin[];
}

const ParishBulletinsView = ({ bulletins }: ParishBulletinsView) => {
  return (
    <StyledParishBulletinsView className={contentStyles.content}>
      <h3>Parish Bulletins</h3>
      {bulletins?.map((bulletin) => (
        <p key={bulletin.date}>
          <StyledBulletinLink href={bulletin.pdf}>
            <strong>
              {format(new Date(bulletin.date), 'MMM dd, yyyy')} - {bulletin.name} (PDF)
            </strong>
          </StyledBulletinLink>
        </p>
      ))}
    </StyledParishBulletinsView>
  );
};

export default ParishBulletinsView;
