const axios = require('axios');

// @desc    Search YouTube videos for a topic
// @route   POST /api/youtube/search
// @access  Private
exports.searchVideos = async (req, res) => {
  try {
    const { query, maxResults = 3 } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

    const response = await axios.get(YOUTUBE_API_URL, {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: maxResults,
        key: YOUTUBE_API_KEY,
        relevanceLanguage: 'en',
        safeSearch: 'strict'
      }
    });

    const videos = response.data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));

    res.status(200).json({
      success: true,
      count: videos.length,
      videos
    });
  } catch (error) {
    console.error('YouTube API Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch videos from YouTube',
      error: error.message
    });
  }
};
