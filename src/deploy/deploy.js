const shelljs = require("shelljs");
const fs = require('fs');

(async () => {
    console.log("Starting client deploy....");
    let sourcePath = '/Users/jack/repos/roboswarm-client/dist';
    if (!fs.existsSync(sourcePath)) {
        sourcePath = '/home/jack/repos/roboswarm/roboswarm-client/dist';
    }
    console.log("Using source path: ", sourcePath);
    const destinationPath = `/var/www/roboswarm-static/static`;
    const command = `scp -r ${sourcePath} root@45.55.43.188:${destinationPath}`;
    console.log(command);
    shelljs.exec(`ssh root@45.55.43.188 "mkdir -p ${destinationPath}"`);
    shelljs.exec(command, () => {
        console.log("Client deploy complete.")
    });
})();
