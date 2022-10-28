import { styled } from '@mui/material/styles';

import HelpHeading from './HelpHeading';
import HelpHeadingLink from './HelpHeadingLink';

const StyledContent = styled('main')`
  font-size: 16px;
  line-height: 20px;
  padding-bottom: 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 8px;

  p + strong {
    margin-top: 16px;
  }

  p {
    margin: 0;
    line-height: 1.5;
  }

  ul {
    color: #313d3e;
    padding-left: 40px;
    margin: 0;
  }

  li {
    color: #313d3e;
    margin: 0;
    line-height: 1.5;
  }

  a {
    color: #bf303c;
    &:hover {
      color: #822129;
      text-decoration: underline;
      cursor: pointer;
    }
  }

  h2 {
    font-size: 36px;
    font-weight: 700;
    margin: 16px 0 0;
  }

  h3 {
    font-size: 24px;
    font-weight: 500;
    margin: 8px 0 0;
  }

  h4,
  h5,
  h6 {
    margin: 0;
  }

  h2:first-child {
    margin-top: 0;
  }

  > *:last-child {
    padding-bottom: 40px;
  }

  code {
    font-size: 85%;
    padding: 0.2em 0.4em;
    margin: 0px;
    border-radius: 3px;
    background-color: rgba(175, 184, 193, 0.2);
  }
`;

const HelpContent = () => {
  return (
    <StyledContent id="cms-help-content">
      <HelpHeading variant="h2">FAQ</HelpHeading>
      <strong>How long will it take for my changes to appear on the live site?</strong>
      <p>Changes made in the admin panel will appear on the live site within 4 to 10 minutes.</p>
      <strong>Oops I delete something I didn&apos;t want to. What do I do now?</strong>
      <p>
        The site is stored on GitHub which has built in version control (history). While you cannot bring back changes
        from the admin panel, rest assured all of the changes are saved. Reach out to your site admin for help restoring
        the lost data.
      </p>
      <HelpHeading variant="h2">Church Details</HelpHeading>
      <p>The church details covers general details about the chruch.</p>
      <HelpHeading variant="h3">General Church Details</HelpHeading>
      <p>This section includes:</p>
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
      <HelpHeading variant="h3">Mass & Confession Times</HelpHeading>
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
      <HelpHeading variant="h3">Staff</HelpHeading>
      <p>
        This section controls the{' '}
        <a href="/staff" target="_blank">
          Staff page
        </a>
        . Here you can add or remove staff members, update their titles and pictures.
      </p>
      <HelpHeading variant="h2">Homepage</HelpHeading>
      <p>
        This section controls everything you see on the homepage with the exception of the{' '}
        <HelpHeadingLink>Mass & Confession Times</HelpHeadingLink>.
      </p>
      <p>This section includes:</p>
      <ul>
        <li>
          <strong>Slides</strong> - Manages the pictures and text that rotate across the top of the homepage.
        </li>
        <li>
          <strong>Invitation Text</strong> - Text that appears directly under the rotating images/slides.
        </li>
      </ul>
      <HelpHeading variant="h3">Live Stream Button</HelpHeading>
      <p>This section controls the text and url for the Live Stream button on the homepage.</p>
      <p>This section includes:</p>
      <ul>
        <li>
          <strong>Title</strong> - The button&apos;s text.
        </li>
        <li>
          <strong>URL</strong> - The URL to send the user to when they click the button.
        </li>
      </ul>
      <HelpHeading variant="h3">Schedule Section</HelpHeading>
      <p>
        This section controls some of the aspects of the Schedule section on the homepage. The actual schedule data is
        in the <HelpHeadingLink>Mass & Confession Times</HelpHeadingLink> section.
      </p>
      <p>This section includes:</p>
      <ul>
        <li>
          <strong>Title</strong> - The title that appears directly above the schedule.
        </li>
        <li>
          <strong>Schedule Background</strong> - The image used in the background for the top sections of the homepage.
          A subtle gradient from white to light gray is placed over this image.
        </li>
      </ul>
      <HelpHeading variant="h3">Daily Readings</HelpHeading>
      <p>This section controls the Daily Readings section.</p>
      <p>This section includes:</p>
      <ul>
        <li>
          <strong>Title</strong> - The title for the section.
        </li>
        <li>
          <strong>Subtitle</strong> - The subtitle for the section (appears directly under the title)
        </li>
        <li>
          <strong>Background</strong> - The background image. It is faded and covers the{' '}
          <HelpHeadingLink>Featured Pages / Links</HelpHeadingLink> section too.
        </li>
      </ul>
      <HelpHeading variant="h3">Featured Pages / Links</HelpHeading>
      <p>This section controls the Features Pages / Links that appear on the homepage.</p>
      <strong>Featured Page</strong>
      <ul>
        <li>
          <strong>Image</strong> - Optional. Shows above page title and description
        </li>
        <li>
          <strong>Page</strong> - The page to link to, the page&apos;s title is displayed on the homepage.
        </li>
        <li>
          <strong>Summary</strong> - Optional. A brief description of the page. Appears under the title.
        </li>
      </ul>
      <strong>Featured Link</strong>
      <ul>
        <li>
          <strong>Image</strong> - Optional. Shows above title and description
        </li>
        <li>
          <strong>Title</strong> - The title to display
        </li>
        <li>
          <strong>URL</strong> - The link to send the user to if they click the feature link
        </li>
        <li>
          <strong>Summary</strong> - Optional. A brief description of the link. Appears under the title.
        </li>
      </ul>
      <HelpHeading variant="h2">Bulletins</HelpHeading>
      <p>This section controls the bulletins page of the site.</p>
      <p>This section includes:</p>
      <ul>
        <li>
          <strong>Name</strong> - This appears a subtitle under (desktop) or next to (mobile/tablet) the date. Defaults
          to <code>Bulletin</code>.
        </li>
        <li>
          <strong>Date</strong> - The bulletin&apos;s date.
        </li>
        <li>
          <strong>PDF</strong> - The PDF bulletin file.
        </li>
      </ul>
      <HelpHeading variant="h2">News Posts</HelpHeading>
      <p>This section controls the News page and all the posts that appear on it.</p>
      <p>This section includes:</p>
      <ul>
        <li>
          <strong>Title</strong> - The post&apos;s title.
        </li>
        <li>
          <strong>Image</strong> - Optional. An image to show at the top of the post.
        </li>
        <li>
          <strong>Publish Date</strong> - The date the news article was published. This is used to sort the news with the newest articles appearing at the top (and in the Recent news widget).
        </li>
        <li>
          <strong>Tags</strong> - Optional. The tags for the post. Used to group similar posts. See <HelpHeadingLink>Tags</HelpHeadingLink>
        </li>
        <li>
          <strong>Body</strong> - The content of the post.
        </li>
      </ul>
      <HelpHeading variant="h2">Bulletins</HelpHeading>
      <p>This section controls all general pages not covered by another section of the admin page.</p>
      <p>This section includes:</p>
      <ul>
        <li>
          <strong>Slug</strong> - The url path for the page. (<code>https://stjosephchurchbluffton.org/[slug]</code>)
        </li>
        <li>
          <strong>Title</strong> - The page&apos;s title.
        </li>
        <li>
          <strong>Publish Date</strong> - Not currently used, may be removed.
        </li>
        <li>
          <strong>Body</strong> - The content of the page.
        </li>
      </ul>
      <HelpHeading variant="h2">Tags</HelpHeading>
      <p>This section controls all of the tags for grouping simliar posts. You must create a tag here for it to appear in <HelpHeadingLink>News Posts</HelpHeadingLink>.</p>
    </StyledContent>
  );
};

export default HelpContent;
