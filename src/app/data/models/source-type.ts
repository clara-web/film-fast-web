import {UrlUtil} from "../../shared/url-util";
import {DailymotionSource, FShareSource, GDriveSource, HlsSource, OtherSource, YouTubeSource} from "./source";

export class SourceType {
  static OTHER = 0;
  static YOUTUBE = 1;
  static DAILYMOTION = 2;
  static FSHARE = 3;
  static GDRIVE = 4;
  static HLS = 5;

  private static prefix_dailymotion = "https://www.dailymotion.com/video/";
  private static prefix_dailymotion_short = "https://dai.ly/";
  private static prefix_youtube = "https://www.youtube.com/watch";
  private static prefix_fshare = "https://www.fshare.vn/file/";
  private static prefix_gdrive = "https://drive.google.com/file/d/";

  static determine(title: string, url: string) {
    if (url.startsWith(SourceType.prefix_youtube)) {
      return new YouTubeSource(title, UrlUtil.getAllUrlParams(url)["v"]);
    }
    if (url.startsWith(SourceType.prefix_dailymotion)) {
      let firstQueryParamIndex = url.indexOf("?")
      let contentId = url.substring(this.prefix_dailymotion.length,
        firstQueryParamIndex > 0 ? firstQueryParamIndex : url.length);
      return new DailymotionSource(title, contentId);
    }
    if (url.startsWith(SourceType.prefix_dailymotion_short)) {
      let firstQueryParamIndex = url.indexOf("?")
      let contentId = url.substring(this.prefix_dailymotion_short.length,
        firstQueryParamIndex > 0 ? firstQueryParamIndex : url.length);
      return new DailymotionSource(title, contentId);
    }
    if (url.startsWith(SourceType.prefix_fshare)) {
      let firstQueryParamIndex = url.indexOf("?")
      let contentId = url.substring(this.prefix_fshare.length,
        firstQueryParamIndex > 0 ? firstQueryParamIndex : url.length
      );
      return new FShareSource(title, contentId);
    }
    if (url.startsWith(SourceType.prefix_gdrive)) {
      let firstSlashIndex = url.indexOf("/", this.prefix_gdrive.length);
      let contentId = url.substring(this.prefix_gdrive.length, firstSlashIndex > 0 ? firstSlashIndex : url.length);
      return new GDriveSource(title, contentId);
    }
    if (url.endsWith(".m3u8")) {
      return new HlsSource(title, url);
    }
    return new OtherSource(title, url);
  }
}
