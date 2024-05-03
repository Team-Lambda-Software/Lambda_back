import { EmailSender } from "src/common/Application/email-sender/email-sender.application"

export class UpdatePasswordSender extends EmailSender {
    constructor() {
        super()
        this.setSubjectText('Change password gym-app')
        this.setTextPart('Greetings!')
        this.setHtmlPart('ur code is: <h2>null</h2>')
    }

    public setVariable( variable: string ){
        this.setHtmlPart( 
            `ur code is: <h2>${variable}</h2>`    
        )
    }

    public sendEmail(emailReceiver: string, nameReceiver: string): void {
        super.sendEmail(emailReceiver, nameReceiver)
    }
}