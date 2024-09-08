export default function getDomain(url: string | undefined): string | undefined {
    if (url && isValidURL(url)) {
        const urlObj = new URL(url);
        const domain = urlObj.hostname;
        return domain;
    }
    return undefined;
}

function isValidURL(url: string): boolean {
    return (url.startsWith("http://") || url.startsWith("https://"));
}