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
            id,
            name,
            phone,
            email
        )
        super(id, userCreated)
    }

    protected applyEvent(event: DomainEvent): void {
        switch (event.eventName) {
            case 'UserCreated':
                const userCreated: UserCreated = event as UserCreated
                this.name = userCreated.userName
                this.phone = userCreated.userPhone
                this.email = userCreated.userEmail
                break;
            case 'UserNameModified':
                console.log("1")
                const userNameModified: UserNameModified = event as UserNameModified
                this.name = userNameModified.userName
                break;
            case 'UserPhoneModified':
                console.log("2")
                const userPhoneModified: UserPhoneModified = event as UserPhoneModified
                this.phone = userPhoneModified.userPhone
                break;
            case 'UserEmailModified':
                console.log("3")
                const userEmailModified: UserEmailModified = event as UserEmailModified
                this.email = userEmailModified.email
                break;
        }
    }

    protected ensureValidState(): void {
        if (!this.name || !this.phone || !this.email)
            throw new InvalidUser("El usuario tiene que ser valido")
    }

    get Name(): UserName {
        return this.name;
    }

    get Email(): UserEmail {
        return this.email
    }

    get Phone(): UserPhone {
        return this.phone;
    }

    public updateName(name: UserName): void {
        this.onEvent(UserNameModified.create(this.Id, name))
    }

    public updateEmail(email: UserEmail): void {
        this.onEvent(UserEmailModified.create(this.Id, email))
    }

    public updatePhone(phone: UserPhone): void {
        this.onEvent(UserPhoneModified.create(this.Id, phone))
    }

    static create(
        id: UserId,
        name: UserName,
        phone: UserPhone,
        email: UserEmail,
    ): User {
        return new User(
            id,
            name,
            phone,
            email
        );
    }
}