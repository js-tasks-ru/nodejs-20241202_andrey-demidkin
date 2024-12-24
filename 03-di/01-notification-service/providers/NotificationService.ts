import {Injectable} from "@nestjs/common";

@Injectable()
export class NotificationService {

  sendEmail(email:string, messageTheme: string, message: string) {
    const logMessage = `Email sent to ${email}: [${messageTheme}] ${message}`;
    console.log(logMessage)
  }

  sendSMS(phone: string, message:string) {
    const logMessage = `SMS sent to ${phone}: ${message}`;
    console.log(logMessage)
  }
}
