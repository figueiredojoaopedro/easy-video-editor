## Features

- Join multiple MP4 videos into a single file
- Cut videos at specific timestamps to create multiple segments
- Process videos efficiently using FFmpeg
- Simple and easy-to-use API

## Prerequisites

- Node.js installed on your system
- FFmpeg installed:
  - MacOS: `brew install ffmpeg`
  - Linux: `sudo apt install ffmpeg`
  - Windows: Download from [FFmpeg official website](https://www.ffmpeg.org/download.html)

## Installation

1. Clone the repository

git clone https://github.com/figueiredojoaopedro/easy-video-editor.git

2. Install dependecies

npm install fluent-ffmpeg

## Usage

1. Joining videos
   Place your MP4 videos in the input directory and run the joiner function

2. Cutting videos
   Cut a video at specific timestamps using seconds

3. Increase volume
   Increase video's audio volume using the volume function at audio.js

4. Convert a video to mp4
   Convert a given video to mp4

## Directory Structure

/input - Place input videos here
/output - Processed videos will be saved here
/src/processor - Contains video processing modules

## Contributing

- Fork the repository
- Create your feature branch
- Commit your changes
- Push to the branch
- Create a new Pull Request

## Dependencies:

- fluent-ffmpeg => npm install fluent-ffmpeg
- ffmpeg => https://www.ffmpeg.org/download.html, if you are using macos brew install ffmpeg and if you are on linux sudo apt install ffmpeg

This README provides clear instructions for installation, usage examples, and project structure. Let me know if you'd like to add or modify any sections!
