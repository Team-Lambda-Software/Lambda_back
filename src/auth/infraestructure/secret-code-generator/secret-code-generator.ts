import { ICodeGenerator } from "src/auth/application/interface/code-generator.interface";

export class SecretCodeGenerator implements ICodeGenerator<string> {
    generateCode(len: number): string {
        let arr = []
        arr.push( Math.floor(Math.random() * 9) )
        arr.push( Math.floor(Math.random() * 9) )
        arr.push( Math.floor(Math.random() * 9) )
        arr.push( Math.floor(Math.random() * 9) )
        var code = arr[0].toString() + arr[1].toString() + arr[2].toString() + arr[3].toString() 
        return code
    }
}