import { JetEmailSender } from "./jet-email-sender.infraestructure"

export class WelcomeSender extends JetEmailSender {

    constructor() {
        super()
        this.setSubjectText('Welcome to Gymtastic Family!')
        this.setTextPart('Greetings!')
        super.setTemplateId(5969844)
    }

    public sendEmail(emailReceiver: string, nameReceiver: string) {
        super.sendEmail(emailReceiver, nameReceiver)
    }
}