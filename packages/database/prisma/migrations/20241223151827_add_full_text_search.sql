-- Add tsvector columns
ALTER TABLE "Post" ADD COLUMN "titleSearch" tsvector
    GENERATED ALWAYS AS (to_tsvector('english', coalesce(title, ''))) STORED;
ALTER TABLE "Post" ADD COLUMN "contentSearch" tsvector
    GENERATED ALWAYS AS (to_tsvector('english', coalesce(content, ''))) STORED;

ALTER TABLE "Comment" ADD COLUMN "contentSearch" tsvector
    GENERATED ALWAYS AS (to_tsvector('english', coalesce(content, ''))) STORED;

ALTER TABLE "Tag" ADD COLUMN "nameSearch" tsvector
    GENERATED ALWAYS AS (to_tsvector('english', coalesce(name, ''))) STORED;

-- Create GIN indexes for fast full-text search
CREATE INDEX "Post_titleSearch_idx" ON "Post" USING GIN ("titleSearch");
CREATE INDEX "Post_contentSearch_idx" ON "Post" USING GIN ("contentSearch");
CREATE INDEX "Comment_contentSearch_idx" ON "Comment" USING GIN ("contentSearch");
CREATE INDEX "Tag_nameSearch_idx" ON "Tag" USING GIN ("nameSearch");

-- Create combined search function for posts
CREATE OR REPLACE FUNCTION search_posts(search_query text)
RETURNS TABLE (
    id text,
    title text,
    content text,
    rank float4
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.content,
        ts_rank(p.titleSearch, websearch_to_tsquery('english', search_query)) * 2 +
        ts_rank(p.contentSearch, websearch_to_tsquery('english', search_query)) as rank
    FROM "Post" p
    WHERE 
        p.titleSearch @@ websearch_to_tsquery('english', search_query) OR
        p.contentSearch @@ websearch_to_tsquery('english', search_query)
    ORDER BY rank DESC;
END;
$$ LANGUAGE plpgsql;

-- Create search function for comments
CREATE OR REPLACE FUNCTION search_comments(search_query text)
RETURNS TABLE (
    id text,
    content text,
    rank float4
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.content,
        ts_rank(c.contentSearch, websearch_to_tsquery('english', search_query)) as rank
    FROM "Comment" c
    WHERE c.contentSearch @@ websearch_to_tsquery('english', search_query)
    ORDER BY rank DESC;
END;
$$ LANGUAGE plpgsql; 