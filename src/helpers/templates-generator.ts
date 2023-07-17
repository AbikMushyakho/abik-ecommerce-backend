import * as fs from 'fs';
import * as path from 'path';
import Handlebars from 'handlebars';

export enum MailType {
  newRegistrationOtp = 'NEW_REGISTRATION_OTP',
  // resetPasswordOtp = 'RESET_PASSWORD_OTP',
}

export interface MailTemplate {
  otp?: string;
  invitationUrl?: string;
}

export const getMailTemplates = async (
  mailType: MailType,
  data: MailTemplate,
) => {
  let source: string;

  if (mailType === MailType.newRegistrationOtp) {
    source = fs.readFileSync(
      path.join(__dirname, `../templates/newRegistration.html`),
      'utf8',
    );
  }

  const template = Handlebars.compile(source);

  //html template with data populated
  const result = template(data);

  return result;
};
