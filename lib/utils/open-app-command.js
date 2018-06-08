//TODO - move to cordova
/*
  This file needs to be removed when issue https://github.com/pwnall/node-open/issues/30
  is resolved, original file can be seen here:
  https://github.com/pwnall/node-open/blob/0c3ad272bfbc163cce8806e64630c623a9cfd8f4/lib/open.js
*/

const escapeDoubleQuotes = (str) => str.replace(/"/g, '\\\"');

module.exports = function(target, appName) {
  let opener;

  switch (process.platform) {
    case 'darwin':
      if (appName) {
        opener = 'open -a "' + escapeDoubleQuotes(appName) + '"';
      } else {
        opener = 'open';
      }
      break;
    case 'win32':
      // if the first parameter to start is quoted, it uses that as the title
      // so we pass a blank title so we can quote the file we are opening
      if (appName) {
        opener = 'start "" "' + escapeDoubleQuotes(appName) + '"';
      } else {
        opener = 'start';
      }
      break;
    default:
      if (appName) {
        opener = escapeDoubleQuotes(appName);
      } else {
        // use Portlands xdg-open everywhere else
        opener = 'xdg-open';
      }
      break;
  }

  if (process.env.SUDO_USER) {
    opener = 'sudo -u ' + process.env.SUDO_USER + ' ' + opener;
  }

  return `${opener} "${escapeDoubleQuotes(target)}"`
};
