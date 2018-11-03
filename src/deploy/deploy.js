const shelljs = require("shelljs");

(async () => {
    console.log("Starting client deploy....");
    const sourcePath = '/Users/jack/repos/roboswarm-client/dist';
    const destinationPath = `/var/www/roboswarm-static`;
    const command = `scp -r ${sourcePath} root@45.55.43.188:${destinationPath}`;
    console.log(command);
    shelljs.exec(`ssh root@45.55.43.188 "mkdir -p ${destinationPath}"`);
    shelljs.exec(command, () => {
        console.log("Client deploy complete.")
    });
})();
