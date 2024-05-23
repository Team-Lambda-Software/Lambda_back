import { IEmailSender } from "src/common/Application/email-sender/email-sender.interface.application"

const Mailjet = require('node-mailjet')

export abstract class JetEmailSender implements IEmailSender {
    private subjectText: string
    private textPart: string
    private senderEmail = process.env.SENDER_EMAIL
    private senderName = process.env.APP_NAME
    private mailjet = null
    private templateId = 5969844
    private variables = {}

    constructor() {
        const key_public = process.env.MAILJET_PUBLIC_KEY
        const key_private = process.env.MAILJET_PRIVATE_KEY
        this.mailjet = Mailjet.apiConnect( key_public, key_private )
    }

    public setVariables( variables: any ) {
        this.variables = variables
    }

    public setTextPart( text: string ){
        this.textPart = text
    }
    
    public setTemplateId( templateId: number ){
        this.templateId = templateId
    }

    public setSubjectText( text: string ){
        this.subjectText = text
    }

    public sendEmail( 
        emailReceiver: string, nameReceiver: string
    ){
        const request = this.mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [{
                From: { Email: this.senderEmail, Name: this.senderName, },
                To: [ { Email: emailReceiver, Name: nameReceiver, }, ],
                TemplateID: this.templateId,
                Subject: this.subjectText,
                TextPart: this.textPart,
                Variables: this.variables,
                TemplateLanguage: true,
            }],
          })
        .then( result => { console.log('email_sended') })
        .catch( err => { console.log('error_in_email_sending') })

    }
}
