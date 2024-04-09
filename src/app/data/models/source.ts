export abstract class Source {
  protected constructor(
    public name: string,
    public url: string,
    public quality: string,
    public audio: string,
    public subtitle: string,
    public shortUrl: string
  ) {
  }

  abstract scheme: string
}

export class YouTubeSource extends Source {
  scheme: string = "yt://";

  constructor(name: string, public contentId: string) {
    super(name,
      `https://www.youtube.com/watch?v=${contentId}`,
      "auto",
      "auto",
      "auto",
      `yt://${contentId}?name=${name}`);
  }
}

export class FShareSource extends Source {
  scheme: string = "fs://";

  toShortUrl(): string {
    return `${this.scheme}${this.contentId}?name=${this.name}&qua=${this.quality}&aud=${this.audio}&sub=${this.subtitle}`
  }

  constructor(name: string, public contentId: string, quality: string, audio: string, subtitle: string) {
    super(name,
      `https://www.fshare.vn/file/${contentId}`,
      quality,
      audio,
      subtitle,
      `fs://${contentId}?name=${name}&qua=${quality}&aud=${audio}&sub=${subtitle}`
    );
  }
}

export class DailymotionSource extends Source {
  scheme: string = "dai://";

  constructor(name: string, public contentId: string) {
    super(name,
      `https://www.dailymotion.com/video/${contentId}`,
      "auto",
      "auto",
      "auto",
      `dai://${contentId}?name=${name}`);
  }
}

export class GDriveSource extends Source {
  scheme: string = "gd://";

  constructor(name: string, public contentId: string) {
    super(name,
      `https://www.googleapis.com/drive/v3/files/${contentId}?alt=media&key=AIzaSyDrQoYphLoyLUHL_7o9C2tV7f5Zhit0XkI`,
      "auto",
      "auto",
      "auto",
      `gd://${contentId}?name=${name}`);
  }
}

export class HlsSource extends Source {
  scheme: string = "hls://";

  static toShortUrl(originUrl: string, name: string, quality: string, audio: string, subtitle: string): string {
    const url = originUrl.substring(originUrl.indexOf("://"));
    if (url.indexOf("?")) {
      url.concat(`&name=${name}&qua=${quality}&aud=${audio}&sub=${subtitle}`)
    } else {
      url.concat(`?name=${name}&qua=${quality}&aud=${audio}&sub=${subtitle}`)
    }
    return `hls://${url}`;
  }

  constructor(name: string, url: string) {
    super(name,
      url,
      "auto",
      "auto",
      "auto",
      HlsSource.toShortUrl(url, name, "auto", "auto", "auto")
    );
  }
}

export class OtherSource extends Source {
  scheme: string = "https://";

  constructor(name: string, url: string, quality: string, audio: string, subtitle: string) {
    super(name, url, quality, audio, subtitle, url);
  }
}
