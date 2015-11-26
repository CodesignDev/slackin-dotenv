var pkg = require('./package');
var program = require('commander');
var slackin = require('slackin');

require('dotenv').load();

program
.version(pkg.version)
.description(pkg.description)
.usage('[options] <slack-teamid> <slack-api-token>')
.option('-p, --port <port>', 'Port to list on [$PORT or 3000]', require('hostenv').PORT || 3000)
.option('-h, --hostname <hostname>', 'Hostname to listen on [$HOSTNAME or 0.0.0.0]', require('hostenv').HOSTNAME || '0.0.0.0')
.option('-c, --channels [<chan>]', 'One or more comma-separated channel names to allow single-channel guests [$SLACK_CHANNELS]', process.env.SLACK_CHANNELS)
.option('-i, --interval <int>', 'How frequently (ms) to poll Slack [$SLACK_INTERVAL or 5000]', process.env.SLACK_INTERVAL || 5000)
.option('-P, --path', 'Path to serve slackin under', '/')
.option('-s, --silent', 'Do not print out warns or errors')
.option('-C, --coc <coc>', 'Full URL to a CoC that needs to be agreed to')
.option('-c, --css <file>', 'Full URL to a custom CSS file to use on the main page')
.parse(process.argv);

if (program.args.length < 2) {
  program.org = process.env.SLACK_TEAMID;
  program.token = process.env.SLACK_TOKEN;
} else {
  program.org = program.args[0];
  program.token = program.args[1];
}

if (!program.org || !program.token) {
  program.help();
}

var port = program.port;
var hostname = program.hostname;
slackin(program).listen(port, hostname, function(err){
  if (err) throw err;
  if (!program.silent) console.log('%s – listening on %s:%d', new Date, hostname, port);
});
