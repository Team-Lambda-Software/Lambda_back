
const Mailjet = require('node-mailjet')
//const key_public = process.env.MAILJET_PUBLIC_KEY
//const key_private = process.env.MAILJET_PRIVATE_KEY
const key_public = 'c439ad5be1a0205a8de4b0af41ce9a69'
const key_private = '0f5e6e38c79ce05e1f9edd40cfc94103'

export abstract class EmailSender {
    private mailjet = Mailjet.apiConnect( key_public, key_private )
    private subjectText: string
    private textPart: string
    private htmlPart: string  
    private senderEmail = process.env.SENDER_EMAIL
    private senderName = process.env.APP_NAME
    
    abstract setVariable( variable: string ): void

    public setTextPart( text: string ){
        this.textPart = text
    }
    
    public setSubjectText( text: string ){
        this.subjectText = text
    }

    public setHtmlPart( html: string ){
        this.htmlPart = html
    }

    public sendEmail( 
        emailReceiver: string, nameReceiver: string
    ): void {
        const request = this.mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [{
                From: { Email: this.senderEmail, Name: this.senderName, },
                To: [ { Email: emailReceiver, Name: nameReceiver, }, ],
                Subject: this.subjectText,
                TextPart: this.textPart,
                HTMLPart: this.htmlPart, 
            }],
          })
        .then( result => { console.log('email_sended') } )
        .catch( err => { console.log('error_in_email_sending') } )
    }
}
