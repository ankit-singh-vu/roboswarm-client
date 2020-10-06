const shelljs = require("shelljs");
const fs = require('fs');

(async () => {
    console.log("Starting client deploy....");
    let sourcePath = '/Users/jackslingerland/repos/roboswarm-client/dist';
    if (!fs.existsSync(sourcePath)) {
        process.exit(1);
        return;
    }
    console.log("Using source path: ", sourcePath);
    const destinationPath = `/var/www/roboswarm-static/static`;
    const command = `scp -r ${sourcePath} root@roboswarm.kernl.us:${destinationPath}`;
    console.log(command);
    shelljs.exec(`ssh root@roboswarm.kernl.us "mkdir -p ${destinationPath}"`);
    shelljs.exec(command, () => {
        console.log("Client deploy complete.")
    });
})();
