# Database design

## Table design

- User can create many Groups, Group can have many Users
- User can be Editor, Moderator, Admin
- User can create many Posts, Post can have many Comments and Images
- User can create Comments on Posts
- User can like, share, up vote, down vote a Post
- User can Tag a Post
- Tag have two type: Tag or Category
- Tag can have many Images
- Comments can be nested
- Tag can be nested (Child & Parent relationship)
- User can like, share, up vote, down vote, book mark, pin a Post
- User can like, share, up vote, down vote a Comment
- User can follow/unfollow other users
- User can follow/unfollow a tag
- Post can be STANDARD, ASIDE, GALLERY, LINK, IMAGE, QUOTE, STATUS, VIDEO, AUDIO, POLL
- Post's status can be: DRAFT, PUBLISHED, ARCHIVED, TRASHED, BLOCKED
- User's status can be: UNVERIFIED, VERIFIED, BLOCKED


```mermaid
erDiagram
    User {
        String id PK
        String name
        String email UK
        String username UK
        String bio
        String password
        UserStatus userStatus
    }

    Group {
        String id PK
        String name UK
        String description
        String ownerId FK
        DateTime createdAt
        DateTime updatedAt
        DateTime deletedAt
    }

    UserOnGroup {
        String userId FK
        String groupId FK
        GroupRole role
    }

    Post {
        String id PK
        String title
        String content
        PostStatus postStatus
        String authorId FK
        DateTime createdAt
        DateTime updatedAt
        DateTime deletedAt
    }

    Comment {
        String id PK
        String content
        String authorId FK
        String commentOnPostId FK
        String parentCommentId FK
        DateTime createdAt
        DateTime updatedAt
        DateTime deletedAt
    }

    Tag {
        String id PK
        String name UK
        TagType type
        String parentTagId FK
    }

    Media {
        String id PK
        String path
        String name
        Int width
        Int height
        String format
        String previewUrl
        String caption
        String url
        String mime
        String userId FK
    }

    Account {
        String id PK
        String userId FK
        String provider
        String providerAccountId UK
        String refresh_token
        String access_token
        Int expires_at
    }

    Session {
        String id PK
        String sessionToken UK
        String userId FK
        DateTime expires
    }

    User ||--o{ Group : "creates"
    User ||--o{ UserOnGroup : "joins"
    Group ||--o{ UserOnGroup : "has"
    User ||--o{ Post : "writes"
    User ||--o{ Comment : "writes"
    Post ||--o{ Comment : "has"
    User ||--o{ PostOnUser : "interacts"
    Post ||--o{ PostOnUser : "receives"
    User ||--o{ CommentOnUser : "interacts"
    Comment ||--o{ CommentOnUser : "receives"
    User ||--o{ Follower : "follows"
    User ||--o{ Account : "has"
    User ||--o{ Session : "has"
    Post ||--o{ TagOnPost : "tagged_with"
    Tag ||--o{ TagOnPost : "tags"
    Tag ||--o{ UserOnTag : "followed_by"
    User ||--o{ UserOnTag : "follows"
    User ||--o{ Media : "uploads"
    Post ||--o{ Media : "contains"
    Tag ||--o{ Media : "has"
```
