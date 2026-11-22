# Comic Mono

The regular and bold fonts come from [dtinth/comic-mono-font at commit 13eb162](https://github.com/dtinth/comic-mono-font/tree/13eb162648d01d61ece424088dbf750ec80a1a62).
Both upstream TTF files report Version 0.1.1 in name record 5.

Converted the TTF files without subsetting. Used FontTools 4.60.1 and Brotli 1.1.0
with `TTFont(path, recalcTimestamp=False)`, set `font.flavor = "woff2"`, then saved
each font with its original basename and a `.woff2` extension.

See [LICENSE](LICENSE) for the upstream MIT license and notices.
