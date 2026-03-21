export type HistoryCategory = "milestone" | "event";

export interface HistoryItem {
  date: string;
  title: string;
  category: HistoryCategory;
}
