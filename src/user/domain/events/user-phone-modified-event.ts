import { DomainEvent } from 'src/common/Domain/domain-event/domain-event';
import { UserId } from '../value-objects/user-id';
import { UserPhone } from '../value-objects/user-phone';

export class UserPhoneModified extends DomainEvent {
    protected constructor(
        public userId: UserId,
        public userPhone: UserPhone,
    ) {
        super();
    }

    static create(id: UserId, phone: UserPhone) {
        return new UserPhoneModified(id, phone);
    }
}