import { TimelineEvent } from './timelineData';

export class VideoPreloader {
    private loadedVideos: Map<string, HTMLIFrameElement> = new Map();

    constructor() {
        this.initYouTubeAPI();
    }

    private initYouTubeAPI() {
        // Load YouTube IFrame API
        if (typeof window !== 'undefined' && !window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }
    }

    async preloadVideosAroundIndex(currentIndex: number, events: TimelineEvent[]) {
        const toPreload = [
            currentIndex - 1, // Previous
            currentIndex,     // Current
            currentIndex + 1, // Next
            currentIndex + 2, // Next + 1
        ].filter(i => i >= 0 && i < events.length);

        for (const index of toPreload) {
            const videoId = events[index].videoId;
            if (!this.loadedVideos.has(videoId)) {
                this.preloadVideo(events[index]);
            }
        }

        // Unload videos that are far away (> 3 positions)
        this.unloadDistantVideos(currentIndex, events);
    }

    private preloadVideo(event: TimelineEvent) {
        if (typeof document === 'undefined') return;

        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${event.videoId}?autoplay=0&mute=1&preload=auto`;
        iframe.style.display = 'none';
        iframe.style.position = 'absolute';
        iframe.style.left = '-9999px';
        iframe.width = '640';
        iframe.height = '360';

        document.body.appendChild(iframe);
        this.loadedVideos.set(event.videoId, iframe);

        // Remove after buffering (3 seconds)
        setTimeout(() => {
            if (iframe.parentNode) {
                document.body.removeChild(iframe);
            }
        }, 3000);
    }

    private unloadDistantVideos(currentIndex: number, events: TimelineEvent[]) {
        events.forEach((event, index) => {
            const distance = Math.abs(index - currentIndex);
            if (distance > 3) {
                const iframe = this.loadedVideos.get(event.videoId);
                if (iframe && iframe.parentNode) {
                    document.body.removeChild(iframe);
                    this.loadedVideos.delete(event.videoId);
                }
            }
        });
    }
}
