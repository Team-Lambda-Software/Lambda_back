import { IValueObject } from 'src/common/Domain/value-object/value-object.interface';
import { InvalidUserPhone } from '../exceptions/invalid-user-phone';

export class UserPhone implements IValueObject<UserPhone> {
    private readonly phone: string;

    protected constructor(phone: string) {
        let _existente: boolean = true;

        if (!phone) _existente = false;

        if (!_existente)
            throw new InvalidUserPhone('El telefono no puede estar vacío');

        if (phone.length < 11 || phone.length > 11) {
            throw new InvalidUserPhone(`El telefono ${phone} debe tener 11 digitos`);
        }

        this.phone = phone;
    }

    get Phone(): string {
        return this.Phone;
    }

    equals(valueObject: UserPhone): boolean {
        return this.phone == valueObject.Phone;
    }

    static create(phone: string) {
        return new UserPhone(phone);
    }
}