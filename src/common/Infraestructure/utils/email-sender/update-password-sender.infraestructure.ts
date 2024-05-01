import { EmailSender } from "src/common/Application/email-sender/email-sender.application"

export class UpdatePasswordSender extends EmailSender {
    constructor() {
        super()
        this.subjectText = 'Change password gym-app'
        this.textPart = 'Greetings!'
        this.htmlPart = 'ur code is: <h2>A4Ax12F</h2>'
    }

    public sendEmail(emailReceiver: string, nameReceiver: string): void {
        super.sendEmail(emailReceiver, nameReceiver)
    }
}