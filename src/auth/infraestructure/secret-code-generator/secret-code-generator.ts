import { ICodeGenerator } from "src/auth/application/interface/code-generator.interface";

export class SecretCodeGenerator implements ICodeGenerator<number[]> {
    generateCode(len: number): number[] {
        let code = []
        code.push( Math.floor(Math.random() * 9) )
        code.push( Math.floor(Math.random() * 9) )
        code.push( Math.floor(Math.random() * 9) )
        code.push( Math.floor(Math.random() * 9) )
        return code
    }
}