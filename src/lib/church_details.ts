import details from '../../content/church_details.json';

type ChurchDetails = {
  readonly name: string;
  readonly address: string;
  readonly city: string;
  readonly state: string;
  readonly zipcode: string;
  readonly phone: string;
  readonly email: string;
  readonly mission_statement: string;
  readonly vision_statement: string;
};

export default details as ChurchDetails;
