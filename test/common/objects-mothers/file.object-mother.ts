


export class FileObjectMother {
    
    static async createFile(){
        return new File([''], 'example.txt', { type: 'text/plain' });
    }
} 