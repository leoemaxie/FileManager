class Help {
  constructor() {
    this.commands = {
      help: this.help,
      version: this.version,
      login: this.login,
      upload: this.upload,
      download: this.download,
      list: this.list,
      remove: this.remove,
      schedule: this.schedule,
    };
    this.ver = "1.0.0";
  }

  getCommandHelp(command) {
    return this.commands[command]().replace(/^\s{8,10}/gm, '');
  }

  help() {
    return `
        File Manager CLI version ${this.ver || "1.0.0"} 
        Usage: fmc <command> [options]

        Commands:
            login           Connect to the server
            upload          Upload a file to the server
            download        Download a file from the server
            sync            Sync a directory with the server
            backup          Backup a directory to the server
            restore         Restore a directory from the server
            help [command]  Show help message for a command
                  
        Options:
            -h, --help      Show this help message and exit
            -v, --version   Show version information and exit
        `;
  }

  login() {
    return `
        Usage: fmc login [options]

        Options:
            -u, --username  Username
            -p, --password  Password
        `;
  }

  upload() {
    return `
        Usage: fmc upload <file> [options]

        Options:
            -d, --directory  Directory on the server
        `;
  }

  download() {
    return `
        Usage: fmc download <file> [options]

        Options:
            -d, --directory  Directory on the server
        `;
  }

  list() {
    return `
        Usage: fmc list [options]

        Options:
            -d, --directory  Directory on the server
        `;
  }

  remove() {
    return `
        Usage: fmc remove <file> [options]

        Options:
            -d, --directory  Directory on the server
        `;
  }

  schedule() {
    return `
        Usage: fmc scheduleBackup <directory> [options]

        Options:
            -t, --time  Time to run the backup
        `;
  }

  version() {
    return `File Manager CLI version ${this.version}`;
  }

  run() {
    console.log("Help");
  }
}

export default Help;