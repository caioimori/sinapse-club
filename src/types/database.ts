export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "free" | "pro" | "premium" | "admin" | "instructor";
export type Locale = "pt-BR" | "en";
export type PostType = "post" | "curated" | "announcement" | "poll";
export type SpaceType = "curated" | "ugc" | "mixed";
export type SpaceAccess = "free" | "pro" | "premium";
export type CurationSource = "x" | "reddit" | "rss" | "docs" | "youtube" | "newsletter";
export type TranslationStatus = "pending" | "translated" | "failed" | "manual";
export type CourseType = "perpetual" | "launch" | "mini";
export type LessonType = "video" | "text" | "quiz";
export type EnrollmentStatus = "active" | "refunded" | "expired";
export type LessonProgressStatus = "not_started" | "in_progress" | "completed";
export type SubscriptionPlan = "free" | "pro" | "premium";
export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled" | "unpaid";
export type EventType = "live" | "office_hours" | "workshop" | "ama";
export type EventAccess = "free" | "pro" | "premium" | "course";
export type ReactionType = "like" | "save";
export type ReactionTarget = "post" | "comment";
export type RsvpStatus = "confirmed" | "maybe" | "canceled";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          role: UserRole;
          locale: Locale;
          interests: string[];
          points: number;
          streak_days: number;
          streak_last: string | null;
          onboarded: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          role?: UserRole;
          locale?: Locale;
          interests?: string[];
          points?: number;
          streak_days?: number;
          streak_last?: string | null;
          onboarded?: boolean;
        };
        Update: {
          username?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          role?: UserRole;
          locale?: Locale;
          interests?: string[];
          points?: number;
          streak_days?: number;
          streak_last?: string | null;
          onboarded?: boolean;
        };
      };
      spaces: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          icon: string | null;
          type: SpaceType;
          access: SpaceAccess;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          slug: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          type?: SpaceType;
          access?: SpaceAccess;
          sort_order?: number;
          is_active?: boolean;
        };
        Update: {
          slug?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          type?: SpaceType;
          access?: SpaceAccess;
          sort_order?: number;
          is_active?: boolean;
        };
      };
      posts: {
        Row: {
          id: string;
          author_id: string;
          space_id: string;
          title: string | null;
          content: string;
          content_plain: string | null;
          type: PostType;
          is_pinned: boolean;
          is_locked: boolean;
          likes_count: number;
          comments_count: number;
          views_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          author_id: string;
          space_id: string;
          title?: string | null;
          content: string;
          content_plain?: string | null;
          type?: PostType;
          is_pinned?: boolean;
          is_locked?: boolean;
        };
        Update: {
          title?: string | null;
          content?: string;
          content_plain?: string | null;
          type?: PostType;
          is_pinned?: boolean;
          is_locked?: boolean;
        };
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          author_id: string;
          parent_id: string | null;
          content: string;
          likes_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          post_id: string;
          author_id: string;
          parent_id?: string | null;
          content: string;
        };
        Update: {
          content?: string;
        };
      };
      reactions: {
        Row: {
          id: string;
          user_id: string;
          target_type: ReactionTarget;
          target_id: string;
          type: ReactionType;
          created_at: string;
        };
        Insert: {
          user_id: string;
          target_type: ReactionTarget;
          target_id: string;
          type: ReactionType;
        };
        Update: never;
      };
      curated_content: {
        Row: {
          id: string;
          source: CurationSource;
          source_id: string | null;
          source_url: string;
          source_author: string | null;
          original_text: string;
          translated_text: string | null;
          original_lang: string;
          translated_lang: string | null;
          summary: string | null;
          title: string | null;
          category: string | null;
          tags: string[];
          relevance_score: number;
          translation_status: TranslationStatus;
          is_published: boolean;
          published_as_post: string | null;
          fetched_at: string;
          translated_at: string | null;
          published_at: string | null;
          created_at: string;
        };
        Insert: {
          source: CurationSource;
          source_id?: string | null;
          source_url: string;
          source_author?: string | null;
          original_text: string;
          translated_text?: string | null;
          original_lang?: string;
          translated_lang?: string | null;
          summary?: string | null;
          title?: string | null;
          category?: string | null;
          tags?: string[];
          relevance_score?: number;
          translation_status?: TranslationStatus;
          is_published?: boolean;
        };
        Update: {
          translated_text?: string | null;
          summary?: string | null;
          relevance_score?: number;
          translation_status?: TranslationStatus;
          is_published?: boolean;
          published_as_post?: string | null;
          translated_at?: string | null;
          published_at?: string | null;
        };
      };
      courses: {
        Row: {
          id: string;
          instructor_id: string;
          slug: string;
          title: string;
          description: string | null;
          thumbnail_url: string | null;
          type: CourseType;
          price_cents: number;
          currency: string;
          stripe_price_id: string | null;
          is_published: boolean;
          is_featured: boolean;
          total_lessons: number;
          total_duration_minutes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          instructor_id: string;
          slug: string;
          title: string;
          description?: string | null;
          thumbnail_url?: string | null;
          type?: CourseType;
          price_cents?: number;
          currency?: string;
          stripe_price_id?: string | null;
          is_published?: boolean;
          is_featured?: boolean;
          total_lessons?: number;
          total_duration_minutes?: number;
        };
        Update: {
          slug?: string;
          title?: string;
          description?: string | null;
          thumbnail_url?: string | null;
          type?: CourseType;
          price_cents?: number;
          stripe_price_id?: string | null;
          is_published?: boolean;
          is_featured?: boolean;
          total_lessons?: number;
          total_duration_minutes?: number;
        };
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          stripe_payment_id: string | null;
          status: EnrollmentStatus;
          enrolled_at: string;
          completed_at: string | null;
        };
        Insert: {
          user_id: string;
          course_id: string;
          stripe_payment_id?: string | null;
          status?: EnrollmentStatus;
        };
        Update: {
          status?: EnrollmentStatus;
          completed_at?: string | null;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_customer_id: string;
          stripe_subscription_id: string | null;
          plan: SubscriptionPlan;
          status: SubscriptionStatus;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at: string | null;
          canceled_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          stripe_customer_id: string;
          stripe_subscription_id?: string | null;
          plan?: SubscriptionPlan;
          status?: SubscriptionStatus;
          current_period_start?: string | null;
          current_period_end?: string | null;
        };
        Update: {
          plan?: SubscriptionPlan;
          status?: SubscriptionStatus;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at?: string | null;
          canceled_at?: string | null;
        };
      };
    };
    Functions: {
      user_has_access: {
        Args: { required_access: string };
        Returns: boolean;
      };
    };
  };
}
