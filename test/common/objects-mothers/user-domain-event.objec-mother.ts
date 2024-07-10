/* eslint-disable prettier/prettier */
import { UserCreated } from "src/user/domain/events/user-created-event";
import { UserEmailModified } from "src/user/domain/events/user-email-modified-event";
import { UserNameModified } from "src/user/domain/events/user-name-modified-event";
import { UserPhoneModified } from "src/user/domain/events/user-phone-modified-event";

/* eslint-disable prettier/prettier */
export class UserDomainEventObjectMother{
    static createUserCreatedEvent(): UserCreated{
        return UserCreated.create(
            'c1b1c1b1-c1b1-c1b1-c1b1-c1b1c1b1c1b1',
            'Luigi',
            '123456789',
            'luigi@email.com',
        );
    }

    static createUserEmailModifiedEvent(): UserEmailModified{
        return UserEmailModified.create(
            'c1b1c1b1-c1b1-c1b1-c1',
            'luigi@email.com',
        )
    }

    static createUserNameModifiedEvent(): UserNameModified{
        return UserNameModified.create(
            'c1b1c1b1-c1b1-c1b1-c1',
            'Luigi',
        )
    }

    static createUserPhoneModifiedEvent(): UserPhoneModified{
        return UserPhoneModified.create(
            'c1b1c1b1-c1b1-c1b1-c1',
            '123456789',
        )
    }
}