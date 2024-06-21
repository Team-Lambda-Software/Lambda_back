import { DomainEvent } from 'src/common/Domain/domain-event/domain-event';
import { UserId } from '../value-objects/user-id';
import { UserName } from '../value-objects/user-name';
import { UserPhone } from '../value-objects/user-phone';
import { UserEmail } from '../value-objects/user-email';

export class UserCreated extends DomainEvent {
    protected constructor(
        public userId: UserId,
        public userName: UserName,
        public userPhone: UserPhone,
        public userEmail: UserEmail,
    ) {
        super();
    }

    public static create(
        userId: UserId,
        userName: UserName,
        userPhone: UserPhone,
        userEmail: UserEmail
    ): UserCreated {
        return new UserCreated(
            userId,
            userName,
            userPhone,
            userEmail,
        );
    }
}