import { ICodeGenerator } from "src/common/Application/code-generator/code-generator.interface"

export class SecretCodeGenerator implements ICodeGenerator<string> {
    generateCode(len: number): string {
        let arr = []
        var code = ''
        for ( let i=0; i<len; i++ ) { arr.push( Math.floor(Math.random() * 9) ) }
        for ( let i=0; i<len; i++ ) { code += arr[i].toString() }
        return code
    }
}