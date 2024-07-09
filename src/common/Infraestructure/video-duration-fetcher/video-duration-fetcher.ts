import { getVideoDurationInSeconds } from "get-video-duration"
import { IDurationFetcher } from "src/common/Application/duration-fetcher/duration-fetcher.interface"




export class VideoDurationFetcher implements IDurationFetcher<string>{
    async getDuration(video: string): Promise<number> {
        return await getVideoDurationInSeconds(video)
    }
}