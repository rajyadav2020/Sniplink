const repository = require('../respository/url.repository');
const base62 = require('../utils/base62');
// const { client } = require('../config/redis.config');
const {client} = require('../config/redis');

// Create short URL
exports.createShortUrl = async (originalUrl) => {

    if (!originalUrl) {
        throw new Error('Original URL is required');
    }

    const id = await repository.create(originalUrl);
    console.log('Generated ID:', id);
    const shortcode = base62.encode(id);
    console.log('Short code generated:', shortcode);
    await repository.updatedCode(id, shortcode);

    return {
        shortUrl: `http://localhost:8181/api/url/${shortcode}`
    };
};


// Get original URL
exports.getOriginalUrl = async (shortcode) => {

    // 1. Check Redis
    const cachedUrl = await client.get(shortcode);

    if (cachedUrl) {
        console.log('Cache hit');
        return cachedUrl;
    }

    console.log('Cache miss');

    // 2. If not in Redis, check MongoDB
    const data = await repository.findByCode(shortcode);

    if (!data) {
        throw new Error('Shortcode not found');
    }

    // 3. Store result in Redis
    await client.set(shortcode, data.originalUrl);

    console.log('Cached in Redis');

    // 4. Return original URL
    return data.originalUrl;
};