
const Mailjet = require('node-mailjet')
const key_public = 'c439ad5be1a0205a8de4b0af41ce9a69'
const key_private = '0f5e6e38c79ce05e1f9edd40cfc94103'

export abstract class EmailSender {
    mailjet = Mailjet.apiConnect( key_public, key_private )
    subjectText: string
    textPart: string
    htmlPart: string  
    senderEmail = 'hfchiang.21@est.ucab.edu.ve'
    senderName = 'gymtastic'
    
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
        .then( result => { console.log('result') } )
        .catch( err => { console.log('error') } )
    }
}
