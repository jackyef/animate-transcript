<video src="./videos/result.mp4"></video>

# `animate-transcript`

This is a simple project to generate animated transcript from an audio recording. You can use a
screen recording tool to record the animation to have [a video like Descript's](https://www.descript.com/social-video).

This project doesn't generate a video automatically. You can use a screen recording tool of your choice to
record the animation. Refer to [the demo video](./videos/demo.mp4) to see the basic functionality.

## Getting Started
This project depends on [gentle](https://github.com/lowerquality/gentle), a tool for aligning speech with text, running inside Docker. You will need to have Docker installed in your system to run this project.

```bash
# start gentle service, running as a Docker container
pnpm gentle:start

# start a cors proxy and the next.js app
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with Google Chrome and start recording!

If you are done with the app, you can stop the `gentle` container with the following command:
```bash
pnpm gentle:stop
```

## Is there a free version hosted somewhere?
No, at least not at the time. If you'd like to do it, it should be pretty easy to do so though. The Next.js app should be able to be hosted on [Vercel](https://vercel.com/) for free. Then it's just a matter of finding a cloud provider of your choice to run the gentle Docker container and the cors proxy.

## How it works
- The Next.js app uses the [MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder) and [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) APIs to create an audio recording, along with the text transcripts.
- The audio file and the text transcript is sent to a locally running `gentle` service. `gentle` will
send back a JSON containing recognized words along with the timestamp it was spoken at in the recording.
- The JSON, along with the audio recording is used by the `<Player />` component to animate the transcript.

## Customizing the aesthethics
If you would like to customize the stylings and make it more personalized to your brand, take a look at
the [src/components/Player](./src/components/Player) directory. 
