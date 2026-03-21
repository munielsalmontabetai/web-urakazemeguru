import { z } from "zod";

// 配信ステータスの定義
export const StreamStatusSchema = z.enum(["live", "upcoming", "none"]);
export type StreamStatus = z.infer<typeof StreamStatusSchema>;

// 配信プラットフォームの定義
export const PlatformSchema = z.enum(["youtube", "twitch"]);
export type Platform = z.infer<typeof PlatformSchema>;

// ストリーミングアイテムの共通スキーマ
export const StreamItemSchema = z.object({
  id: z.string(),
  platform: PlatformSchema,
  status: StreamStatusSchema,
  title: z.string(),
  thumbnailUrl: z.string(),
  url: z.string(),
  scheduledStartTime: z.string().optional(),
  actualStartTime: z.string().optional(),
  viewerCount: z.number().optional(),
});

export type StreamItem = z.infer<typeof StreamItemSchema>;

// 配信スケジュール全体の返り値
export const StreamScheduleResultSchema = z.object({
  activeStream: StreamItemSchema.optional(), // 現在配信中のもの（もしあれば）
  upcomingStreams: z.array(StreamItemSchema), // 今後の予定
  recentArchives: z.array(StreamItemSchema), // 最近のアーカイブ
  updatedAt: z.string(),
});

export type StreamScheduleResult = z.infer<typeof StreamScheduleResultSchema>;
