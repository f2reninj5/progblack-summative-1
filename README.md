# progblack-summative-1

***

# Playlist Thing API

## User

* [DELETE /user/:username](#delete-userusername)
* [GET /user/:username](#get-userusername)
* [POST /user](#post-user)
* [PUT /user/:username](#put-userusername)

### Playlist

* [DELETE /user/:username/playlist/:name](#delete-userusernameplaylistname)
* [GET /user/:username/playlist/:name](#get-userusernameplaylistname)
* [GET /user/:username/playlist](#get-userusernameplaylist)
* [POST /user/:username/playlist](#post-userusernameplaylist)

### Manage Playlist Songs

* [DELETE /user/:username/playlist/:name/song/:index](#delete-userusernameplaylistnamesongindex)
* [POST /user/:username/playlist/:name/song](#post-userusernameplaylistnamesong)

## Artist

* [GET /artist/:name](#get-artistname)

### Song

* [GET /artist/:name/song/:title](#get-artistnamesongtitle)

## Song search

* [GET /song/:song](#get-songsong)

***

# DELETE /user/:username

## Path parameters

| Name     | Type   | Description                         |
|----------|--------|-------------------------------------|
| username | string | The username of the user to delete. |

## Example responses

### Successful response

```json
{
    "message": "Deleted user."
}
```

## Response fields

| Name    | Type   | Description       |
|---------|--------|-------------------|
| message | string | A status message. |

# GET /user/:username

## Path parameters

| Name     | Type   | Description                      |
|----------|--------|----------------------------------|
| username | string | The username of the user to get. |

## Example responses

### Successful response

```json
{
    "username": "johnsmith",
    "profileColour": "#ffffff",
    "createdAt": 1704067200000
}
```

## Response fields

| Name          | Type    | Description                                                                              |
|---------------|---------|------------------------------------------------------------------------------------------|
| username      | string  | A unique username for the user.                                                          |
| profileColour | string  | A colour string in the hexadecimal format  `#abcdef` , to be used in the user's profile. |
| createdAt     | integer | A JavaScript timestamp from when the user was created.                                   |

# POST /user

## JSON body parameters

| Name          | Type   | Description                                                                            |
|---------------|--------|----------------------------------------------------------------------------------------|
| username      | string | A unique username for the individual user to create.                                   |
| profileColour | string | A colour string in the hexadecimal format `#abcdef`, to be used in the user's profile. |

## Example responses

### Successful response

```json
{
    "username": "johnsmith",
    "profileColour": "#ffffff",
    "createdAt": 1704067200000
}
```

## Response fields

| Name          | Type    | Description                                                                              |
|---------------|---------|------------------------------------------------------------------------------------------|
| username      | string  | A unique username for the user.                                                          |
| profileColour | string  | A colour string in the hexadecimal format  `#abcdef` , to be used in the user's profile. |
| createdAt     | integer | A JavaScript timestamp from when the user was created.                                   |

# PUT /user/:username

## JSON body parameters

| Name           | Type   | Description                                                                            |
|----------------|--------|----------------------------------------------------------------------------------------|
| profileColour? | string | A colour string in the hexadecimal format `#abcdef`, to be used in the user's profile. |

## Example responses

### Successful response

```json
{
    "username": "johnsmith",
    "profileColour": "#ffffff",
    "createdAt": 1704067200000
}
```

## Response fields

| Name          | Type    | Description                                                                              |
|---------------|---------|------------------------------------------------------------------------------------------|
| username      | string  | A unique username for the user.                                                          |
| profileColour | string  | A colour string in the hexadecimal format  `#abcdef` , to be used in the user's profile. |
| createdAt     | integer | A JavaScript timestamp from when the user was created.                                   |

# DELETE /user/:username/playlist/:name

## Path parameters

| Name     | Type   | Description                                        |
|----------|--------|----------------------------------------------------|
| username | string | The username of the user whose playlist to delete. |
| name     | string | The name of the playlist to delete.                |

## Example responses

### Successful response

```json
{
    "message": "Deleted playlist."
}
```

## Response fields

| Name    | Type   | Description       |
|---------|--------|-------------------|
| message | string | A status message. |

# GET /user/:username/playlist/:name

## Path parameters

| Name     | Type   | Description                                     |
|----------|--------|-------------------------------------------------|
| username | string | The username of the user whose playlist to get. |
| name     | string | The name of the playlist to get.                |

## Example responses

### Successful response

```json
{
    "user": {
        "username": "johnsmith"
    },
    "name": "Favourites",
    "songs": [
        {
            "artist": "The Beatles",
            "title": "Here Comes The Sun"
        },
        {
            "artist": "Arctic Monkeys",
            "title": "One Point Perspective"
        }
    ],
    "createdAt": 1704067260000
}
```

## Response fields

| Name          | Type    | Description                                                                 |
|---------------|---------|-----------------------------------------------------------------------------|
| user          | object  | Contains data by which the user who created the playlist can be identified. |
| user.username | string  | The username of the user who created the playlist.                          |
| name          | string  | The name of the playlist.                                                   |
| songs         | array   | An array containing songs in the playlist.                                  |
| song.artist   | string  | The artist associated with the song.                                        |
| song.title    | string  | The title of the song.                                                      |
| createdAt     | integer | A JavaScript timestamp from when the playlist was created.                  |

# GET /user/:username/playlist

## Path parameters

| Name     | Type   | Description                                     |
|----------|--------|-------------------------------------------------|
| username | string | The username of the user whose playlist to get. |

## Example responses

### Successful response

```json
[
    {
        "name": "Favourites",
        "createdAt": 1704067260000,
        "songCount": 2
    },
    {
        "name": "New Playlist",
        "createdAt": 1704067320000,
        "songCount": 0
    }
]
```

## Response fields

| Name      | Type    | Description                                                |
|-----------|---------|------------------------------------------------------------|
| name      | string  | The name of the playlist.                                  |
| createdAt | integer | A JavaScript timestamp from when the playlist was created. |
| songCount | integer | A count of how many songs are in the playlist.             |

# POST /user/:username/playlist

## Path parameters

| Name     | Type   | Description                                     |
|----------|--------|-------------------------------------------------|
| username | string | The username of the user whose playlist to get. |

## JSON body parameters

| Name | Type   | Description                         |
|------|--------|-------------------------------------|
| name | string | The name of the playlist to create. |

## Example responses

### Successful response

```json
{
    "user": {
        "username": "johnsmith"
    },
    "name": "New Playlist",
    "songs": [],
    "createdAt": 1704067320000
}
```

## Response fields

| Name          | Type    | Description                                                                 |
|---------------|---------|-----------------------------------------------------------------------------|
| user          | object  | Contains data by which the user who created the playlist can be identified. |
| user.username | string  | The username of the user who created the playlist.                          |
| name          | string  | The name of the playlist.                                                   |
| songs         | array   | An array containing songs in the playlist.                                  |
| createdAt     | integer | A JavaScript timestamp from when the playlist was created.                  |

# DELETE /user/:username/playlist/:name/song/:index

## Path parameters

| Name     | Type    | Description                                                        |
|----------|---------|--------------------------------------------------------------------|
| username | string  | The name of the user whose playlist to update.                     |
| name     | string  | The name of the playlist to update.                                |
| index    | integer | The zero-indexed position of the song to remove form the playlist. |

## Example responses

### Successful response

```json
{
    "user": {
        "username": "johnsmith"
    },
    "name": "Favourites",
    "songs": [
        {
            "artist": "The Beatles",
            "title": "Here Comes The Sun"
        }
    ],
    "createdAt": 1704067260000
}
```

## Response fields

| Name          | Type    | Description                                                                 |
|---------------|---------|-----------------------------------------------------------------------------|
| user          | object  | Contains data by which the user who created the playlist can be identified. |
| user.username | string  | The username of the user who created the playlist.                          |
| name          | string  | The name of the playlist.                                                   |
| songs         | array   | An array containing songs in the playlist.                                  |
| song.artist   | string  | The artist associated with the song.                                        |
| song.title    | string  | The title of the song.                                                      |
| createdAt     | integer | A JavaScript timestamp from when the playlist was created.                  |

# POST /user/:username/playlist/:name/song

## Path parameters

| Name     | Type   | Description                                    |
|----------|--------|------------------------------------------------|
| username | string | The name of the user whose playlist to update. |
| name     | string | The name of the playlist to update.            |

## JSON body parameters

| Name   | Type   | Description                                 |
|--------|--------|---------------------------------------------|
| artist | string | The artist associated with the song to add. |
| title  | string | The name of the song to add.                |

## Example responses

### Successful Response

```json
{
    "user": {
        "username": "johnsmith"
    },
    "name": "Favourites",
    "songs": [
        {
            "artist": "The Beatles",
            "title": "Here Comes The Sun"
        },
        {
            "artist": "Sam Katz",
            "title": "Your Town"
        }
    ],
    "createdAt": 1704067260000
}
```

## Response fields

| Name          | Type    | Description                                                                 |
|---------------|---------|-----------------------------------------------------------------------------|
| user          | object  | Contains data by which the user who created the playlist can be identified. |
| user.username | string  | The username of the user who created the playlist.                          |
| name          | string  | The name of the playlist.                                                   |
| songs         | array   | An array containing songs in the playlist.                                  |
| song.artist   | string  | The artist associated with the song.                                        |
| song.title    | string  | The title of the song.                                                      |
| createdAt     | integer | A JavaScript timestamp from when the playlist was created.                  |

# GET /artist/:name

## Path parameters

| Name   | Type   | Description        |
|--------|--------|--------------------|
| artist | string | The artist to get. |

## Example responses

### Successful response

```json
{
    "name": "The Beatles",
    "url": "https://www.last.fm/music/The+Beatles",
    "image": "https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png",
    "stats": {
        "listeners": "5130536",
        "playcount": "740538024"
    },
    "similar": [
        {
            "name": "John Lennon",
            "url": "https://www.last.fm/music/John+Lennon",
            "image": "https://lastfm.freetls.fastly.net/i/u/64s/2a96cbd8b46e442fc41c2b86b821562f.png"
        },
        {
            "name": "Paul McCartney",
            "url": "https://www.last.fm/music/Paul+McCartney",
            "image": "https://lastfm.freetls.fastly.net/i/u/64s/2a96cbd8b46e442fc41c2b86b821562f.png"
        },
        {
            "name": "George Harrison",
            "url": "https://www.last.fm/music/George+Harrison",
            "image": "https://lastfm.freetls.fastly.net/i/u/64s/2a96cbd8b46e442fc41c2b86b821562f.png"
        }
    ]
}
```

## Response fields

| Name                | Type    | Description                                                  |
|---------------------|---------|--------------------------------------------------------------|
| name                | string  | The name of the artist to get.                               |
| url                 | string  | A URL linking to the artist's Last.fm webpage.               |
| image               | string  | A URL linking to an image representing the artist.           |
| stats               | object  | Contains information listening information about the artist. |
| stats.listeners     | integer | The number of listeners on Last.fm.                          |
| stats.playcount     | integer | The number of plays on Last.fm.                              |
| similar             | array   | An array of similar artists.                                 |
| similarArtist.name  | string  | The name of the similar artist.                              |
| similarArtist.url   | string  | A URL linking to the similar artist's Last.fm webpage.       |
| similarArtist.image | string  | A URL linking to an image representing the similar artist.   |

# GET /artist/:name/song/:title

## Path parameters

| Name  | Type   | Description                                      |
|-------|--------|--------------------------------------------------|
| name  | string | The name of the artist associated with the song. |
| title | string | The title of the song to get.                    |

## Example responses

### Successful response

> The response is a slightly transformed version of the response from the Last.fm API found at: https://www.last.fm/api/show/track.getInfo

# GET /song/:song

## Path parameters

| Name | Type   | Description                               |
|------|--------|-------------------------------------------|
| song | string | The search query to identify the song by. |

## Example responses

### Successful response

```json
[
    {
        "name": "Hello Cold World",
        "artist": "Paramore",
        "url": "https://www.last.fm/music/Paramore/_/Hello+Cold+World",
        "listeners": "71141",
        "image": "https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png"
    },
    {
        "name": "Hello, World",
        "artist": "Louie Zong",
        "url": "https://www.last.fm/music/Louie+Zong/_/Hello,+World",
        "listeners": "70508",
        "image": "https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png"
    },
    {
        "name": "Hello,world!",
        "artist": "BUMP OF CHICKEN",
        "url": "https://www.last.fm/music/BUMP+OF+CHICKEN/_/Hello,world%21",
        "listeners": "40293",
        "image": "https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png"
    }
]
```

## Response fields

| Name           | Type    | Description                                      |
|----------------|---------|--------------------------------------------------|
| song.name      | string  | The title of the song.                           |
| song.artist    | string  | The artist associated with the song.             |
| song.url       | string  | A URL linking to the song's Last.fm webpage.     |
| song.listeners | integer | The number of listeners on Last.fm.              |
| song.image     | string  | A URL linking to an image representing the song. |
