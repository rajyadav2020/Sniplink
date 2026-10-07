const repository = require('../respository/url.repository');
const base62 = require('../utils/base62');
const {client} = require('../config/redis');
// const incrementClickCount  =  require( '../respository/url.repository');

// Create short URL
exports.createShortUrl = async (originalUrl) => {

    if (typeof originalUrl !== 'string' || !originalUrl.trim()) {
        const error = new Error('Original URL is required');
        error.statusCode = 400;
        throw error;
    }

    let parsedUrl;
    try {
        parsedUrl = new URL(originalUrl.trim());
    } catch {
        const error = new Error('Original URL must be a valid absolute URL');
        error.statusCode = 400;
        throw error;
    }
    if (!['http:', 'https:'].includes(parsedUrl.protocol) || !parsedUrl.hostname) {
        const error = new Error('Original URL must use HTTP or HTTPS');
        error.statusCode = 400;
        throw error;
    }

    const normalizedUrl = parsedUrl.toString();
    const existing = await repository.findByOriginalUrl(normalizedUrl);
    if (existing) {
        return {
            shortUrl: `${(process.env.PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 8181}`).replace(/\/$/, '')}/api/url/${existing.shortCode}`
        };
    }

    const id = await repository.getNextSequence();
    const shortcode = base62.encode(id);
    await repository.create(id, normalizedUrl, shortcode);
    console.log('Generated ID:', id);
    console.log('Short code generated:', shortcode);
    return {
        shortUrl: `${(process.env.PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 8181}`).replace(/\/$/, '')}/api/url/${shortcode}`
    };
};


// Get original URL
exports.getOriginalUrl = async (shortcode) => {

    // 1. Check Redis
    const cachedUrl = await client.get(shortcode);

    if (cachedUrl) {
        console.log('Cache hit');
        await repository.incrementClickCount(shortcode);
        return cachedUrl;
    }

    console.log('Cache miss');

    // 2. If not in Redis, check MongoDB
    const data = await repository.findByCode(shortcode);

    if (!data) {
        const error = new Error('Shortcode not found');
        error.statusCode = 404;

        throw error;
    }

    await repository.incrementClickCount(shortcode);

    // 3. Store result in Redis
    await client.set(shortcode, data.originalUrl);

    console.log('Cached in Redis');

    // 4. Return original URL
    return data.originalUrl;
};


exports.getClickStats = async (shortcode)=>{
    const data = await repository.findByCode(shortcode);

    if(!data)
    {
        const error = new Error("shortcode not found");
        error.statusCode = 404;
        throw error;
    }

    return {
        shortcode: data.shortCode,
        clickCount: data.clickCount
    }
}