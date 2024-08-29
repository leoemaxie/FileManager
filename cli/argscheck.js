class CheckArgs {
  constructor() {
    this.args = process.argv;
    this.command = this.args[2];
    this.length = this.args.length;
    this.expectedLength = 5;
    this.commands = {
      login: this.login,
      upload: this.upload,
      download: this.download,
      list: this.list,
      remove: this.remove,
      schedule: this.schedule,
    };
    this.flags = this.getFlags();
    this.expectedFlags = [];
  }

  getFlags() {
    const flags = {};
    for (let i = 3; i < this.length; i++) {
      if (this.args[i].startsWith("-")) {
        flags[this.args[i]] = this.args[i + 1];
      }
    }
    return flags;
  }

  login() {
    this.expectedLength = 5;
    this.expectedFlags = ["-u", "-p"];
  }

  upload() {
    this.expectedLength = 4;
    this.expectedFlags = ["-d"];
  }

  download() {
    this.expectedLength = 4;
  }

  list() {
    this.expectedLength = 3;
  }

  remove() {
    this.expectedLength = 4;
  }

  schedule() {
    this.expectedLength = 4;
  }

  compareFlags() {
    for (let i = 0; i < this.expectedFlags.length; i++) {
      if (!this.flags[this.expectedFlags[i]]) {
        return false;
      }
    }
    return true;
  }

  check() {
    if (this.length !== this.expectedLength || !this.compareFlags()) {
      return false;
    }
    if (this.commands[this.command]) {
      return this.commands[this.command]();
    }
    return false;
  }
}

export default new CheckArgs();
