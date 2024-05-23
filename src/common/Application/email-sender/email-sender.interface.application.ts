
export interface IEmailSender {
    setVariables( variables: any ): void
    sendEmail(emailReceiver: string, nameReceiver: string): void
}