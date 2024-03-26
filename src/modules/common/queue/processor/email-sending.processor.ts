import { Process, Processor } from '@nestjs/bull';
import { EQueueEvent, EQueueJob, ISendMail } from '../queue.type';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';

@Processor(EQueueEvent.EMAIL_SENDING)
export class EmailSendingProcessor {
  constructor(private readonly mailerService: MailerService) {}

  @Process(EQueueJob.WELCOME)
  async sendingWelcome(job: Job<ISendMail>) {
    try {
      const { data } = job;
      await this.mailerService.sendMail({
        to: data.to, // list of receivers
        subject: data?.subject ?? 'Welcome to Finder Work ✔', // Subject line
        template: 'welcome',
        context: data?.context
      });
    } catch (error) {
      throw error;
    }
  }

  @Process(EQueueJob.CODE_TO_VERIFY)
  async sendingCodeToVerify(job: Job<ISendMail>) {
    try {
      const { data } = job;
      await this.mailerService.sendMail({
        to: data.to, // list of receivers
        subject: data?.subject ?? 'Welcome to Finder Work ✔', // Subject line
        template: 'verify-code',
        context: data?.context
      });
    } catch (error) {
      throw error;
    }
  }

  @Process(EQueueJob.RESET_PASS)
  async sendingResetPassword(job: Job<ISendMail>) {
    const { data } = job;
    console.log('data=====>', data);
    // send the reset password email here
  }

  @Process(EQueueJob.SUPPORT)
  async sendingSupport(job: Job<ISendMail>) {
    const { data } = job;
    console.log('data=====>', data);
    // send the reset password email here
  }
}
