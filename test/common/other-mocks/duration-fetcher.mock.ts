import { IDurationFetcher } from "src/common/Application/duration-fetcher/duration-fetcher.interface"




export class DurationFetcherMock implements IDurationFetcher<string> {
    async getDuration(video: string): Promise<number> {
        return 100
    }
}