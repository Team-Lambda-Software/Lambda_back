



export interface IDurationFetcher <T> {
    getDuration( video: T ): Promise<number>
}