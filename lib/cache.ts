interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number;
}

// IndexedDB wrapper
class SpaceCache {
    private db: IDBDatabase | null = null;

    async init() {
        if (typeof window === 'undefined') return; // Server-side guard

        return new Promise<void>((resolve, reject) => {
            const request = indexedDB.open('SpaceScopeCache', 1);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains('cache')) {
                    db.createObjectStore('cache', { keyPath: 'key' });
                }
            };
        });
    }

    async get<T>(key: string): Promise<T | null> {
        if (typeof window === 'undefined') return null;
        if (!this.db) await this.init();

        return new Promise((resolve) => {
            if (!this.db) {
                resolve(null);
                return;
            }
            const transaction = this.db.transaction(['cache'], 'readonly');
            const store = transaction.objectStore('cache');
            const request = store.get(key);

            request.onsuccess = () => {
                const entry: CacheEntry<T> | undefined = request.result;

                if (!entry) {
                    resolve(null);
                    return;
                }

                const age = Date.now() - entry.timestamp;
                if (age > entry.ttl) {
                    resolve(null);
                    return;
                }

                resolve(entry.data);
            };

            request.onerror = () => resolve(null);
        });
    }

    async set<T>(key: string, data: T, ttl: number = 1800000): Promise<void> {
        if (typeof window === 'undefined') return;
        if (!this.db) await this.init();

        return new Promise((resolve) => {
            if (!this.db) {
                resolve();
                return;
            }
            const transaction = this.db.transaction(['cache'], 'readwrite');
            const store = transaction.objectStore('cache');

            const entry: CacheEntry<T> & { key: string } = {
                key,
                data,
                timestamp: Date.now(),
                ttl
            };

            store.put(entry);
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => resolve();
        });
    }

    async delete(key: string): Promise<void> {
        if (typeof window === 'undefined') return;
        if (!this.db) await this.init();

        return new Promise((resolve) => {
            if (!this.db) {
                resolve();
                return;
            }
            const transaction = this.db.transaction(['cache'], 'readwrite');
            const store = transaction.objectStore('cache');
            store.delete(key);
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => resolve();
        });
    }
}

export const spaceCache = new SpaceCache();

// Rate limiting with localStorage
interface RateLimitEntry {
    count: number;
    resetTime: number;
}

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
    if (typeof window === 'undefined') return true; // Server-side skip

    const rateLimitKey = `ratelimit:${key}`;
    const stored = localStorage.getItem(rateLimitKey);

    const now = Date.now();

    if (!stored) {
        const entry: RateLimitEntry = {
            count: 1,
            resetTime: now + windowMs
        };
        localStorage.setItem(rateLimitKey, JSON.stringify(entry));
        return true;
    }

    const entry: RateLimitEntry = JSON.parse(stored);

    if (now > entry.resetTime) {
        const newEntry: RateLimitEntry = {
            count: 1,
            resetTime: now + windowMs
        };
        localStorage.setItem(rateLimitKey, JSON.stringify(newEntry));
        return true;
    }

    if (entry.count >= limit) {
        return false;
    }

    entry.count++;
    localStorage.setItem(rateLimitKey, JSON.stringify(entry));
    return true;
}

// Cache helper with fallback and timeout
export async function getCachedData<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 1800000, // 30min default
    fallback?: T,
    timeoutMs: number = 30000 // 30s default timeout
): Promise<T> {
    try {
        // Check IndexedDB
        const cached = await spaceCache.get<T>(key);
        if (cached) return cached;

        // Fetch fresh with timeout
        const fetchPromise = fetcher();
        const timeoutPromise = new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error('Request timed out')), timeoutMs)
        );

        const fresh = await Promise.race([fetchPromise, timeoutPromise]);

        await spaceCache.set(key, fresh, ttl);
        return fresh;
    } catch (error) {
        console.error(`Cache miss/error for ${key}:`, error);
        if (fallback) return fallback;
        throw error;
    }
}
