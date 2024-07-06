/* eslint-disable prettier/prettier */
import { DomainEvent } from 'src/common/Domain/domain-event/domain-event';


export class UserCreated extends DomainEvent {
    protected constructor(
        public userId: string,
        public userName: string,
        public userPhone: string,
        public userEmail: string,
    ) {
        super();
    }

    public static create(
        userId: string,
        userName: string,
        userPhone: string,
        userEmail: string
    ): UserCreated {
        return new UserCreated(
            userId,
            userName,
            userPhone,
            userEmail,
        );
    }
}