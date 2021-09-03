export interface KeyvaultInterface {
    get(key: string): Promise<unknown>
    set(key: string, object: unknown): Promise<void>
}
