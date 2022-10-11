import { styled } from '@mui/material/styles';

const StyledContent = styled('main')`
  font-size: 16px;
  line-height: 20px;

  p {
    margin: 16px 0 24px;
  }

  li {
    margin: 6px 0;
  }

  a {
    color: #bf303c;
    &:hover {
      color: #822129;
      text-decoration: underline;
      cursor: pointer;
    }
  }
`;

const HelpContent = () => {
  const DummyText =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

  return (
    <StyledContent id="cms-help-content">
      <h2 id="faq">FAQ</h2>
      <strong>How long will it take for my changes to appear on the live site?</strong>
      <p>Changes made in the admin panel will appear on the live site within 4 to 10 minutes.</p>
      <strong>Oops I delete something I didn&apos;t want to. What do I do now?</strong>
      <p>
        The site is stored on GitHub which has built in version control (history). While you cannot bring back changes
        from the admin panel, rest assured all of the changes are saved. Reach out to your site admin for help restoring
        the lost data.
      </p>
      <h2 id="church-details">Church Details</h2>
      <p>The church details covers general details about the chruch.</p>
      <h3 id="general-church-details">General Church Details</h3>
      <p>
        This section includes:
        <ul>
          <li>
            <strong>Church Name</strong> - Displayed in the site footer and on the Contact page
          </li>
          <li>
            <strong>Address</strong> - Displayed in the site footer and on the Contact page
          </li>
          <li>
            <strong>Phone Number</strong> - Displayed in the site footer and on the Contact page
          </li>
          <li>
            <strong>Additional Phone Numbers</strong> - Only displayed on the Contact page
          </li>
          <li>
            <strong>Email</strong> - Displayed in the site footer and on the Contact page
          </li>
          <li>
            <strong>Additional Emails</strong> - Only displayed on the Contact page
          </li>
          <li>
            <strong>Contacts</strong> - Only displayed on the Contact page
          </li>
          <li>
            <strong>Facebook Page</strong> - Displayed in the site footer and on the Contact page. Also controls which
            facebook page appears on the live stream page.
          </li>
          <li>
            <strong>Google Map Embed URL</strong> - The url of the map to load on the Contact page
          </li>
          <li>
            <strong>Online Giving URL</strong> - The url for the Give button
          </li>
          <li>
            <strong>Mission Statement</strong> - Displayed in the site footer
          </li>
          <li>
            <strong>Vision Statement</strong> - Displayed in the site footer
          </li>
        </ul>
      </p>
      <h3 id="mass-confession-times">Mass & Confession Times</h3>
      <p>
        This section controls the mass times widget on homepage and the{' '}
        <a href="/mass-confession-times" target="_blank">
          Mass & Confession Times page
        </a>
        .
      </p>
      <p>
        While meant for mass and confession times you can really add anything with a regular day and time in this
        section. Other examples already in are Adoration Times, Stations of the Cross and Parish Office Hours.
      </p>
      <h3 id="staff">Staff</h3>
      <p>
        This section controls the{' '}
        <a href="/staff" target="_blank">
          Staff page
        </a>
        . Here you can add or remove staff members, update their titles and pictures.
      </p>
      <h2 id="hompeage">Homepage</h2>
      <p>
        This section controls everything you see on the homepage with the exception of the Mass & Confession Times
        (which are controlled in <a href="#mass-confession-times">Church Details &gt; Mass & Confession Times</a>.
      </p>
      <p>
        This section includes:
        <ul>
          <li>
            <strong>Slides</strong> - Manages the pictures and text that rotate across the top of the homepage.
          </li>
          <li>
            <strong>Invitation Text</strong> - Text that appears directly under the rotating images/slides.
          </li>
        </ul>
      </p>
      <h3 id="third-header">Third header</h3>
      <p>{DummyText}</p>
      <p>{DummyText}</p>
      <h2 id="fourth-header">Fourth header</h2>
      <p>{DummyText}</p>
      <p>{DummyText}</p>
      <p>{DummyText}</p>
      <p>{DummyText}</p>
      <h3 id="fifth-header">Fifth header</h3>
      <p>{DummyText}</p>
      <p>{DummyText}</p>
    </StyledContent>
  );
};

export default HelpContent;
