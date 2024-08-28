#!/usr/bin/env bash

INSTALL_DIR="/usr/local/bin"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo -e "\e[33mInstalling File Manager CLI...\e[0m"
sudo cp fmc "$INSTALL_DIR"
echo -e "\e[32mFile Manager CLI installed to $INSTALL_DIR\e[0m"
echo "Run 'fmc help' to get started"
rm -rf "$DIR"