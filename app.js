require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`)); 



// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});
  
// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => {
        console.log(""); // new line
        console.log('Something went wrong when retrieving an access token', error)});

// Our routes go here:
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/artist-search", (req, res) => {
    // req.query --> Query String
    console.log('req.query',req.query)
    const { artistName } = req.query; // --> const artistName = req.query.artistName
    
    spotifyApi
        .searchArtists(artistName)
        .then(data => {
            console.log('The data received from the API: ', /*JSON.stringify*/(data.body.artists.items));
            // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            const artists = data.body.artists.items;
            res.render("artist-search-results", { artists });
        })
        .catch(err => console.log('The error occurred while searching for artists: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    const artistId = req.params.artistId;

    spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      console.log("Artist's albums", data.body);
      const albums = data.body.items;
      res.render("albums", { albums });
    })
    .catch((err) => console.log("Error while getting artist's albums: ", err));
});

app.get("/tracks/:albumId", (req, res, next) => {
    const albumId = req.params.albumId;
  
    spotifyApi
      .getAlbumTracks(albumId)
      .then(data => {
        console.log("Album tracks", data.body);
        const tracks = data.body.items;
        res.render("tracks", { tracks });
      })
      .catch((err) => console.log("Error while getting album tracks: ", err));
  });

app.listen(3000, () => {
    console.log('My Spotify project is running on port 3000 🎧 🥁 🎸 🔊')
});
