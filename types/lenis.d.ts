declare module 'lenis' {
    export default class Lenis {
        constructor(options?: any);
        raf(time: number): void;
        destroy(): void;
        on(event: string, callback: (args: any) => void): void;
        scrollTo(target: any, options?: any): void;
    }
}
