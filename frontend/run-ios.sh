#!/bin/bash
cd "$(dirname "$0")"
export PATH="/opt/homebrew/bin:$HOME/.nvm/versions/node/$(ls $HOME/.nvm/versions/node/ 2>/dev/null | tail -1)/bin:$PATH"
npx react-native run-ios --workspace ios/HabitsApp.xcworkspace --scheme HabitsApp
