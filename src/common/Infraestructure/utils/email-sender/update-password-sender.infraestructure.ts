import { EmailSender } from "src/common/Application/email-sender/email-sender.application"

export class UpdatePasswordSender extends EmailSender {

    constructor() {
        super()
        this.setSubjectText('Change password Gymtastic-App')
        this.setTextPart('Greetings!')
        super.setTemplateId(5969894)
    }

    public sendEmail(emailReceiver: string, nameReceiver: string): void {
        super.sendEmail(emailReceiver, nameReceiver)
    }
}