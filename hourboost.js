var Steam = require('steam');
var SteamTotp = require('steam-totp');

var steamClient = new Steam.SteamClient();
var steamUser = new Steam.SteamUser(steamClient);
var steamFriends = new Steam.SteamFriends(steamClient);

var shared_secret = 'shared_secret';
var MobileAuthCode = SteamTotp.generateAuthCode(shared_secret);
	
//Login
steamClient.connect();
steamClient.on('connected', function() {
  steamUser.logOn({
    account_name: 'name',
    password: 'password',
	two_factor_code: MobileAuthCode
  });
});

//If logged on...
steamClient.on('logOnResponse', function(logonResp) {
	if (logonResp.eresult == Steam.EResult.OK) {
		console.log('[2FA IDLER] Logged in.');
		steamFriends.setPersonaState(Steam.EPersonaState.Online);
		boost();
	}
});

//Boost games
function boost() {
	console.log('[2FA IDLER] Closing games.');
	steamUser.gamesPlayed([]);
	console.log('[2FA IDLER] Starting games.');
	setTimeout(function() {
		steamUser.gamesPlayed({
                games_played: [{
						game_id: 730,
						game_id: 15444025664222527488,
						game_extra_info: 'IDLE | FUCK OF 2FA!'
                }]
        });
		
		setTimeout(function () {boost();}, 900000)
	}, 20000);
};

//Error output
steamClient.on('error', function(e) {
console.log('[2FA IDLER] ERROR - Boost stopped');
    if (e.eresult == Steam.EResult.InvalidPassword)
    {
    console.log('Reason: invalid password');
    }
    else if (e.eresult == Steam.EResult.AlreadyLoggedInElsewhere)
    {
    console.log('Reason: already logged in elsewhere');
    }
    else if (e.eresult == Steam.EResult.AccountLogonDenied)
    {
    console.log('Reason: logon denied - steam guard error');
    }
	else if (e.eresult == Steam.EResult.TwoFactorCodeMismatch)
    {
    console.log('Reason: Mobile code isnt correct');
    }
	else if (e.eresult == Steam.EResult.LoggedInElsewhere)
    {
    console.log('Reason: Logged in elsewhere');
    }
})

setTimeout(process.exit, 3600000);