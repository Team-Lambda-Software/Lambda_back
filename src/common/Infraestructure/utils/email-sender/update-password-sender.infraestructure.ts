import { JetEmailSender } from "./jet-email-sender.infraestructure"

export class UpdatePasswordSender extends JetEmailSender {

    constructor() {
        super()
        this.setSubjectText('Change password Gymtastic-App')
        this.setTextPart('Greetings!')
        super.setTemplateId(5969894)
    }

    public sendEmail(emailReceiver: string, nameReceiver: string) {
        super.sendEmail(emailReceiver, nameReceiver)
    }
}