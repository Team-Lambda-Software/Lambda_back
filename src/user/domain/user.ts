/* eslint-disable prettier/prettier */
import { UserName } from './value-objects/user-name';
import { UserPhone } from './value-objects/user-phone';
import { UserId } from './value-objects/user-id';
import { AggregateRoot } from 'src/common/Domain/aggregate-root/aggregate-root';
import { DomainEvent } from 'src/common/Domain/domain-event/domain-event';
import { UserCreated } from './events/user-created-event';
import { UserEmail } from './value-objects/user-email';
import { InvalidUser } from './exceptions/invalid-user';
import { UserNameModified } from './events/user-name-modified-event';
import { UserPhoneModified } from './events/user-phone-modified-event';
import { UserEmailModified } from './events/user-email-modified-event';

export class User extends AggregateRoot<UserId> {
  private name: UserName;
  private email: UserEmail;
  private phone: UserPhone;

  protected constructor(
    id: UserId,
    name: UserName,
    phone: UserPhone,
    email: UserEmail,
  ) {
    const userCreated: UserCreated = UserCreated.create(
        id.Id, 
        name.Name,
        phone.Phone, 
        email.Email
    );
    super(id, userCreated);
  }

  protected applyEvent(event: DomainEvent): void {
    switch (event.eventName) {
      case 'UserCreated':
        const userCreated: UserCreated = event as UserCreated;
        this.name = UserName.create(userCreated.userName);
        this.phone = UserPhone.create(userCreated.userPhone);
        this.email = UserEmail.create(userCreated.userEmail);
        break;
      case 'UserNameModified':
        const userNameModified: UserNameModified = event as UserNameModified;
        this.name = UserName.create(userNameModified.userName);
        break;
      case 'UserPhoneModified':
        const userPhoneModified: UserPhoneModified = event as UserPhoneModified;
        this.phone = UserPhone.create(userPhoneModified.userPhone);
        break;
      case 'UserEmailModified':
        const userEmailModified: UserEmailModified = event as UserEmailModified;
        this.email = UserEmail.create(userEmailModified.email);
        break;
    }
  }

  protected ensureValidState(): void {
    if (!this.name || !this.phone || !this.email)
      throw new InvalidUser('El usuario tiene que ser valido');
  }

  get Name(): UserName {
    return this.name;
  }

  get Email(): UserEmail {
    return this.email;
  }

  get Phone(): UserPhone {
    return this.phone;
  }

  public updateName(name: UserName): void {
    this.onEvent(UserNameModified.create(this.Id.Id, name.Name));
  }

  public updateEmail(email: UserEmail): void {
    this.onEvent(UserEmailModified.create(this.Id.Id, email.Email));
  }

  public updatePhone(phone: UserPhone): void {
    this.onEvent(UserPhoneModified.create(this.Id.Id, phone.Phone));
  }

  static create(
    id: UserId,
    name: UserName,
    phone: UserPhone,
    email: UserEmail,
  ): User {
    return new User(id, name, phone, email);
  }
}
