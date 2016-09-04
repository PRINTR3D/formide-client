formide-client
=================

## Installation and setup
To install `formide-client`, go through the following steps.

```
npm install -g formide-client
```

This will install `formide-client` globally, including the `formidectl` tools to easily run the client.
After installing, you can run the following command to start the first setup procedure:

```
formidectl init
```

This will guide you through a few steps to configure the client for first run. Afer that's done, you can start the client.

```
formidectl up
```

## Requirements
`formide-client` needs the following requirements:

* ARM linux (tailored for The Element, also tested on Raspberry Pi 2 and 3, and Beagle Bone Black)
* NodeJS 4.x (the LTS release) and accompanying NPM version
* A working internet connection for cloud functionality

## Contributing
You can contribute to `formide-client` by closing issues (via fork -> pull request to development), adding features or just using it and report bugs!
Please check the issue list of this repo before adding new ones to see if we're already aware of the issue that you're having.

## Licence
Please check LICENSE.md for licensing information.

## Run options
There are several options you can add when running the client using `formidectl run`:

* -M, --memory-limit <MB>, add a Node.js memory limit in MBs to ensure the client will keep running smoothly over time
* -E, --environment <ENV>, set an environment to run in, defaults to production. The config should contain a config file for the selected environment
