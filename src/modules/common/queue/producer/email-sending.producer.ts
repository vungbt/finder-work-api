import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { EQueueEvent, EQueueJob, ISendMail } from '../queue.type';

@Injectable()
export class EmailSendingProducer {
  constructor(@InjectQueue(EQueueEvent.EMAIL_SENDING) private readonly emailSending: Queue) {}

  async sendingWelcome(data: ISendMail) {
    const job = await this.emailSending.add(EQueueJob.WELCOME, data);
    return { jobId: job.id };
  }

  async sendingResetPassword(data: ISendMail) {
    const job = await this.emailSending.add(EQueueJob.RESET_PASS, { data });

    return { jobId: job.id };
  }

  async sendingSupport(data: ISendMail) {
    const job = await this.emailSending.add(EQueueJob.SUPPORT, { data });

    return { jobId: job.id };
  }

  async sendingCodeToVerify(data: ISendMail) {
    const job = await this.emailSending.add(EQueueJob.CODE_TO_VERIFY, { ...data });

    return { jobId: job.id };
  }
}
