# Locally generated AI voices

Original game dialogue and tutorial scripts are rendered locally by `tools/render-voices.py`. Only the finished MP3 files are shipped. The browser downloads a requested clip, plays one voice at a time, ducks the soundtrack and stops speech on mute, scene changes or a hidden tab. No speech generation API is called during play.

- Model: Kokoro-82M v1.0, Apache-2.0 licensed weights: https://huggingface.co/hexgrad/Kokoro-82M
- CPU renderer: kokoro-onnx 0.6.0, MIT: https://github.com/thewh1teagle/kokoro-onnx
- Model export and voice styles: the maintainer's `model-files-v1.1` release.
- Presets: `af_heart` for narration and Mira; `am_michael` for Arjun; `bf_emma` for Leena.
- Clip text, duration and SHA-256 are recorded in `voice-lines.json`.

Large model weights and rendering dependencies are development tools and are not part of the hosted game or repository.
