const request = require('supertest');
const app = require('./app');

/**
 * - user
 *  - GET 404 No user with this username found.
 *  - GET 200 JSON User object
 *  - DELETE 404 No user with this username found.
 *  - DELETE 200 Deleted user.
 *  - POST 400 Missing username or profileColour.
 *  - POST 400 profileColour must be in hexadecimal format `#abcdef`.
 *  - POST 409 User with this username already exists.
 *  - POST 200 JSON User object
 *
 * - user.playlist
 *  - GET 404 No playlist with this name found.
 *  - POST 400 Missing playlist name.
 *  - POST 409 Playlist with this name already exists.
 *  - POST 200 JSON Playlist object
 *
 * - user.playlist.song
 *  - POST 400 Missing artist or title.
 *  - POST 200 JSON Playlist object
 *  - DELETE 400 Index must be an integer.
 *  - DELETE 400 Cannot remove song from empty playlist.
 *  - DELETE 400 Index is out of range.
 *  - DELETE 200 JSON Playlist object
 *
 * - artist
 *  - GET 404 No artist with this name found.
 *  - GET 200 JSON Artist object
 *
 * - artist.song
 *  - GET 404 No song with this name found.
 *  - GET 200 JSON Song object
 *
 * - song
 *  - GET 200 JSON array of songs
 *  - GET 200 JSON empty array
 */
