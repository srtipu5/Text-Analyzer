import NodeCache from 'node-cache';

class CacheService {
  private cache: NodeCache;

  private static instance: CacheService;

  private constructor() {
    this.cache = new NodeCache();
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  set(key: string, value: any, expiredTimeInMinute: number = 0): boolean {
    return this.cache.set(key, value, expiredTimeInMinute * 60);
  }

  get(key: string): any {
    return this.cache.get(key);
  }

  del(key: string): number {
    return this.cache.del(key);
  }

  flushAll(): void {
    this.cache.flushAll();
  }
}

export default CacheService.getInstance();