define({ "api": [  {    "type": "DELETE",    "url": "/api/auth/tokens/:token",    "title": "Delete token",    "group": "Auth",    "description": "<p>Delete access token, forcing a user to login again</p>",    "version": "1.0.0",    "filename": "src/modules/auth/api.js",    "groupTitle": "Auth",    "name": "DeleteApiAuthTokensToken"  },  {    "type": "DELETE",    "url": "/api/auth/users/:id",    "title": "Delete user",    "group": "Auth",    "description": "<p>Delete a user from the database</p>",    "version": "1.0.0",    "filename": "src/modules/auth/api.js",    "groupTitle": "Auth",    "name": "DeleteApiAuthUsersId"  },  {    "type": "GET",    "url": "/api/auth/session",    "title": "Get current session",    "group": "Auth",    "description": "<p>Get current session from access token</p>",    "version": "1.0.0",    "filename": "src/modules/auth/api.js",    "groupTitle": "Auth",    "name": "GetApiAuthSession"  },  {    "type": "GET",    "url": "/api/auth/tokens",    "title": "Get tokens",    "group": "Auth",    "description": "<p>Get all access tokens from the database</p>",    "version": "1.0.0",    "filename": "src/modules/auth/api.js",    "groupTitle": "Auth",    "name": "GetApiAuthTokens"  },  {    "type": "GET",    "url": "/api/auth/users",    "title": "Get users",    "group": "Auth",    "description": "<p>Get a list of users</p>",    "version": "1.0.0",    "filename": "src/modules/auth/api.js",    "groupTitle": "Auth",    "name": "GetApiAuthUsers"  },  {    "type": "GET",    "url": "/api/auth/users/:id",    "title": "Get single user",    "group": "Auth",    "description": "<p>Get a single user by ID</p>",    "version": "1.0.0",    "filename": "src/modules/auth/api.js",    "groupTitle": "Auth",    "name": "GetApiAuthUsersId"  },  {    "type": "POST",    "url": "/api/auth/login",    "title": "Local login",    "group": "Auth",    "description": "<p>Local user login with email and password</p>",    "version": "1.0.0",    "filename": "src/modules/auth/api.js",    "groupTitle": "Auth",    "name": "PostApiAuthLogin"  },  {    "type": "POST",    "url": "/api/auth/tokens",    "title": "Create token",    "group": "Auth",    "description": "<p>Generate an access token manually with the asked permissions. Useful for development purposes.</p>",    "version": "1.0.0",    "filename": "src/modules/auth/api.js",    "groupTitle": "Auth",    "name": "PostApiAuthTokens"  },  {    "type": "POST",    "url": "/api/auth/users",    "title": "Create user",    "group": "Auth",    "description": "<p>Create a new user</p>",    "version": "1.0.0",    "filename": "src/modules/auth/api.js",    "groupTitle": "Auth",    "name": "PostApiAuthUsers"  },  {    "type": "PUT",    "url": "/api/auth/users/:id",    "title": "Update user",    "group": "Auth",    "description": "<p>Update user settings</p>",    "version": "1.0.0",    "filename": "src/modules/auth/api.js",    "groupTitle": "Auth",    "name": "PutApiAuthUsersId"  },  {    "type": "GET",    "url": "/api/cloud/alive",    "title": "Alive",    "group": "Cloud",    "description": "<p>Get alive ping</p>",    "version": "1.0.0",    "filename": "src/modules/cloud/api.js",    "groupTitle": "Cloud",    "name": "GetApiCloudAlive"  },  {    "type": "GET",    "url": "/api/cloud/network",    "title": "Current network",    "group": "Cloud",    "description": "<p>Get network currently connected to</p>",    "version": "1.0.0",    "filename": "src/modules/cloud/api.js",    "groupTitle": "Cloud",    "name": "GetApiCloudNetwork"  },  {    "type": "GET",    "url": "/api/cloud/networks",    "title": "Network list",    "group": "Cloud",    "description": "<p>Get a list of nearby Wi-Fi networks</p>",    "version": "1.0.0",    "filename": "src/modules/cloud/api.js",    "groupTitle": "Cloud",    "name": "GetApiCloudNetworks"  },  {    "type": "GET",    "url": "/api/cloud/status",    "title": "Network status",    "group": "Cloud",    "description": "<p>Get the current network connection status</p>",    "version": "1.0.0",    "filename": "src/modules/cloud/api.js",    "groupTitle": "Cloud",    "name": "GetApiCloudStatus"  },  {    "type": "POST",    "url": "/api/cloud/connect",    "title": "Connect and register",    "group": "Cloud",    "description": "<p>Connect to Wi-Fi and register to Formide cloud using the setup flow</p>",    "version": "1.0.0",    "filename": "src/modules/cloud/api.js",    "groupTitle": "Cloud",    "name": "PostApiCloudConnect"  },  {    "type": "POST",    "url": "/api/cloud/setup",    "title": "Setup mode",    "group": "Cloud",    "description": "<p>Switch to setup mode, enabling The Element's access point</p>",    "version": "1.0.0",    "filename": "src/modules/cloud/api.js",    "groupTitle": "Cloud",    "name": "PostApiCloudSetup"  },  {    "type": "POST",    "url": "/api/cloud/wifi",    "title": "Connect Wi-Fi",    "group": "Cloud",    "description": "<p>Connect to a Wi-Fi network using SSID and optional password</p>",    "version": "1.0.0",    "filename": "src/modules/cloud/api.js",    "groupTitle": "Cloud",    "name": "PostApiCloudWifi"  }] });
