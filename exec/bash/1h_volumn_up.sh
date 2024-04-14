#!/bin/zsh

# Set volume to maximum
osascript -e "set volume output volume 50"

# Wait for 1 hour
sleep 7200

# Set volume to mute
osascript -e "set volume output volume 0"