export class MockEventSource extends EventTarget {
    readonly url: string;
    onmessage: ((ev: MessageEvent) => any) | null = null;
    onerror: ((ev: Event) => any) | null = null;
    onopen: ((ev: Event) => any) | null = null;

    constructor(url: string) {
        super();
        this.url = url;
        fetch(url)
            .then(r => r.json())
            .then(data => {
                this.dispatchEvent(new MessageEvent('message', { data: JSON.stringify(data) }));
            })
            .catch(err => console.error('MockEventSource fetch failed:', err));
    }

    close() {}
}
