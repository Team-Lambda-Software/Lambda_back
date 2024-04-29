


export interface IdGenerator<T> {
    generateId (): Promise<T>
}