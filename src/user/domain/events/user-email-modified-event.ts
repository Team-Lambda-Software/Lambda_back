/* eslint-disable prettier/prettier */
import { DomainEvent } from 'src/common/Domain/domain-event/domain-event';

export class UserEmailModified extends DomainEvent {
    protected constructor(
        public id: string,
        public email: string,
    ) {
        super();
    }

    static create(id: string, email: string) {
        return new UserEmailModified(id, email);
    }
}