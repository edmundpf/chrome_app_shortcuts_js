fs = require 'fs'
os = require 'os'
path = require 'path'
childProcess = require 'child_process'
getIcon = require('./iconScrape').getIcon
bullet = require('./miscFunctions').bullet
stringContains = require('./miscFunctions').stringContains

#: Main Program

main = ->
	try
		opts =
			desc: ''
			hasIcon: true
		args = process.argv.slice(2)

		if process.platform != 'win32'
			bullet('Cannot create app shortcuts on a non-Windows system, exiting')
			return false

		for i in [0...args.length]
			if stringContains(args[i], ['name', 'NAME'])
				try
					opts.name = args[i + 1]
				catch error
			else if stringContains(args[i], ['url', 'URL'])
				try
					opts.url = args[i + 1]
				catch error
			else if stringContains(args[i], ['desc', 'DESC'])
				try
					opts.desc = args[i + 1]
				catch error
			else if stringContains(args[i], ['icon', 'ICON'])
				try
					opts.hasIcon = (args[i + 1] == 'true')
				catch error

		if !opts.name?
			bullet('App name is required, exiting')
			return false
		if !opts.url?
			bullet('App url is required, exiting')
			return false

		initText = "Attempting to create app: '#{opts.name}' from url: '#{opts.url}'"
		if opts.hasIcon
			bullet("Attempting to get app icon from: '#{opts.url}'")
			opts.icon = await getIcon(opts.url)
		else
			opts.icon = ''
		if opts.desc != ''
			initText = initText + " - #{opts.desc}"
		bullet(initText)

		childProcess.spawnSync(
			'wscript',
			[
				'shortcut.vbs',
				opts.name,
				opts.url,
				opts.icon,
				opts.desc
			]
		)

		shortcutPath = path.resolve("#{path.join(os.homedir(), 'Desktop')}/#{opts.name}.lnk")
		if fs.existsSync(shortcutPath)
			bullet("App shortcut saved to desktop successfully: '#{shortcutPath}'")
			return true
		else
			bullet('Could not save app shortcut to desktop')
			return false
	catch error
		throw error

#: Exports

module.exports =
	main: main

#::: End Program :::