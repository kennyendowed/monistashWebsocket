const NodeCache = require("node-cache");
const cache = new NodeCache();

const getCachedData =async(key)=> {
  const cachedData = cache.get(key);
  return cachedData ? cachedData : null;
}

const  setCachedData =async(key, data, ttl = 60) =>{
  // ttl (time-to-live) is in seconds. Cache data for 1 minute by default.
  cache.set(key, data, ttl);
}

// Manually invalidate cache for a specific user
const  invalidateUserCache =async(cacheKey)=> {
   cache.delete(cacheKey);
}

const cachedData = {
  getCachedData,invalidateUserCache,
  setCachedData
};
module.exports = cachedData;

