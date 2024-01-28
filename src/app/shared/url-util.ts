import {FShareSource, HlsSource, OtherSource, Source, YouTubeSource} from "../data/models/source";

export class UrlUtil {
  static YOUTUBE_SCHEME = "yt://";
  static FSHARE_SCHEME = "fs://";
  static HLS_SCHEME = "hls://";

  static getAllUrlParams(url: string) {

    // get query string from url (optional) or window
    let queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    const obj = {};

    // if query string exists
    if (queryString) {

      // stuff after # is not part of query string, so get rid of it
      queryString = queryString.split('#')[0];

      // split our query string into its component parts
      const arr = queryString.split('&');

      for (let i = 0; i < arr.length; i++) {
        // separate the keys and the values
        let a = arr[i].split('=');

        // set parameter name and value (use 'true' if empty)
        let paramName = a[0];
        let paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

        // (optional) keep case consistent

        // if the paramName ends with square brackets, e.g. colors[] or colors[2]
        if (paramName.match(/\[(\d+)?]$/)) {

          // create key if it doesn't exist
          let key = paramName.replace(/\[(\d+)?]/, '');
          if (!obj[key]) obj[key] = [];

          // if it's an indexed array e.g. colors[2]
          if (paramName.match(/\[\d+]$/)) {
            // get the index value and add the entry at the appropriate position
            let index = /\[(\d+)]/.exec(paramName)[1];
            obj[key][index] = paramValue;
          } else {
            // otherwise add the value to the end of the array
            obj[key].push(paramValue);
          }
        } else {
          // we're dealing with a string
          if (!obj[paramName]) {
            // if it doesn't exist, create property
            obj[paramName] = paramValue;
          } else if (obj[paramName] && typeof obj[paramName] === 'string') {
            // if property does exist and it's a string, convert it to an array
            obj[paramName] = [obj[paramName]];
            obj[paramName].push(paramValue);
          } else {
            // otherwise add the property
            obj[paramName].push(paramValue);
          }
        }
      }
    }

    return obj;
  }

  static parse(url: string): Source {
    url = String(url);
    const urlParams = UrlUtil.getAllUrlParams(url);
    if (url.startsWith(UrlUtil.YOUTUBE_SCHEME)) {
      return new YouTubeSource(url["name"], UrlUtil.getContentId(url, UrlUtil.YOUTUBE_SCHEME));
    }
    if (url.startsWith(UrlUtil.FSHARE_SCHEME)) {
      return new FShareSource(
        urlParams["name"],
        UrlUtil.getContentId(url, UrlUtil.FSHARE_SCHEME),
        urlParams["qua"],
        urlParams["aud"] == null ? "unknown" : urlParams["audio"],
        urlParams["sub"] == null ? "none" : urlParams["sub"],
      );
    }
    if (url.startsWith(UrlUtil.HLS_SCHEME)) {
      return new HlsSource(urlParams["name"], UrlUtil.getContentId(url, UrlUtil.HLS_SCHEME));
    }
    return new OtherSource(
      urlParams["name"],
      url,
      urlParams["qua"],
      urlParams["aud"] == null ? "unknown" : urlParams["aud"],
      urlParams["sub"] == null ? "none" : urlParams["sub"],
    );
  }

  static getContentId(url: string, scheme: string) {
    return (url.indexOf("?") > 0) ? url.substring(scheme.length, url.indexOf("?")) : url.substring(scheme.length);
  }
}
