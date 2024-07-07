/* eslint-disable prettier/prettier */
import { DomainEvent } from 'src/common/Domain/domain-event/domain-event';

export class UserNameModified extends DomainEvent {
    protected constructor(
        public userId: string,
        public userName: string,
    ) {
        super();
    }

    static create(id: string, name: string) {
        return new UserNameModified(id, name);
    }
}