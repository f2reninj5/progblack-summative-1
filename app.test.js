const request = require('supertest');
const app = require('./app');

/**
 * - user
 *  ✓ GET 404 No user with this username found.
 *  ✓ GET 200 JSON User object
 *  ✓ DELETE 404 No user with this username found.
 *  ✓ DELETE 200 Deleted user.
 *  ✓ PUT 404 No user with this username found.
 *  ✓ PUT 400 Missing attributes.
 *  ✓ PUT 200 JSON User object
 *  ✓ POST 400 Missing username or profileColour.
 *  ✓ POST 400 profileColour must be in hexadecimal format `#abcdef`.
 *  ✓ POST 409 User with this username already exists.
 *  ✓ POST 200 JSON User object
 *
 * - user.playlist
 *  ✓ GET 404 No playlist with this name found.
 *  ✓ GET 200 JSON Playlist object
 *  ✓ POST 400 Missing playlist name.
 *  ✓ POST 409 Playlist with this name already exists.
 *  ✓ POST 200 JSON Playlist object
 *  ✓ DELETE 404 No playlist with this name found.
 *  ✓ DELETE 200 Deleted playlist.
 *
 * - user.playlist.song
 *  ✓ POST 400 Missing artist or title.
 *  ✓ POST 200 JSON Playlist object
 *  ✓ DELETE 400 Index must be an integer.
 *  ✓ DELETE 400 Cannot remove song from empty playlist.
 *  ✓ DELETE 400 Index is out of range.
 *  ✓ DELETE 200 JSON Playlist object
 *
 * - artist
 *  ✓ GET 404 No artist with this name found.
 *  ✓ GET 200 JSON Artist object
 *
 * - artist.song
 *  ✓ GET 404 No song with this name found.
 *  ✓ GET 200 JSON Song object
 *
 * - song
 *  ✓ GET 200 JSON array of songs
 *  ✓ GET 200 JSON empty array
 */

describe('/user methods', () => {

    test('GET /user/johnsmith returns 404 when johnsmith doesn\'t exist', () => {
        return request(app)
            .get('/user/johnsmith')
            .expect(404)
            .expect(/No user with this username found./);
    });

    test('DELETE /user/johnsmith returns 404 when johnsmith doesn\'t exist', () => {
        return request(app)
            .delete('/user/johnsmith')
            .expect(404)
            .expect(/No user with this username found./);
    });

    test('PUT /user/johnsmith returns 404 when johnsmith doesn\'t exist', () => {
        return request(app)
            .put('/user/johnsmith')
            .expect(404)
            .expect(/No user with this username found./);
    });

    test('POST /user with missing body returns 400', () => {
        return request(app)
            .post('/user')
            .expect(400)
            .expect(/Missing username or profileColour./);
    });

    test('POST /user with incorrectly formed profileColour attribute returns 400', () => {
        return request(app)
            .post('/user')
            .send({ username: 'johnsmith', profileColour: 'this is not a colour!' })
            .expect(400)
            .expect(/profileColour must be in hexadecimal format `#abcdef`./);
    });

    test('POST /user with correctly formed body returns a User object', () => {
        return request(app)
            .post('/user')
            .send({ username: 'johnsmith', profileColour: '#ffffff' })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(/"johnsmith"/);
    });

    test('POST /user with a username that already exists returns 409', () => {
        return request(app)
            .post('/user')
            .send({ username: 'johnsmith', profileColour: '#4f4f4f' })
            .expect(409)
            .expect(/User with this username already exists./);
    });

    test('GET /user/johnsmith now returns a User object', () => {
        return request(app)
            .get('/user/johnsmith')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(/"johnsmith"/);
    });

    test('PUT /user/johnsmith with no attributes returns 400', () => {
        return request(app)
            .put('/user/johnsmith')
            .expect(400)
            .expect(/Missing attributes./);
    });

    test('PUT /user/johnsmith with incorrectly formed profileColour attribute returns 400', () => {
        return request(app)
            .put('/user/johnsmith')
            .send({ profileColour: 'ff9999' })
            .expect(400)
            .expect(/profileColour must be in hexadecimal format `#abcdef`./);
    });

    test('PUT /user/johnsmith with correctly formed body returns a User object', () => {
        return request(app)
            .put('/user/johnsmith')
            .send({ profileColour: '#ff9999' })
            .expect('Content-Type', /json/)
            .expect(/"johnsmith"/);
    });

    test('DELETE /user/johnsmith now returns 200', () => {
        return request(app)
            .delete('/user/johnsmith')
            .expect(200)
            .expect(/Deleted user./);
    });
});

describe('/user/:username/playlist methods', () => {

    test('Creating user johnsmith again', () => {
        return request(app)
            .post('/user')
            .send({ username: 'johnsmith', profileColour: '#FF0000' });
    });

    test('GET /user/johnsmith/playlist/favourites returns 404 when the playlist doesn\'t exist', () => {
        return request(app)
            .get('/user/johnsmith/playlist/favourites')
            .expect(404)
            .expect(/No playlist with this name found./);
    });

    test('DELETE /user/johnsmith/playlist/favourites returns 404 when playlist doesn\'t exist', () => {
        return request(app)
            .delete('/user/johnsmith/playlist/favourites')
            .expect(404)
            .expect(/No playlist with this name found./);
    });

    test('POST /user/johnsmith/playlist with missing body returns 400', () => {
        return request(app)
            .post('/user/johnsmith/playlist')
            .expect(400)
            .expect(/Missing playlist name./);
    });

    test('POST /user/johnsmith/playlist with correctly formed body returns a Playlist object', () => {
        return request(app)
            .post('/user/johnsmith/playlist')
            .send({ name: 'favourites' })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(/"favourites"/);
    });

    test('POST /user/johnsmith/playlist with a playlist name that already exists returns 409', () => {
        return request(app)
            .post('/user/johnsmith/playlist')
            .send({ name: 'favourites' })
            .expect(409)
            .expect(/Playlist with this name already exists./);
    });

    test('GET /user/johnsmith/playlist/favourites now returns a Playlist object', () => {
        return request(app)
            .get('/user/johnsmith/playlist/favourites')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(/"favourites"/);
    });

    test('DELETE /user/johnsmith/playlist/favourites now returns 200', () => {
        return request(app)
            .delete('/user/johnsmith/playlist/favourites')
            .expect(200)
            .expect(/Deleted playlist./);
    });

    test('Deleting user johnsmith again', () => {
        return request(app)
            .delete('/user/johnsmith');
    });
});

describe('/user/:username/playlist/:name/song methods', () => {

    test('Creating user johnsmith again', () => {
        return request(app)
            .post('/user')
            .send({ username: 'johnsmith', profileColour: '#FF0000' });
    });

    test('Creating favourites playlist again', () => {
        return request(app)
            .post('/user/johnsmith/playlist')
            .send({ name: 'favourites' });
    });

    test('POST /user/johnsmith/playlist/favourites/song with missing body returns 400', () => {
        return request(app)
            .post('/user/johnsmith/playlist/favourites/song')
            .expect(400)
            .expect(/Missing artist or title./);
    });

    test('POST /user/johnsmith/playlist/favourites/song with correctly formed body returns a Playlist object', () => {
        return request(app)
            .post('/user/johnsmith/playlist/favourites/song')
            .send({ artist: 'The Animals', title: 'House of the Rising Sun' })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(/"favourites"/)
            .expect(/"The Animals"/);
    });

    test('DELETE /user/johnsmith/playlist/favourites/song/one returns 400', () => {
        return request(app)
            .delete('/user/johnsmith/playlist/favourites/song/one')
            .expect(400)
            .expect(/Index must be an integer./);
    });

    test('DELETE /user/johnsmith/playlist/favourites/song/1 returns 400', () => {
        return request(app)
            .delete('/user/johnsmith/playlist/favourites/song/1')
            .expect(400)
            .expect(/Index is out of range./);
    });

    test('DELETE /user/johnsmith/playlist/favourites/song/0 returns a Playlist object', () => {
        return request(app)
            .delete('/user/johnsmith/playlist/favourites/song/0')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(/"favourites"/);
    });

    test('DELETE /user/johnsmith/playlist/favourites/song/0 now returns 400', () => {
        return request(app)
            .delete('/user/johnsmith/playlist/favourites/song/0')
            .expect(400)
            .expect(/Cannot remove song from empty playlist./);
    });

    test('Deleting user favourites again', () => {
        return request(app)
            .delete('/user/johnsmith/playlist/favourites');
    });

    test('Deleting user johnsmith again', () => {
        return request(app)
            .delete('/user/johnsmith');
    });
});

describe('/artist methods', () => {

    test('GET /artist/bvhakjbrfh returns 404', () => {
        return request(app)
            .get('/artist/bvhakjbrfh')
            .expect(404)
            .expect(/No artist with this name found./);
    });

    test('GET /artist/The Beatles returns an Artist object', () => {
        return request(app)
            .get('/artist/The Beatles')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(/"The Beatles"/);
    });
});

describe('/artist/:name/song methods', () => {

    test('GET /artist/The Beatles/song/vnuiewbavuk returns 404', () => {
        return request(app)
            .get('/artist/The Beatles/song/vnuiewbavuk')
            .expect(404)
            .expect(/No song with this name found./);
    });

    test('GET /artist/The Beatles/song/Here Comes The Sun', () => {
        return request(app)
            .get('/artist/The Beatles/song/Here Comes the Sun')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(/"Here Comes the Sun"/);
    });
});

describe('/song methods', () => {

    test('GET /song/lhiafbheawjbfkvewunbvui returns an empty array', () => {
        return request(app)
            .get('/song/lhiafbheawjbfkvewunbvui')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(/\[\]/);
    });

    test('GET /song/something returns an array of results', () => {
        return request(app)
            .get('/song/something')
            .expect(200)
            .expect('Content-Type', /json/);
    });
});
