#!/usr/bin/env bash

INSTALL_DIR="/usr/local/bin"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ ! -d "$INSTALL_DIR" ]; then
  echo -e "\e[31mInstall directory $INSTALL_DIR does not exist\e[0m"
  exit 1
fi

if [ -f "$INSTALL_DIR/fmc" ]; then
  echo -e "\e[31mFile Manager CLI is already installed in $INSTALL_DIR\e[0m"
  exit 1
fi

echo -e "\e[33mInstalling File Manager CLI...\e[0m"
sudo chmod u+x run.js
mv run.js fmc
sudo ln -s "$DIR/fmc" "$INSTALL_DIR"
echo -e "\e[32mFile Manager CLI installed to $INSTALL_DIR\e[0m"
echo "Run 'fmc help' to get started"
