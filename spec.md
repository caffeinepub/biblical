# Biblical

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Story feed: browse all work/earning stories from the community
- Story creation: submit a story with title, body, work category, and daily earnings amount
- Story detail view: read a full story with like/upvote count
- Like/upvote stories
- User profiles: view stories by a specific author
- Sample seed stories on first load

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: Story entity (id, author principal, authorName, title, body, workCategory, earningsAmount, currency, createdAt, likes)
2. Backend APIs: createStory, getStories, getStory, likeStory, getStoriesByAuthor, setDisplayName
3. Frontend: Home feed page, story card component, create story page/modal, story detail page, user profile page
4. Auth: use authorization component so users can post and like under their identity
