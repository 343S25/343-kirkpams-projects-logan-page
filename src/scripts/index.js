document.getElementById ('verify').addEventListener ('click', async () => {

    let generateRandomString = (length) => {
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    }
      
    let sha256 = async (plain) => {
        let encoder = new TextEncoder()
        let data = encoder.encode(plain)
        return window.crypto.subtle.digest('SHA-256', data)
    }
      
    let base64encode = (input) => {
        return btoa(String.fromCharCode(...new Uint8Array(input)))
          .replace(/=/g, '')
          .replace(/\+/g, '-')
          .replace(/\//g, '_');
    }

    let authorization = async () => {

        let codeVerifier  = generateRandomString(64);
        let hashed = await sha256(codeVerifier)
        let codeChallenge = base64encode(hashed);

        let clientId = '87b63813aa7e46cab0a2c657a4eb1564';
        let redirectUri = 'https://w3stu.cs.jmu.edu/pagelr/cs343/project/src/index.html';

        let scope = 'user-library-read playlist-read-private user-read-playback-state user-modify-playback-state';
        let authUrl = new URL("https://accounts.spotify.com/authorize")

        // generated in the previous step
        window.localStorage.setItem('code_verifier', codeVerifier);

        let params =  {
            response_type: 'code',
            client_id: clientId,
            scope: scope,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            redirect_uri: redirectUri,
        }

        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
    }

    await authorization();
});

document.getElementById ('token').addEventListener ('click', async function (event) {

    event.preventDefault ();

    let getToken = async () => {

        // stored in the previous step
        let codeVerifier = window.localStorage.getItem('code_verifier');

        let urlParams = new URLSearchParams(window.location.search);
        let code = urlParams.get('code');
        
        let url = "https://accounts.spotify.com/api/token";

        let payload = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: "87b63813aa7e46cab0a2c657a4eb1564",
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: "https://w3stu.cs.jmu.edu/pagelr/cs343/project/src/index.html",
                code_verifier: codeVerifier,
            })
        }

        let body = await fetch (url, payload);
        let response = await body.json();
        window.localStorage.setItem('access_token', response.access_token); 
    }

    await getToken()

    if (localStorage.getItem ('access_token') === 'undefined')
    {
        document.getElementById ('good').textContent = " X";
    }
    else
    {
        document.getElementById ('good').textContent = " ✓";
    }
});