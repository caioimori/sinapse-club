export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "free" | "pro" | "premium" | "admin" | "instructor";
export type Locale = "pt-BR" | "en";
export type PostType = "post" | "curated" | "announcement" | "poll" | "repost" | "reply" | "thread";
export type SpaceType = "curated" | "ugc" | "mixed";
export type SpaceAccess = "free" | "pro" | "premium";
export type ForumAccess = "free" | "pro" | "premium";
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
export type ProfessionalCluster = "c-level" | "management" | "specialist" | "operational" | "freelancer" | "entrepreneur" | "student";
export type BadgeType = "milestone" | "level" | "achievement" | "cargo" | "manual";
export type BadgeRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
export type MarketplaceType = "hiring" | "offering" | "collaboration";
export type ThreadSort = "latest" | "popular" | "unsolved" | "unanswered";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          header_url: string | null;
          bio: string | null;
          role: UserRole;
          locale: Locale;
          interests: string[];
          points: number;
          xp: number;
          level: number;
          streak_days: number;
          streak_last: string | null;
          streak_shields: number;
          followers_count: number;
          following_count: number;
          github_username: string | null;
          github_url: string | null;
          github_repos: Json;
          website_url: string | null;
          location: string | null;
          onboarded: boolean;
          professional_role_id: string | null;
          company: string | null;
          headline: string | null;
          threads_count: number;
          replies_count: number;
          reputation: number;
          featured_badge_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          header_url?: string | null;
          bio?: string | null;
          role?: UserRole;
          locale?: Locale;
          interests?: string[];
          points?: number;
          xp?: number;
          level?: number;
          streak_days?: number;
          streak_last?: string | null;
          streak_shields?: number;
          github_username?: string | null;
          github_url?: string | null;
          github_repos?: Json;
          website_url?: string | null;
          location?: string | null;
          onboarded?: boolean;
          professional_role_id?: string | null;
          company?: string | null;
          headline?: string | null;
        };
        Update: {
          username?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          header_url?: string | null;
          bio?: string | null;
          role?: UserRole;
          locale?: Locale;
          interests?: string[];
          points?: number;
          xp?: number;
          level?: number;
          streak_days?: number;
          streak_last?: string | null;
          streak_shields?: number;
          github_username?: string | null;
          github_url?: string | null;
          github_repos?: Json;
          website_url?: string | null;
          location?: string | null;
          onboarded?: boolean;
          professional_role_id?: string | null;
          company?: string | null;
          headline?: string | null;
          featured_badge_id?: string | null;
        };
      };
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          follower_id: string;
          following_id: string;
        };
        Update: never;
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
      forum_categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          icon: string | null;
          color: string | null;
          sort_order: number;
          access: ForumAccess;
          is_active: boolean;
          threads_count: number;
          posts_count: number;
          last_thread_id: string | null;
          last_thread_at: string | null;
          created_at: string;
        };
        Insert: {
          slug: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          sort_order?: number;
          access?: ForumAccess;
          is_active?: boolean;
        };
        Update: {
          slug?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          sort_order?: number;
          access?: ForumAccess;
          is_active?: boolean;
          threads_count?: number;
          posts_count?: number;
          last_thread_id?: string | null;
          last_thread_at?: string | null;
        };
      };
      forum_subcategories: {
        Row: {
          id: string;
          category_id: string;
          slug: string;
          name: string;
          description: string | null;
          icon: string | null;
          sort_order: number;
          access: ForumAccess;
          is_active: boolean;
          threads_count: number;
          posts_count: number;
          last_thread_id: string | null;
          last_thread_at: string | null;
          created_at: string;
        };
        Insert: {
          category_id: string;
          slug: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          sort_order?: number;
          access?: ForumAccess;
        };
        Update: {
          slug?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          sort_order?: number;
          access?: ForumAccess;
          is_active?: boolean;
          threads_count?: number;
          posts_count?: number;
          last_thread_id?: string | null;
          last_thread_at?: string | null;
        };
      };
      professional_roles: {
        Row: {
          id: string;
          slug: string;
          name: string;
          cluster: ProfessionalCluster;
          icon: string | null;
          sort_order: number;
          is_active: boolean;
        };
        Insert: {
          slug: string;
          name: string;
          cluster: ProfessionalCluster;
          icon?: string | null;
          sort_order?: number;
        };
        Update: {
          slug?: string;
          name?: string;
          cluster?: ProfessionalCluster;
          icon?: string | null;
          sort_order?: number;
          is_active?: boolean;
        };
      };
      badges: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          icon: string;
          type: BadgeType;
          requirement_type: string | null;
          requirement_value: number | null;
          rarity: BadgeRarity;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          slug: string;
          name: string;
          icon: string;
          type: BadgeType;
          description?: string | null;
          requirement_type?: string | null;
          requirement_value?: number | null;
          rarity?: BadgeRarity;
        };
        Update: {
          slug?: string;
          name?: string;
          description?: string | null;
          icon?: string;
          type?: BadgeType;
          requirement_type?: string | null;
          requirement_value?: number | null;
          rarity?: BadgeRarity;
          is_active?: boolean;
        };
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          awarded_at: string;
          awarded_by: string | null;
        };
        Insert: {
          user_id: string;
          badge_id: string;
          awarded_by?: string | null;
        };
        Update: never;
      };
      levels: {
        Row: {
          level: number;
          name: string;
          xp_required: number;
          perks: string[];
          badge_id: string | null;
          color: string | null;
        };
        Insert: {
          level: number;
          name: string;
          xp_required: number;
          perks?: string[];
          badge_id?: string | null;
          color?: string | null;
        };
        Update: {
          name?: string;
          xp_required?: number;
          perks?: string[];
          badge_id?: string | null;
          color?: string | null;
        };
      };
      posts: {
        Row: {
          id: string;
          author_id: string;
          space_id: string | null;
          category_id: string | null;
          subcategory_id: string | null;
          title: string | null;
          content: string;
          content_plain: string | null;
          type: PostType;
          is_pinned: boolean;
          is_locked: boolean;
          is_solved: boolean;
          is_sticky: boolean;
          likes_count: number;
          comments_count: number;
          reposts_count: number;
          replies_count: number;
          views_count: number;
          repost_of: string | null;
          quote_of: string | null;
          reply_to: string | null;
          last_reply_at: string | null;
          last_reply_by: string | null;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          author_id: string;
          space_id?: string | null;
          category_id?: string | null;
          subcategory_id?: string | null;
          title?: string | null;
          content: string;
          content_plain?: string | null;
          type?: PostType;
          is_pinned?: boolean;
          is_locked?: boolean;
          is_solved?: boolean;
          is_sticky?: boolean;
          repost_of?: string | null;
          quote_of?: string | null;
          reply_to?: string | null;
          tags?: string[];
        };
        Update: {
          title?: string | null;
          content?: string;
          content_plain?: string | null;
          type?: PostType;
          is_pinned?: boolean;
          is_locked?: boolean;
          is_solved?: boolean;
          is_sticky?: boolean;
          last_reply_at?: string | null;
          last_reply_by?: string | null;
          tags?: string[];
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
      marketplace_listings: {
        Row: {
          id: string;
          author_id: string;
          type: MarketplaceType;
          title: string;
          description: string;
          category: string | null;
          budget_range: string | null;
          is_active: boolean;
          is_featured: boolean;
          views_count: number;
          responses_count: number;
          created_at: string;
          updated_at: string;
          expires_at: string | null;
        };
        Insert: {
          author_id: string;
          type: MarketplaceType;
          title: string;
          description: string;
          category?: string | null;
          budget_range?: string | null;
        };
        Update: {
          type?: MarketplaceType;
          title?: string;
          description?: string;
          category?: string | null;
          budget_range?: string | null;
          is_active?: boolean;
          is_featured?: boolean;
          expires_at?: string | null;
        };
      };
      tools: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          icon: string | null;
          url: string | null;
          access: ForumAccess;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          slug: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          url?: string | null;
          access?: ForumAccess;
          sort_order?: number;
        };
        Update: {
          slug?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          url?: string | null;
          access?: ForumAccess;
          sort_order?: number;
          is_active?: boolean;
        };
      };
      benefits: {
        Row: {
          id: string;
          partner_name: string;
          partner_logo: string | null;
          description: string | null;
          discount_text: string | null;
          url: string | null;
          coupon_code: string | null;
          access: ForumAccess;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          partner_name: string;
          partner_logo?: string | null;
          description?: string | null;
          discount_text?: string | null;
          url?: string | null;
          coupon_code?: string | null;
          access?: ForumAccess;
          sort_order?: number;
        };
        Update: {
          partner_name?: string;
          partner_logo?: string | null;
          description?: string | null;
          discount_text?: string | null;
          url?: string | null;
          coupon_code?: string | null;
          access?: ForumAccess;
          sort_order?: number;
          is_active?: boolean;
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
          included_in_premium: boolean;
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
          included_in_premium?: boolean;
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
          included_in_premium?: boolean;
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
      free_tier_limits: {
        Row: {
          id: string;
          user_id: string;
          period_start: string;
          threads_created: number;
        };
        Insert: {
          user_id: string;
          period_start?: string;
          threads_created?: number;
        };
        Update: {
          threads_created?: number;
        };
      };
    };
    Functions: {
      user_has_access: {
        Args: { required_access: string };
        Returns: boolean;
      };
      role_rank: {
        Args: { user_role: string };
        Returns: number;
      };
      user_has_course_access: {
        Args: { course_uuid: string };
        Returns: boolean;
      };
      user_can_create_thread: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
  };
}
