export enum EQueueEvent {
  EMAIL_SENDING = 'email_sending'
}

export enum EQueueJob {
  WELCOME = 'welcome',
  RESET_PASS = 'reset_pass',
  SUPPORT = 'support',
  CODE_TO_VERIFY = 'code_to_verify'
}

export interface ISendMail {
  to: string;
  subject?: string;
  context?: {
    [name: string]: any;
  };
}
