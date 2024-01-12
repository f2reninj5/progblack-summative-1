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
    "createdAt": "1704067200000"
}
```

# POST /user

## JSON body parameters

| Name          | Type   | Description                                                                            |
|---------------|--------|----------------------------------------------------------------------------------------|
| username      | string | A unique username for the individual user to create.                                   |
| profileColour | string | A colour string in the hexadecimal format `#abcdef`, to be used in the user's profile. |

## Example response

### Successful response

```json
{
    "username": "johnsmith",
    "profileColour": "#ffffff",
    "createdAt": "1704067200000"
}
```

# PUT /user/:username

## JSON body parameters

| Name           | Type   | Description                                                                            |
|----------------|--------|----------------------------------------------------------------------------------------|
| profileColour? | string | A colour string in the hexadecimal format `#abcdef`, to be used in the user's profile. |

## Example response

### Successful response

```json
{
    "username": "johnsmith",
    "profileColour": "#ffffff",
    "createdAt": "1704067200000"
}
```

# DELETE /user/:username/playlist/:name
# GET /user/:username/playlist/:name
# POST /user/:username/playlist
# DELETE /user/:username/playlist/:name/song/:index
# POST /user/:username/playlist/:name/song
# GET /artist/:name
# GET /artist/:name/song/:title
# GET /song/:song
