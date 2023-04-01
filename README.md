# `animate-transcript`

This is a simple project to generate animated transcript from an audio recording. You can use a
screen recording tool to record the animation to have [a video like Descript's](https://www.descript.com/social-video).

## Getting Started
This project depends on [gentle](https://github.com/lowerquality/gentle), a tool for aligning speech with text, running inside Docker. You will need to have Docker installed in your system to run this project.

```bash
# start gentle service, running as a Docker container
pnpm gentle:start

# start a cors proxy and the next.js app
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with Google Chrome and start recording!

If you are done with the project, you can stop the `gentle` container with the following command:
```bash
pnpm gentle:stop
```

## How it works
- The Next.js app uses the [MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder) and [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) APIs to create an audio recording, along with the text transcripts.
- The audio file and the text transcript is sent to a locally running `gentle` service. `gentle` will
send back a JSON containing recognized words along with the timestamp it was spoken at in the recording.
- The JSON, along with the audio recording is used by the `<Player />` component to animate the transcript.
