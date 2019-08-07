' Force explicit variable declarations

Option Explicit

' Variable Declarations

dim appName, appLink, appIco, appDesc

' Get script args

appName = wScript.arguments(0)
appLink = wScript.arguments(1)
appIco = wScript.arguments(2)
appDesc = wScript.arguments(3)

' Create shortcut

dim shell, shortcut, desktopPath
set shell = createObject("wScript.shell")
desktopPath = shell.specialFolders("desktop")
set shortcut = shell.createShortcut(desktopPath + "\" + appName + ".lnk")

' Set attributes

shortcut.targetPath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
shortcut.workingDirectory = "C:\Program Files (x86)\Google\Chrome\Application"
shortcut.arguments =  "/new-window --disable-extensions --app=" + appLink
shortcut.description = appDesc
if appIco <> "" then
	shortcut.iconLocation = appIco
end if

' Save shortcut

shortcut.save

' End program