export default function commands(obj) {
  obj.command = {
    login: this.login.bind(obj),
    upload: this.upload.bind(obj),
    download: this.download.bind(obj),
    list: this.list.bind(obj),
    remove: this.remove.bind(obj),
    schedule: this.schedule.bind(obj),
  };
}
