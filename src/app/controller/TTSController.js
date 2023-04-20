const status = require("http-status");
const speechSDK = require("microsoft-cognitiveservices-speech-sdk");
const config = require("../config/app");

exports.speak = async (req, res) => {
  const { text } = req.body;
  const subscriptionKey = config.subscription_key;
  const region = config.service_region;
  const speechConfig = speechSDK.SpeechConfig.fromSubscription(
    subscriptionKey,
    region
  );
  speechConfig.speechSynthesisLanguage = "ja-JP";
  // speechConfig.speechSynthesisVoiceName = "zh-CN-XiaoyouNeural";
  speechConfig.speechSynthesisVoiceName = "ja-JP-AoiNeural";

  const synthesizer = new speechSDK.SpeechSynthesizer(speechConfig, undefined);
  // synthesizer.speakTextAsync(
  //   text,
  //   async (result) => {
  //     if (result.reason === speechSDK.ResultReason.SynthesizingAudioCompleted) {
  //       console.log(result.audioData);
  //       const audioData = result.audioData;
  //       res.contentType("audio/wav").send(audioData);
  //     } else {
  //       res
  //         .status(status.SERVICE_UNAVAILABLE)
  //         .json({ error: "Error synthesizing speech" });
  //     }
  //     synthesizer.close();
  //     return;
  //   },
  //   async (error) => {
  //     res.status(status.SERVICE_UNAVAILABLE).json({ error });
  //     synthesizer.close();
  //     return;
  //   }
  // );
  const result = await new Promise((resolve, reject) => {
    synthesizer.speakTextAsync(
      text,
      (result) => {
        if (result) {
          // console.log(result.audioData);
          // console.log(result.audioDuration);
          resolve(result.audioData);
        } else {
          reject(new Error("No audio data received."));
        }
      },
      (error) => reject(error)
    );
  });
  synthesizer.close();
  res.status(status.OK).contentType("audio/wav").send(Buffer.from(result));
};
