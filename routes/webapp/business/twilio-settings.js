/**
 * Created by michaelchang on 2/24/16.
 */
var cfg = {};

cfg.accountSid = 'AC213bfe405b4cc9c88869b6a814d94273';
cfg.authToken = '002ed663cdb8b5c93935f7cf845f0951';
cfg.sendingNumber = '+16502854891';

var requiredConfig = [cfg.accountSid, cfg.authToken, cfg.sendingNumber];
var isConfigured = requiredConfig.every(function(configValue) {
    return configValue || false;
});

if (!isConfigured) {
    var errorMessage =
        'TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_NUMBER must be set.';

    throw new Error(errorMessage);
}

// Export configuration object
module.exports = cfg;
