import axios from "axios";
import fs from "fs";
import "node-cron";
import "sha1";
import Help from "./help.js";
import envLoader from "../utils/env_loader.js";
import CheckArgs from "./argscheck.js";
import { exit } from "process";

envLoader();

class CLI {
  constructor() {
    this.url = process.env.SERVER_URL || "http://localhost:5000";
    this.configDir = process.env.FILE_PATH || "~/.fmc";
    this.authFile = `${this.configDir}/token.txt`;
    this.configFile = `${this.configDir}/config.json`;
    this.token = this.readFile(this.authFile);
    this.config = this.readFile(this.configFile);
    this.cronJobs = this.readFile(`${this.configDir}/cron_jobs.json`);
    this.logs = this.readFile(`${this.configDir}/logs`);
    this.headers = {
      Authorization: `Bearer ${this.token}`,
    };
    this.commands = {
      login: this.login,
      upload: this.upload,
      download: this.download,
      list: this.list,
      remove: this.remove,
      schedule: this.schedule,
    };
    this.help = new Help();
  }

  async run() {
    const command = process.argv[2];

    if (this.commands[command]) {
      if (!CheckArgs.check()) {
        process.stdout.write(this.help.getCommandHelp(command));

        exit(1);
      }
      await this.commands[command](...process.argv.slice(3));
    } else {
      process.stdout.write(this.help.getCommandHelp("help"));
      exit(1);
    }
  }

  async login(username, password) {
    try {
      await axios.post(`${this.url}/connect`, {
        email: username,
        password: password,
      });
      this.config = {
        ...this.config,
        username: username,
        password: sha1(password),
      };
      fs.writeFileSync(`${this.authFile}`, response.data.token);
      fs.writeFileSync(`${this.configFile}`, JSON.stringify(this.config));
      process.stdout.write("\x1b[32mLogged in successfully\x1b[0m\n");
    } catch (e) {
      process.stdout.write(`\x1b[31mLogin failed ${e.toString()}\x1b[0m\n`);
    }
  }

  async upload(filePath) {
    try {
      const response = await axios.post(
        `${this.url}/files`,
        {
          name: filePath,
          type: "folder",
          isPublic: false,
          data: fs.readFileSync(filePath, "base64"),
        },
        {
          headers: this.headers,
        }
      );
      process.stdout.write("\x1b[32mFile uploaded successfully\x1b[0m\n");
    } catch (e) {
      process.stdout.write(
        `\x1b[31mFile upload failed ${e.toString()}\x1b[0m\n`
      );
    }
  }

  async download(fileName) {
    try {
      const response = await axios.get(`${this.url}/files/${fileName}`, {
        headers: this.headers,
      });
      fs.writeFileSync(`${fileName}`, response.data.data);
      process.stdout.write("\x1b[32mFile downloaded successfully\x1b[0m\n");
    } catch (e) {
      process.stdout.write(
        `\x1b[31mFile download failed ${e.toString()}\x1b[0m\n`
      );
    }
  }

  async list() {
    try {
      const response = await axios.get(`${this.url}/files`, {
        headers: this.headers,
      });
      response.data.forEach((file) => {
        process.stdout.write(`${file.name}\n`);
      });
    } catch (e) {
      process.stdout.write("\x1b[31mFile list failed\x1b[0m\n");
      exit(1);
    }
  }

  async remove(fileName) {
    try {
      const response = await axios.delete(`${this.url}/files/${fileName}`, {
        headers: this.headers,
      });
      process.stdout.write("\x1b[32mFile removed successfully\x1b[0m\n");
    } catch (error) {
      process.stdout.write("\x1b[31mFile remove failed\x1b[0m\n");
      exit(1);
    }
  }

  async schedule() {
    try {
      const jobs = JSON.parse(this.cronJobs);
      for (const taskId in jobs) {
        const job = jobs[taskId];
        const response = await axios.get(`${this.url}/files/${job.fileName}`, {
          headers: this.headers,
        });
        fs.writeFileSync(`${job.fileName}`, response.data.data);
        process.stdout.write("\x1b[32mBackup completed successfully\x1b[0m\n");
      }
    } catch (e) {
      process.stdout.write("\x1b[31mBackup failed\x1b[0m\n");
      exit(1);
    }
  }

  async scheduleBackup(taskId, fileName, cronTime) {
    try {
      const isValid = cron.validate(cronTime);

      if (!isValid) {
        process.stdout.write("\x1b[31mInvalid cron time\x1b[0m\n");
        exit(1);
      }

      const jobs = JSON.parse(this.cronJobs);
      jobs[taskId] = {
        fileName: fileName,
        cronTime: cronTime,
      };

      cron.schedule(cronTime, this.backup);
      fs.writeFileSync(
        `${this.configDir}/cron_jobs.json`,
        JSON.stringify(jobs)
      );
      process.stdout.write("\x1b[32mScheduled backup successfully\x1b[0m\n");
    } catch (e) {
      process.stdout.write("\x1b[31mScheduled backup failed\x1b[0m\n");
      exit(1);
    }
  }

  hash(string) {
    return sha1(string);
  }

  decodeHash(hash) {
    return Buffer.from(hash, "base64").toString("utf-8");
  }

  readFile(fileName) {
    return fs.existsSync(fileName) ? fs.readFileSync(fileName, "utf-8") : null;
  }

  getCredentials() {
    if (this.config) {
      const { body, password } = JSON.parse(this.config);
      process.stdout.write(`\x1b[32m${body}\x1b[0m\n`);
    } else {
      process.stdout.write("\x1b[31mNo credentials found\x1b[0m\n");
      exit(1);
    }
  }
}

export default CLI;
