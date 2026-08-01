export type SentimentLabel = 'positive' | 'neutral' | 'negative';
export type BiasLabel = 'left' | 'center' | 'right' | 'mixed' | 'unclear';
export type LogLevel = 'info' | 'warn' | 'error';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Source {
  id: string;
  name: string;
  listing_url: string;
  parser_strategy: string | null;
  active: boolean;
  logo_url: string | null;
  created_at: string;
}

export interface Article {
  id: string;
  source_id: string;
  url: string;
  canonical_url: string;
  title: string;
  image_url: string;
  published_at: string;
  raw_text: string;
  scraped_at: string;
  analyzed_at: string | null;
}

export interface ArticleAnalysis {
  id: string;
  article_id: string;
  summary: string;
  sentiment_score: number;
  sentiment_label: SentimentLabel;
  bias_score: number;
  bias_label: BiasLabel;
  left_percentage: number;
  center_percentage: number;
  right_percentage: number;
  confidence: number;
  framing_notes: string | null;
  loaded_terms: Json;
  disclaimer: string | null;
  model: string;
  created_at: string;
}

export interface Log {
  id: string;
  level: LogLevel;
  message: string;
  metadata: Json;
  created_at: string;
}

export interface OxylabsSchedule {
  id: string;
  source_id: string;
  oxylabs_schedule_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface OxylabsScheduleRun {
  id: string;
  schedule_id: string;
  oxylabs_job_id: string | null;
  status: string;
  articles_scraped: number;
  error_message: string | null;
  created_at: string;
}

// Joined / Composite Types
export interface ArticleWithSource extends Article {
  source: Source;
}

export interface ArticleWithAnalysis extends Article {
  source: Source;
  analysis: ArticleAnalysis | null;
}

export interface ArticleDetail extends Article {
  source: Source;
  analysis: ArticleAnalysis;
}

// DTO Input types
export type InsertSourceInput = {
  id?: string;
  name: string;
  listing_url: string;
  parser_strategy?: string | null;
  active?: boolean;
  logo_url?: string | null;
  created_at?: string;
};

export type InsertArticleInput = {
  id?: string;
  source_id: string;
  url: string;
  canonical_url: string;
  title: string;
  image_url: string;
  published_at: string;
  raw_text: string;
  scraped_at?: string;
  analyzed_at?: string | null;
};

export type InsertAnalysisInput = {
  id?: string;
  article_id: string;
  summary: string;
  sentiment_score: number;
  sentiment_label: SentimentLabel;
  bias_score: number;
  bias_label: BiasLabel;
  left_percentage: number;
  center_percentage: number;
  right_percentage: number;
  confidence: number;
  framing_notes?: string | null;
  loaded_terms?: Json;
  disclaimer?: string | null;
  model: string;
  created_at?: string;
};

export type CreateLogInput = {
  level: LogLevel;
  message: string;
  metadata?: Record<string, unknown>;
};

// Database Schema
export type Database = {
  public: {
    Tables: {
      sources: {
        Row: Source;
        Insert: InsertSourceInput;
        Update: Partial<InsertSourceInput>;
        Relationships: [];
      };
      articles: {
        Row: Article;
        Insert: InsertArticleInput;
        Update: Partial<InsertArticleInput>;
        Relationships: [];
      };
      article_analyses: {
        Row: ArticleAnalysis;
        Insert: InsertAnalysisInput;
        Update: Partial<InsertAnalysisInput>;
        Relationships: [];
      };
      logs: {
        Row: Log;
        Insert: {
          id?: string;
          level: string;
          message: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          level?: string;
          message?: string;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      oxylabs_schedules: {
        Row: OxylabsSchedule;
        Insert: {
          id?: string;
          source_id: string;
          oxylabs_schedule_id: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<OxylabsSchedule>;
        Relationships: [];
      };
      oxylabs_schedule_runs: {
        Row: OxylabsScheduleRun;
        Insert: {
          id?: string;
          schedule_id: string;
          oxylabs_job_id?: string | null;
          status: string;
          articles_scraped?: number;
          error_message?: string | null;
          created_at?: string;
        };
        Update: Partial<OxylabsScheduleRun>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
