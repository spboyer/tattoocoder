# Ghost Template for Azure
Clone the repo and use Git Deploy for Azure App Service

## App Settings

Key | Value | Descrition
------------ | ------------- | ------------
APPINSIGHTS_INSTRUMENTATIONKEY | App Insights key | Used for tracking analytics, be sure to enable AppInsights for your appication
SCM_REPOSITORY_PATH | D:\home\site\wwwroot | Sets the application to use the local disk (fast drive) for building application. This is faster than the VHD. Beneficial for cloning your repos (if large), npm install.
emailUsername | | email address for notifications
emailPassword | | password for email address
emailService | Gmail | Visit http://support.ghost.org/mail for instructions
siteName | value | 'http://' + process.env.siteName + '.azurewebsites.net';
websiteUrl | http://value.com | If the App Setting 'websiteUrl' is set, Ghost will use that URL as base. If it isn't set, we'll go with the default sitename.
WEBSITE_NODE_DEFAULT_VERSION | 6.9.0 | Minimum version supported.
