
export interface ICodeGenerator<T> {
    generateCode(len: number): T
}