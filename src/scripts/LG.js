document.getElementById ('header_bg').addEventListener ('click', function (event) {
    event.stopPropagation ();

    let header_bg = document.getElementById ('header');
    header_bg.style.backgroundColor = document.getElementById ('hb-color').value;
});

document.getElementById ('header_text').addEventListener ('click',function (event) {
    event.stopPropagation ();

    let header_text = document.getElementById ('header');
    header_text.style.color = document.getElementById ('ht-color').value;

    let spotify = document.getElementById ('spotify');
    spotify.style.color = document.getElementById ('ht-color').value;

    let info = document.getElementById ('info');
    info.style.color = document.getElementById ('ht-color').value;
});

document.getElementById ('header_border').addEventListener ('click', function (event) {
    event.stopPropagation ();

    let links_border = document.getElementById ('links');
    links_border.style.borderColor = document.getElementById ('hbr-color').value;

    let title_border = document.getElementById ('title');
    title_border.style.borderColor = document.getElementById ('hbr-color').value;
    
    let search_border = document.getElementById ('search-box');
    search_border.style.borderColor = document.getElementById ('hbr-color').value;
});

document.getElementById ('search_bg').addEventListener ('click', function (event) {
    event.stopPropagation ();

    let search_song = document.getElementById ('song');
    search_song.style.backgroundColor = document.getElementById ('sb-color').value;

    let search_artist = document.getElementById ('artist');
    search_artist.style.backgroundColor = document.getElementById ('sb-color').value;

    let search_btn = document.getElementById ('search-btn');
    search_btn.style.backgroundColor = document.getElementById ('sb-color').value;
});

document.getElementById ('search_text').addEventListener ('click', function (event) {
    event.stopPropagation ();

    let search_song = document.getElementById ('song');
    search_song.style.color = document.getElementById ('st-color').value;

    let search_artist = document.getElementById ('artist');
    search_artist.style.color = document.getElementById ('st-color').value;

    let search_btn = document.getElementById ('search-btn');
    search_btn.style.color = document.getElementById ('st-color').value;
});

document.getElementById ('body_bg').addEventListener ('click', function (event) {
    event.stopPropagation ();

    let body_bg = document.getElementById ('body');
    body_bg.style.backgroundColor = document.getElementById ('bb-color').value;
});

document.getElementById ('body_text').addEventListener ('click', function (event) {
    event.stopPropagation ();

    let body_text = document.getElementById ('body');
    body_text.style.color = document.getElementById ('bt-color').value;
});

document.getElementById ('playlist_name').addEventListener ('click', function (event) {
    event.stopPropagation ();

    let playlist_name = document.getElementById ('playlist-title');
    playlist_name.textContent = document.getElementById ('playlist-name').value;
});

document.getElementById ('search-btn').addEventListener ('click', async function (event) {
    event.preventDefault ();
    
    let accessToken = window.localStorage.getItem('access_token');

    let song_title = document.getElementById ('song').value;
    let artist = document.getElementById ('artist').value;

    let query = `${song_title} ${artist}`; // Create search query
    let url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`;
      
    let response = await fetch(url, {
        headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
      
    let data = await response.json();
    
    let gallery = document.getElementById ('gallery');

    let div = document.createElement ('div');

    let figure = document.createElement ('figure');

    let img = document.createElement ('img');
    img.src = data.tracks.items[0].album.images[0].url;
    img.alt = `${song_title} - ${artist}`;
    figure.appendChild (img);

    let song = document.createElement ('p');
    song.textContent = data.tracks.items[0].name;
    song.style.textDecoration = 'underline';
    figure.appendChild (song);

    let musician = document.createElement ('p');
    let music_people = []
    for (let dude of data.tracks.items[0].artists)
    {
        music_people.push (dude.name);
    }
    musician.textContent = music_people.join (", ");
    musician.style.fontStyle = 'italic';
    figure.appendChild (musician);

    div.appendChild (figure);
    gallery.appendChild (div);
});