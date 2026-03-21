/**
 * types/userConfig.ts
 *
 * userConfig の型定義を行うファイルです。
 */

export interface PlatformConfig {
  enabled: boolean;
  channelId: string;
  apiKey?: string;
  clientId?: string;
  secretId?: string;
}

export interface HistoryEvent {
  date: string;
  title: string;
  category: "milestone" | "event" | string;
}

export interface LinkItem {
  label: string;
  url: string;
  icon: string;
  description: string;
}

export interface UserConfig {
  platforms: {
    youtube: PlatformConfig;
    twitch: PlatformConfig;
  };
  site: {
    title: string;
    description: string;
    themeStyle: "elegant" | "idol" | "japanese" | string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
    background: string;
    text: string;
  };
  fonts: {
    text: string;
    design: string;
  };
  profile: {
    name: string;
    nameEn: string;
    concept: string;
    bio: string;
    catchphrase: string;
    details: {
      birthday: string;
      debut: string;
      height: string;
      likes: string[];
      dislikes: string[];
    };
    hashtags: {
      id: string;
      label: string;
      tag: string;
    }[];
    fanName: string;
    fanMark: string;
    introductionVideoId: string;
    tags: string[];
    history: HistoryEvent[];
  };
  links: {
    x: string;
    xSub?: string;
    youtube: string;
    twitch?: string;
    litlink?: string;
    email?: string;
    others?: LinkItem[];
  };
  photos: {
    variants: string[];
  };
  fanarts: {
    enabled: boolean;
    tweets: string[];
  };
  guideline?: {
    enabled: boolean;
    sections: {
      title: string;
      content: string;
    }[];
  };
}
