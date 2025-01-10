export declare function setItem<V>(key: string, value: V): Promise<void>
export declare function getItem<V>(key: string): Promise<V | null>
export declare function deleteItem(key: string): Promise<void>
