# Story FORUM-6: Thread Detail & Thread Creation

## Overview

Build the thread detail page (`/forum/thread/[id]`) showing the full thread with replies, and the thread creation page (`/forum/new`) with category/subcategory picker, title, and rich text editor. These are the core interaction pages — reading and writing content.

**Source:** ADR-001 Sections 4.2, 10.1, 10.2

## Acceptance Criteria

### Thread Detail Page (`/forum/thread/[id]`)
- [x] **Given** a user navigates to `/forum/thread/[uuid]`, **Then** they see: thread title, author info (avatar, name, cargo badge, posted date), thread body (rich HTML), category/subcategory tags, view count, like count
- [x] **Given** the thread detail, **Then** below the thread body there is a replies section showing all comments ordered by created_at ASC
- [x] **Given** replies on a thread, **Then** each reply shows: author info (avatar, name, cargo badge), content, like count, reply timestamp
- [x] **Given** replies, **Then** nested replies (parent_id != null) are indented to show threading (reuse existing comment-section nesting logic)
- [x] **Given** the thread detail, **Then** there is a reply input area at the bottom (reuse existing rich-editor or a simplified text area)
- [x] **Given** a thread with `is_solved: true`, **Then** a "[RESOLVIDO]" badge is displayed next to the title
- [x] **Given** a thread with `is_sticky: true`, **Then** a pin indicator is displayed
- [x] **Given** the thread detail, **Then** the thread author can mark any reply as "solution" (sets is_solved=true on the thread and highlights that reply)
- [x] **Given** the thread detail, **Then** like/save reactions work on both the thread and individual replies (reuse existing reactions logic)
- [x] **Given** the thread detail page, **Then** the topbar breadcrumb updates to show: Forum > [Category] > [Subcategory] > [Thread Title truncated]

### Thread Creation Page (`/forum/new`)
- [x] **Given** a logged-in user navigates to `/forum/new`, **Then** they see a form with: category selector, subcategory selector (filtered by category), title input, rich text editor (body), tags input (optional), submit button
- [x] **Given** the thread creation form, **When** user selects a category, **Then** the subcategory dropdown updates to show only subcategories of that category
- [x] **Given** URL query params `?category=slug&sub=slug`, **When** the page loads, **Then** category and subcategory are pre-selected
- [x] **Given** the form is submitted with valid data, **Then** a new post is created with: type='thread', category_id, subcategory_id, title, content, author_id=current user
- [x] **Given** successful thread creation, **Then** user is redirected to the new thread's detail page
- [x] **Given** the form, **Then** title is required (min 5 chars), category is required, body is required (min 20 chars)
- [x] **Given** the form, **Then** the rich editor supports: bold, italic, code blocks, links, lists, headings (reuse existing rich-editor.tsx)

### Component Adaptation
- [x] **Given** the existing `comment-section.tsx`, **When** used in thread context, **Then** it renders replies with the same nesting logic but styled as forum replies (not social media comments)
- [x] **Given** the existing `rich-editor.tsx`, **When** used in thread creation, **Then** it works as-is for the thread body
- [x] **Given** the existing `create-post.tsx` patterns, **When** adapted for thread creation, **Then** it adds title field + category/sub pickers above the editor

## Scope

### IN
- Route: `src/app/(dashboard)/forum/thread/[id]/page.tsx` (thread detail)
- Route: `src/app/(dashboard)/forum/new/page.tsx` (thread creation)
- Component: `src/components/forum/thread-detail.tsx` (thread header + body + metadata)
- Component: `src/components/forum/thread-reply.tsx` (individual reply in thread)
- Component: `src/components/forum/thread-create-form.tsx` (category picker + title + editor)
- Adapt `comment-section.tsx` for thread reply context
- Reuse `rich-editor.tsx` for thread body
- Supabase INSERT for thread creation
- Supabase SELECT with JOINs for thread detail
- "Mark as solution" functionality
- Reaction (like/save) on threads and replies

### OUT
- Real-time reply updates (Phase 2)
- Thread editing after creation (Phase 2)
- Thread deletion (admin-only, Phase 2)
- Image/file uploads in threads (Phase 2)
- @mentions in replies (Phase 2)
- Thread polls (Phase 2)

## Dependencies
- **FORUM-1** (database tables)
- **FORUM-4** (topbar breadcrumb updates for thread context)
- **FORUM-5** (thread list items link to this detail page)

## Complexity
**M (Medium)** — 2 routes, 3 new components, reuse of existing editor/comments, form validation, mark-as-solution logic

## Assigned Agent
@developer (Dex)

## Technical Notes
- Thread detail: Server Component for initial data fetch, Client Components for interactive parts (reply form, reactions)
- Mark as solution: UPDATE posts SET is_solved=true WHERE id=thread_id (only if current user = thread author)
- Reply creation: INSERT INTO comments (post_id, author_id, content) — same as existing comment creation
- Category/sub picker: fetch categories on mount, filter subcategories client-side when category changes
- Tags input: simple comma-separated text input, stored as TEXT[] in posts.tags
- Rich editor: the existing Tiptap editor should work as-is
- Thread body rendering: use the same HTML rendering approach as existing post content

## File List
- `src/app/(dashboard)/forum/thread/[id]/page.tsx` — Thread detail page (server component)
- `src/app/(dashboard)/forum/new/page.tsx` — Thread creation page
- `src/components/forum/thread-detail.tsx` — Thread header + body + metadata component
- `src/components/forum/thread-reply.tsx` — Individual reply with nesting, like, mark-as-solution
- `src/components/forum/thread-reply-composer.tsx` — Bottom reply textarea composer
- `src/components/forum/thread-actions.tsx` — Like/Save/Share action bar for thread
- `src/components/forum/thread-create-form.tsx` — Full creation form with category picker + editor

## Status
- [x] Draft
- [x] Validated (Ready)
- [x] In Progress
- [x] Done

## Change Log
| Date | Change | Agent |
|------|--------|-------|
| 2026-03-31 | Story created from ADR-001 | @sprint-lead (River) |
| 2026-03-31 | Batch validated: GO (9/10). Status Draft -> Ready. | @product-lead (Pax) |
| 2026-03-31 | Implemented: thread detail page, thread creation page, 4 new components, build passes. Status Ready -> Done. | @developer (Dex) |
