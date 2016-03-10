/**
 * Created by michaelchang on 2/27/16.
 */
var https = require('https');

module.exports.sendSlackMessage = function()
{

    var postData =JSON.stringify({channel: '#messages', username: 'automated-messages',
        text: 'Calling all bots.', icon_emoji: ':ghost:'});
    console.log(postData);

    var options =
    {
        hostname: 'hooks.slack.com',
        path: '/services/T0PBMP674/B0PBJQF27/V6TbkyGyU4InJC4iz4xEcRUU',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    //console.log(options);

    var req = https.request(options, function(res)
    {
        console.log('STATUS:' + res.statusCode);
        console.log('Headers: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function(body)
        {
            console.log(body);
        });
        res.on('end', function()
        {
            console.log('No more data in response.');
        });
    });

    req.on('error', function(err)
    {
        console.log('problem with request: ' + err);
    });

    req.write(postData);
    req.end();
};
