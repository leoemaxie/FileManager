#!/usr/bin/env bash

VERSION="1.0.0"
CMD=(login upload download sync backup restore)

usage() {
  echo "Usage: fmc <command> [options]"
  echo
  echo "Commands:"
  echo "  login     Connect to the server"
  echo "  upload    Upload a file to the server"
  echo "  download  Download a file from the server"
  echo "  sync      Sync a directory with the server"
  echo "  backup    Backup a directory to the server"
  echo "  restore   Restore a directory from the server"
  echo "  help [command]  Show help message for a command"
  echo
  echo "Options:"
  echo "  -h, --help      Show this help message and exit"
  echo "  -v, --version   Show version information and exit"
  echo
}

version() {
  echo "Version: $VERSION"
}

help() {
  echo "File Manager CLI version $VERSION"
  echo "A tool to upload, sync, backup and download files from the command line"
  usage
  exit 0
}

help_cmd() {
  case $1 in
    login)
      echo "Usage: fmc login [options]"
      echo
      echo "Options:"
      echo "  -u, --username  Username to login with"
      echo "  -p, --password  Password to login with"
      echo
      ;;
    upload)
      echo "Usage: fmc upload [options] <file>"
      echo
      echo "Options:"
      echo "  -d, --directory  Directory to upload the file to"
      echo
      ;;
    download)
      echo "Usage: fmc download [options] <file>"
      echo
      echo "Options:"
      echo "  -d, --directory  Directory to download the file to"
      echo
      ;;
    sync)
      echo "Usage: fmc sync [options] <directory>"
      echo
      echo "Options:"
      echo "  -d, --directory  Directory to sync with the server"
      echo
      ;;
    backup)
      echo "Usage: fmc backup [options] <directory>"
      echo
      echo "Options:"
      echo "  -d, --directory  Directory to backup to the server"
      echo
      ;;
    restore)
      echo "Usage: fmc restore [options] <directory>"
      echo
      echo "Options:"
      echo "  -d, --directory  Directory to restore from the server"
      echo
      ;;
    *)
      echo "Command not found"
      usage
      exit 1
      ;;
  esac
}

check_cmd() {
  for cmd in "${CMD[@]}"; do
    if [ "$1" == "$cmd" ]; then
      return 0
    fi
  done
  return 1
}

check_cmd_options() {
  case $1 in
    login)
      if [ "$2" == "-u" ] || [ "$2" == "--username" ] || [ "$4" == "-p" ] || [ "$4" == "--password" ]; then
        return 0
      fi
      ;;
    upload)
      if [ "$2" == "-d" ] || [ "$2" == "--directory" ]; then
        return 0
      fi
      ;;
    download)
      if [ "$2" == "-d" ] || [ "$2" == "--directory" ]; then
        return 0
      fi
      ;;
    sync)
      if [ "$2" == "-d" ] || [ "$2" == "--directory" ]; then
        return 0
      fi
      ;;
    backup)
      if [ "$2" == "-d" ] || [ "$2" == "--directory" ]; then
        return 0
      fi
      ;;
    restore)
      if [ "$2" == "-d" ] || [ "$2" == "--directory" ]; then
        return 0
      fi
      ;;
    *)
      return 1
      ;;
  esac
}

run_cmd() {
  if ! check_cmd; then
    echo "Command not found"
    usage
    exit 1
  elif ! check_cmd_options; then
    echo "Invalid option"
    help_cmd
    exit 1
  else
    if node -v &> /dev/null; then
       node cli.js
    else
       echo "Node.js is required to run this tool"
       exit 1
    fi
  fi
}

check_cmd() {
  if ! check_cmd_options; then
    echo "Invalid command"
    help_cmd
    exit 1
  fi
}

if [ $# -eq 0 ]; then
  usage
  exit 1
fi

if [ "$1" == "-h" ] || [ "$1" == "--help" ]; then
  help
  exit 0
fi

if [ "$1" == "-v" ] || [ "$1" == "--version" ]; then
  version
  exit 0
fi

if [ "$1" == "help" ]; then
  if [ $# -eq 1 ]; then
    help
  else
    help_cmd $2
  fi
  exit 0
fi

run_cmd