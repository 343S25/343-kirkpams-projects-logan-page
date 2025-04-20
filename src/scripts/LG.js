// Get local saved songs
let art_list = JSON.parse (localStorage.getItem ('art_list'));
if (art_list == undefined)
{
    art_list = [];
} 

// change header background color
document.getElementById ('header_bg').addEventListener ('click', function (event) {
    event.stopPropagation ();

    let color = document.getElementById ('hb-color').value;

    let header_bg = document.getElementById ('header');
    header_bg.style.backgroundColor = color;

    localStorage.setItem ('header_bg',  color);
});

// change header text color
document.getElementById ('header_text').addEventListener ('click',function (event) {
    event.stopPropagation ();

    let color = document.getElementById ('ht-color').value

    let header_text = document.getElementById ('header');
    header_text.style.color = color;

    let spotify = document.getElementById ('spotify');
    spotify.style.color = color;

    let info = document.getElementById ('info');
    info.style.color = color;

    localStorage.setItem ('header_text',  color);
});

// change header border color
document.getElementById ('header_border').addEventListener ('click', function (event) {
    event.stopPropagation ();

    let color = document.getElementById ('hbr-color').value;

    let links_border = document.getElementById ('links');
    links_border.style.borderColor = color;

    let title_border = document.getElementById ('title');
    title_border.style.borderColor = color;
    
    let search_border = document.getElementById ('search-box');
    search_border.style.borderColor = color;

    localStorage.setItem ('header_border',  color);    
});

// change search box background color
document.getElementById ('search_bg').addEventListener ('click', function (event) {
    event.stopPropagation ();

    let color = document.getElementById ('sb-color').value;

    let search_song = document.getElementById ('song');
    search_song.style.backgroundColor = color;

    let search_artist = document.getElementById ('artist');
    search_artist.style.backgroundColor = color;

    let search_btn = document.getElementById ('search-btn');
    search_btn.style.backgroundColor = color;

    let clear_btn = document.getElementById ('clear-btn');
    clear_btn.style.backgroundColor = color;

    localStorage.setItem ('search_bg',  color);  
});

// change search box text color
document.getElementById ('search_text').addEventListener ('click', function (event) {
    event.stopPropagation ();

    let color = document.getElementById ('st-color').value;

    let search_song = document.getElementById ('song');
    search_song.style.color = color;

    let search_artist = document.getElementById ('artist');
    search_artist.style.color = color;

    let search_btn = document.getElementById ('search-btn');
    search_btn.style.color = color;

    let clear_btn = document.getElementById ('clear-btn');
    clear_btn.style.color = color;

    localStorage.setItem ('search_text',  color);
});

// change body background color
document.getElementById ('body_bg').addEventListener ('click', function (event) {
    event.stopPropagation ();

    let color = document.getElementById ('bb-color').value;

    let body_bg = document.getElementById ('body');
    body_bg.style.backgroundColor = color;

    localStorage.setItem ('body_bg',  color);
});

// change body text color
document.getElementById ('body_text').addEventListener ('click', function (event) {
    event.stopPropagation ();

    let color = document.getElementById ('bt-color').value;

    let body_text = document.getElementById ('body');
    body_text.style.color = color;

    localStorage.setItem ('body_text',  color);
});

// change playlist name
document.getElementById ('playlist_name').addEventListener ('click', function (event) {
    event.stopPropagation ();

    let name = document.getElementById ('playlist-name').value;

    let playlist_name = document.getElementById ('playlist-title');
    playlist_name.textContent = name;

    localStorage.setItem ('playlist_name',  name);
});

// add a song to the page and local storage
document.getElementById ('search-btn').addEventListener ('click', async function (event) {
    event.preventDefault ();
    
    let accessToken = window.localStorage.getItem('access_token');

    let song_title = document.getElementById ('song').value;
    let artist = document.getElementById ('artist').value;

    let query = `${song_title} ${artist}`; // Create search query
    let url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`;
      
    let response = await fetch(url, {
        headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
      
    let data = await response.json();

    let art = {
        cover: data.tracks.items[0].album.images[0].url,
        title: data.tracks.items[0].name,
        artists: data.tracks.items[0].artists,
        track: data.tracks.items[0].uri
    };
    
    art_list.push (art);

    addArt (art);

    localStorage.setItem ('art_list', JSON.stringify (art_list));
});

// helper function for adding art to the page
function addArt (art)
{
    let gallery = document.getElementById ('gallery');
    let template = document.getElementById ('art-template');

    let artView = template.content.cloneNode (true);

    let music_people = []
    for (let dude of art.artists)
    {
        music_people.push (dude.name);
    }    
        
    let img = artView.getElementById ('image-template');
    img.src = art.cover;
    img.alt = `Missing Cover: {${art.title} by ${music_people.join (', ')}}`;

    let song = artView.getElementById ('title-template');
    song.textContent = art.title;
    song.style.textDecoration = 'underline';

    let musician = artView.getElementById ('artist-template');
    musician.textContent = music_people.join (", ");
    musician.style.fontStyle = 'italic';

    // allow the ability to play/pause the song after the image is clicked
    img.addEventListener ('click', async function () {
        let access_token = localStorage.getItem ('access_token');

        // get current devices ID
        let url = 'https://api.spotify.com/v1/me/player/devices';

        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access_token}`,
            },
        });
        let resp = await response.json ();
        let deviceID = resp.devices;
        let trackUri = art.track;

        // check if spotify is playing a song
        let playing = await fetch('https://api.spotify.com/v1/me/player', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access_token}`,
            }
        });
        let is_playing = await playing.json();

        // pauses if true, plays otherwise
        if (is_playing.is_playing)
        {
            await fetch('https://api.spotify.com/v1/me/player/pause', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                }
            });
        }
        else
        {
            let playUrl = 'https://api.spotify.com/v1/me/player/play';

            await fetch(playUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uris: [trackUri],
                    device_ids: [deviceID]
                })
            })
        }
    });

    gallery.appendChild (artView);
}

// clear all songs from the page and local storage;
document.getElementById ('clear-btn').addEventListener ('click', function (event){
    event.preventDefault ();

    localStorage.removeItem ('art_list');
    location.reload ();
});

// clear all customizations
document.getElementById ('clear_customs').addEventListener ('click', function (event) {
    event.preventDefault ();

    localStorage.removeItem ('header_bg');
    localStorage.removeItem ('header_text');
    localStorage.removeItem ('header_border');
    localStorage.removeItem ('search_bg');
    localStorage.removeItem ('search_text');
    localStorage.removeItem ('body_bg');
    localStorage.removeItem ('body_text');
    localStorage.removeItem ('playlist_name');

    let header_bg = document.getElementById ('header');
    header_bg.style.backgroundColor = '#9999FF'; 
    
    let header_text = document.getElementById ('header');
    header_text.style.color = 'white';

    let spotify = document.getElementById ('spotify');
    spotify.style.color = 'white';

    let info = document.getElementById ('info');
    info.style.color = 'white';

    let links_border = document.getElementById ('links');
    links_border.style.borderColor = 'white';

    let title_border = document.getElementById ('title');
    title_border.style.borderColor = 'white';
    
    let search_border = document.getElementById ('search-box');
    search_border.style.borderColor = 'white';

    let search_song = document.getElementById ('song');
    search_song.style.backgroundColor = '#CCE5FF';

    let search_artist = document.getElementById ('artist');
    search_artist.style.backgroundColor = '#CCE5FF';

    let search_btn = document.getElementById ('search-btn');
    search_btn.style.backgroundColor = '#CCE5FF';

    let clear_btn = document.getElementById ('clear-btn');
    clear_btn.style.backgroundColor = '#CCE5FF';

    let search_song_t = document.getElementById ('song');
    search_song_t.style.color = '#9B5BFF';

    let search_artist_t = document.getElementById ('artist');
    search_artist_t.style.color = '#9B5BFF';

    let search_btn_t = document.getElementById ('search-btn');
    search_btn_t.style.color = '#9B5BFF';

    let clear_btn_t = document.getElementById ('clear-btn');
    clear_btn_t.style.color = '#9B5BFF';

    let body_bg = document.getElementById ('body');
    body_bg.style.backgroundColor = '#7F00FF';

    let body_text = document.getElementById ('body');
    body_text.style.color = 'white';

    let playlist_name = document.getElementById ('playlist-title');
    playlist_name.textContent = 'Gallery Name';
});

// Add local storage songs to the page and color changes
(function () {
    // load customizations
    let header_bg = document.getElementById ('header');
    header_bg.style.backgroundColor = localStorage.getItem ('header_bg'); 
    
    let header_text = document.getElementById ('header');
    header_text.style.color = localStorage.getItem ('header_text');

    let spotify = document.getElementById ('spotify');
    spotify.style.color = localStorage.getItem ('header_text');

    let info = document.getElementById ('info');
    info.style.color = localStorage.getItem ('header_text');

    let links_border = document.getElementById ('links');
    links_border.style.borderColor = localStorage.getItem ('header_border');

    let title_border = document.getElementById ('title');
    title_border.style.borderColor = localStorage.getItem ('header_border');
    
    let search_border = document.getElementById ('search-box');
    search_border.style.borderColor = localStorage.getItem ('header_border');

    let search_song = document.getElementById ('song');
    search_song.style.backgroundColor = localStorage.getItem ('search_bg');

    let search_artist = document.getElementById ('artist');
    search_artist.style.backgroundColor = localStorage.getItem ('search_bg');

    let search_btn = document.getElementById ('search-btn');
    search_btn.style.backgroundColor = localStorage.getItem ('search_bg');

    let clear_btn = document.getElementById ('clear-btn');
    clear_btn.style.backgroundColor = localStorage.getItem ('search_bg');

    let search_song_t = document.getElementById ('song');
    search_song_t.style.color = localStorage.getItem ('search_text');

    let search_artist_t = document.getElementById ('artist');
    search_artist_t.style.color = localStorage.getItem ('search_text');

    let search_btn_t = document.getElementById ('search-btn');
    search_btn_t.style.color = localStorage.getItem ('search_text');

    let clear_btn_t = document.getElementById ('clear-btn');
    clear_btn_t.style.color = localStorage.getItem ('search_text');

    let body_bg = document.getElementById ('body');
    body_bg.style.backgroundColor = localStorage.getItem ('body_bg');

    let body_text = document.getElementById ('body');
    body_text.style.color = localStorage.getItem ('body_text');

    let playlist_name = document.getElementById ('playlist-title');
    if (localStorage.getItem ('playlist_name') != undefined)
    {
        playlist_name.textContent = localStorage.getItem ('playlist_name');
    }
    else
    {
        playlist_name.textContent = 'Gallery Name';
    }

    // load songs
   for (let art of art_list)
   {
        addArt (art);
   }
})();