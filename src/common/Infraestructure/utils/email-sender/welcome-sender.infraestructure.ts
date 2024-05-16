import { EmailSender } from "src/common/Application/email-sender/email-sender.application"

export class WelcomeSender extends EmailSender {

    constructor() {
        super()
        this.setSubjectText('Welcome to Gymtastic Family!')
        this.setTextPart('Greetings!')
        super.setTemplateId(5969844)
    }

    public sendEmail(emailReceiver: string, nameReceiver: string): void {
        super.sendEmail(emailReceiver, nameReceiver)
    }
}