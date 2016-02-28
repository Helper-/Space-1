/**
 * Created by michaelchang on 2/25/16.
 */
var cfg = {};

cfg.user = 'donotreplyspace1@gmail.com';
cfg.pass = 'donotreplyspace1breeze';

var requiredConfig = [cfg.user, cfg.pass];
var isConfigured = requiredConfig.every(function(configValue) {
    return configValue || false;
});

if (!isConfigured) {
    var errorMessage =
        'user and pass for email must be set.';

    throw new Error(errorMessage);
}

// Export configuration object
module.exports = cfg;
