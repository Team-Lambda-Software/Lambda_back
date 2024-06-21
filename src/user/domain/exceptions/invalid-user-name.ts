import { DomainException } from 'src/common/Domain/domain-exception/domain-exception';

export class InvalidUserName extends DomainException {
    constructor(msg: string) {
        super(msg);
    }
}