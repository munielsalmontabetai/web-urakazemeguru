import { z } from "zod";

// 配信ステータスの定義
export const StreamStatusSchema = z.enum(["live", "upcoming", "none"]);
export type StreamStatus = z.infer<typeof StreamStatusSchema>;

// 配信プラットフォームの定義
export const PlatformSchema = z.enum(["youtube", "twitch"]);
export type Platform = z.infer<typeof PlatformSchema>;

export const StreamCategorySchema = z.enum(["video", "short", "live"]);
export type StreamCategory = z.infer<typeof StreamCategorySchema>;

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
  category: StreamCategorySchema.optional(),
});

export type StreamItem = z.infer<typeof StreamItemSchema>;

// 配信スケジュール全体の返り値
export const StreamScheduleResultSchema = z.object({
  // 現在配信中のもの。同時配信（Twitch + YouTube、YouTubeで複数枠など）を
  // 取りこぼさないよう配列で保持する。配信していなければ空配列。
  activeStreams: z.array(StreamItemSchema),
  upcomingStreams: z.array(StreamItemSchema), // 今後の予定
  recentArchives: z.array(StreamItemSchema), // 最近のアーカイブ
  updatedAt: z.string(),
});

export type StreamScheduleResult = z.infer<typeof StreamScheduleResultSchema>;
