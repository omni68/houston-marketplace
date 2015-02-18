window.fbAsyncInit = function() {
    FB.init({
        appId      : '351070228420063',
        xfbml      : true,
        version    : 'v2.2'
    });

    /* Function assignments */
    FB._onGetLoginStatusResponse = onGetLoginStatusResponse;
    FB._onNotAuthenticated = onNotAuthenticated;

    // 
    FB.getLoginStatus(FB._onGetLoginStatusResponse);
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

/* Function declarations */
function onGetLoginStatusResponse(response) {
    if(response.status === 'connected') {
        console.log('Logged in.');
        App.init();
    }
    else {
        console.log('Not logged in.');
        FB.login(FB._onNotAuthenticated);
    }
}

function onNotAuthenticated(response) {
    if (response.authResponse) {
         console.log('Welcome!  Fetching your information.... ');
         FB.api('/me', function(response) {
              console.log('Good to see you, ' + response.name + '.');
         });
         App.init();
    } else {
        console.log('User cancelled login or did not fully authorize.');
    }
}