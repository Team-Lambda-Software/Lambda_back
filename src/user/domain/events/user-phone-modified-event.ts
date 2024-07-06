import { DomainEvent } from 'src/common/Domain/domain-event/domain-event';

export class UserPhoneModified extends DomainEvent {
    protected constructor(
        public userId: string,
        public userPhone: string,
    ) {
        super();
    }

    static create(id: string, phone: string) {
        return new UserPhoneModified(id, phone);
    }
}