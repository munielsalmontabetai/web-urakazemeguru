/**
 * tweet.ts
 *
 * react-tweetを使用する際、URLフォーマットからステータスIDのみを抽出するヘルパー関数群
 */

/**
 * X (Twitter) のURLまたはID文字列を受け取り、ステータスIDのみを抽出して返します。
 * すでにID文字列である場合はそのまま返します。
 * @param urlOrId クライアントが設定したURLまたはID
 * @returns 抽出されたステータスID文字列、判定できない場合は元の文字列
 */
export function extractTweetId(urlOrId: string): string {
  // x.com または twitter.com から始まるステータスURLの正規表現
  const tweetRegex = /(?:x\.com|twitter\.com)\/(?:.*?)\/status\/(\d+)/;
  const match = urlOrId.match(tweetRegex);
  
  if (match && match[1]) {
    return match[1];
  }
  
  // マッチしない場合は、すでにIDとして入力されているとみなす
  // （URLの形式ではない、数字だけのものなど）
  return urlOrId;
}
