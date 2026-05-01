<div align=center>

<img src="./public/logo.svg" align="center" width="256">

# Apple Music-like Lyrics TTML Tool

A brand new word-by-word lyric editor! Designed specifically for the [Apple Music-like Lyrics ecosystem](https://github.com/amll-dev/applemusic-like-lyrics)!

<img width="1312" alt="image" src="https://github.com/user-attachments/assets/4db81b29-df0c-4f6e-819a-3b956b28247c">
<img width="1312" alt="image" src="https://github.com/user-attachments/assets/929eefee-ebda-43db-ad04-c0f099077053">
<img width="1312" alt="image" src="https://github.com/user-attachments/assets/7c80902e-45a9-42ae-b980-f5500069acb8">

[![Crowdin](https://badges.crowdin.net/very-cool-ttml-tool/localized.svg)](https://crowdin.com/project/very-cool-ttml-tool)

</div>

## Usage

> [!WARNING]
> This tool is not recommended for mobile phones or small screens, as the operation can be very cumbersome!

You can use the online version of this tool by visiting [`https://amll-ttml-tool.stevexmh.net/`](https://amll-ttml-tool.stevexmh.net/).

Visit the [test branch](https://amll-ttml-tool-test.vercel.app/) to experience the latest features and the latest BUGS!

You can also use the Tauri desktop version built via GitHub Actions; see [GitHub Action Build Tauri Desktop Version](https://github.com/NaeNaeTart/NaeNae-AMLL-TTML-TOOL/actions/workflows/build-desktop.yaml) for details.

## Editor Features

- Basic input, editing, and timing (alignment) functions
- Read and save TTML format lyrics
- Configure lyric line behavior (background lyrics, duet lyrics, etc.)
- Configure lyric file metadata (title, artist, Netease Cloud Music ID, etc.)
- Split/Combine/Move words
- Import and export various formats: LRC, ESLyric, YRC, QRC, Lyricify Syllable, etc.
- Support plain text import with special identifiers
- Customizable keyboard shortcuts

## Development & Build

Building this tool might be relatively complex. If the text description is too cumbersome, you can directly refer to the steps in the [`build-desktop.yaml`](.github/workflows/build-desktop.yaml) workflow.

First, this project only supports PNPM. Please ensure you have the PNPM package manager installed!

Then clone the repository and run the build in the repository folder:

```bash
pnpm i # Install dependencies
pnpm dev # Start development server
pnpm build # Build web version
pnpm tauri dev # Start Tauri desktop development environment
pnpm tauri build # Build Tauri desktop version
```

## Contribution

All active code and translation contributions are welcome! We also welcome bug reports and suggestions!

If you want to provide a new language translation, please refer to [`./src/i18n/index.ts`](./src/i18n/index.ts) and [`./locales/zh-CN/translation.json`](./locales/zh-CN/translation.json)!
