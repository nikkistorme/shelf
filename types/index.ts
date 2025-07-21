export { };

declare global {

  interface Goal {
    start_date: string
    goal_date: string
    target_page: number
  }

  interface Update {
    field: string
    new_value: string | number | boolean | null | Goal
    old_value: string | number | boolean | null | Goal
    new_value_soft: string | number | boolean | null
  }

  interface Change {
    action: string
    created: string
    updates: Update[]
  }

  interface Readthrough {
    end: string
    start: string
    changes: Change[]
  }

  enum Status {
    Unread = "unread",
    InProgress = "in_progress",
    Finished = "finished",
  }

  interface UserBook {
    id: number | null
    inserted_at: string | null
    updated_at: string | null
    title: string | null
    author: string | null
    description: string | null
    goal: Goal | null
    cover: string | null
    current_page: number | null
    total_pages: number | null
    user_id: string | null
    base: number | null
    shelves: number[] | null
    changes: Change[] | null
    minutes_per_page: number | null
    status: Status | null
    readthroughs: Readthrough[] | null
  }

  interface BookEdition {
    id: number | null
    inserted_at: string | null
    updated_at: string | null
    title: string | null
    total_pages: number | null
    author: string | null
    description: string | null
    cover: string | null
    published: string | null
    published_original: string | null
    publisher: string | null
    isbn: string | null
    isbn13: string | null
    average_rating: number | null
  }

  interface Shelf {
    id: number
    inserted_at: string
    updated_at: string
    name: string
    user_id: string
    sort: {
      method: string
      descending: boolean
    }
    book_count: number
    locked_type: 'unread' | 'in_progress' | 'finished' | 'all_books' | null
  }

  interface MiscUpdateParam {
    endAt: number
    duration: number
    oldGoal: Goal
    targetPage: number
    goalDate: string
    cover: string
    total_pages: number | null
  }
    
}