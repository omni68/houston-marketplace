window.fbAsyncInit = function() {
    FB.init({
        appId      : '351070228420063',
        xfbml      : true,
        version    : 'v2.2'
    });

    /* Function assignments */
    FB._onGetLoginStatusResponse = onGetLoginStatusResponse;
    FB._onLogin = onLogin;

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
        App.authResponse = response.authResponse;
        App.init();
    }
    else {
        console.log('Not logged in.');
        FB.login(FB._onLogin);
    }
}

function onLogin(response) {
    if (response.authResponse) {
         console.log('Logged in.');
         App.authResponse = response.authResponse;
         App.init();
    } else {
        console.log('User cancelled login or did not fully authorize.');
    }
}