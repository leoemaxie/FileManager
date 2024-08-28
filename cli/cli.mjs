import axios from "axios";
import fs from "fs";
import "node-cron";
import "sha1";
// import envLoader from "../utils/env_loader";

// envLoader();

class CLI {
  constructor() {
    this.url = process.env.SERVER_URL || "http://localhost:5000";
    this.configDir = process.env.FILE_PATH || "/tmp/files_manager";
    this.authFile = `${this.configDir}/token.txt`;
    this.configFile = `${this.configDir}/config.json`;
    this.token = this.getFile(this.authFile);
    this.config = this.getFile(this.configFile);
    this.cronJobs = this.getFile(`${this.configDir}/cron_jobs.json`);
    this.logs = this.getFile(`${this.configDir}/logs`);
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
  }

  async run() {
    const command = process.argv[2];
    if (this.commands[command]) {
      await this.commands[command](...process.argv.slice(3));
    } else {
      process.stdout.write("\x1b[31mCommand not found\x1b[0m\n");
    }
  }

  login = async (username, password) => {
    try {
      const response = await axios.post(`${this.url}/users/auth`, {
        email: username,
        password: password,
      });
      fs.writeFileSync(`${this.authFile}`, response.data.token);
      fs.writeFileSync(
        `${this.configFile}`,
        JSON.stringify({
          username: username,
          password: this.hashToken(password),
        })
      );
      process.stdout.write("\x1b[32mLogged in successfully\x1b[0m\n");
    } catch (error) {
      process.stdout.write("\x1b[31mLogin failed\x1b[0m\n");
    }
  };

  upload = async (filePath) => {
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
    } catch (error) {
      process.stdout.write("\x1b[31mFile upload failed\x1b[0m\n");
    }
  };

  download = async (fileName) => {
    try {
      const response = await axios.get(`${this.url}/files/${fileName}`, {
        headers: this.headers
      });
      fs.writeFileSync(`${fileName}`, response.data.data);
      process.stdout.write("\x1b[32mFile downloaded successfully\x1b[0m\n");
    } catch (error) {
      process.stdout.write("\x1b[31mFile download failed\x1b[0m\n");
    }
  };

  list = async () => {
    try {
      const response = await axios.get(`${this.url}/files`, {
        headers: this.headers
      });
      response.data.forEach((file) => {
        process.stdout.write(`${file.name}\n`);
      });
    } catch (error) {
      process.stdout.write("\x1b[31mFile list failed\x1b[0m\n");
    }
  };

  remove = async (fileName) => {
    try {

      const response = await axios.delete(`${this.url}/files/${fileName}`, {
        headers: this.headers
      });
      process.stdout.write("\x1b[32mFile removed successfully\x1b[0m\n");
    } catch (error) {
      process.stdout.write("\x1b[31mFile remove failed\x1b[0m\n");
    }
  };

  schedule = async (taskId, fileName, cronTime) => {
    try {
      const isValid = cron.validate(cronTime);

      if (!isValid) {
        process.stdout.write("\x1b[31mInvalid cron time\x1b[0m\n");
        return;
      }

      const jobs = JSON.parse(this.cronJobs);
      jobs[taskId] = {
        fileName: fileName,
        cronTime: cronTime,
      };

      cron.schedule(cronTime, this.backup);
      fs.writeFileSync(`${this.configDir}/cron_jobs.json`, JSON.stringify(jobs));
      process.stdout.write("\x1b[32mScheduled backup successfully\x1b[0m\n");
    }
    catch (error) {
      process.stdout.write("\x1b[31mScheduled backup failed\x1b[0m\n");
    }
  }

  backup = async () => {
    try {
      const jobs = JSON.parse(this.cronJobs);
      for (const taskId in jobs) {
        const job = jobs[taskId];
        const response = await axios.get(`${this.url}/files/${job.fileName}`, {
          headers: this.headers
        });
        fs.writeFileSync(`${job.fileName}`, response.data.data);
        process.stdout.write("\x1b[32mBackup completed successfully\x1b[0m\n");
      }
    } catch (error) {
      process.stdout.write("\x1b[31mBackup failed\x1b[0m\n");
    }
  }

  hashToken = (token) => {
    return sha1(token);
  };

  decodeToken = (hash) => {
    return Buffer.from(hash, "base64").toString("utf-8");
  };

  getFile = (fileName) => {
    return fs.existsSync(fileName) ? fs.readFileSync(fileName, "utf-8") : null;
  };

  getCredentials = () => {
    if (this.config) {
      const { body, password } = JSON.parse(this.config);
      process.stdout.write(`\x1b[32m${body}\x1b[0m\n`);
    } else {
      process.stdout.write("\x1b[31mNo credentials found\x1b[0m\n");
    }
  };
}

const cli = new CLI();
cli.run();
