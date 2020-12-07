import sgMail from '@sendgrid/mail';
import { SG_MAIL_KEY } from '../config';

sgMail.setApiKey(SG_MAIL_KEY);

export default sgMail;
