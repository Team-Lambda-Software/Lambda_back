import { DomainEvent } from 'src/common/Domain/domain-event/domain-event';
import { UserEmail } from '../value-objects/user-email';
import { UserId } from '../value-objects/user-id';

export class UserEmailModified extends DomainEvent {
  protected constructor(
    public id: UserId,
    public email: UserEmail,
  ) {
    super();
  }

  static create(id: UserId, email: UserEmail) {
    return new UserEmailModified(id, email);
  }
}
