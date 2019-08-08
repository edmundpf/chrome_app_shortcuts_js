var bullet, childProcess, fs, getIcon, main, os, path, stringContains;

fs = require('fs');

os = require('os');

path = require('path');

childProcess = require('child_process');

getIcon = require('./iconScrape').getIcon;

bullet = require('./miscFunctions').bullet;

stringContains = require('./miscFunctions').stringContains;

//: Main Program
main = async function() {
  var args, error, i, initText, j, opts, ref, shortcutPath;
  try {
    opts = {
      desc: '',
      hasIcon: true
    };
    args = process.argv.slice(2);
    if (process.platform !== 'win32') {
      bullet('Cannot create app shortcuts on a non-Windows system, exiting');
      return false;
    }
    for (i = j = 0, ref = args.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      if (stringContains(args[i], ['name', 'NAME'])) {
        try {
          opts.name = args[i + 1];
        } catch (error1) {
          error = error1;
        }
      } else if (stringContains(args[i], ['url', 'URL'])) {
        try {
          opts.url = args[i + 1];
        } catch (error1) {
          error = error1;
        }
      } else if (stringContains(args[i], ['desc', 'DESC'])) {
        try {
          opts.desc = args[i + 1];
        } catch (error1) {
          error = error1;
        }
      } else if (stringContains(args[i], ['icon', 'ICON'])) {
        try {
          opts.hasIcon = args[i + 1] === 'true';
        } catch (error1) {
          error = error1;
        }
      }
    }
    if (opts.name == null) {
      bullet('App name is required, exiting');
      return false;
    }
    if (opts.url == null) {
      bullet('App url is required, exiting');
      return false;
    }
    initText = `Attempting to create app: '${opts.name}' from url: '${opts.url}'`;
    if (opts.hasIcon) {
      bullet(`Attempting to get app icon from: '${opts.url}'`);
      opts.icon = (await getIcon(opts.url));
    } else {
      opts.icon = '';
    }
    if (opts.desc !== '') {
      initText = initText + ` - ${opts.desc}`;
    }
    bullet(initText);
    childProcess.spawnSync('wscript', ['shortcut.vbs', opts.name, opts.url, opts.icon, opts.desc]);
    shortcutPath = path.resolve(`${path.join(os.homedir(), 'Desktop')}/${opts.name}.lnk`);
    if (fs.existsSync(shortcutPath)) {
      bullet(`App shortcut saved to desktop successfully: '${shortcutPath}'`);
      return true;
    } else {
      bullet('Could not save app shortcut to desktop');
      return false;
    }
  } catch (error1) {
    error = error1;
    throw error;
  }
};

//: Exports
module.exports = {
  main: main
};

//::: End Program :::
