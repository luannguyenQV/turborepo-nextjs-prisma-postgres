-- Function to update post vote counts
CREATE OR REPLACE FUNCTION update_post_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.type = 'UPVOTE' THEN
      UPDATE "Post" 
      SET "upVotesCount" = "upVotesCount" + 1
      WHERE id = NEW."postId";
    ELSIF NEW.type = 'DOWNVOTE' THEN
      UPDATE "Post"
      SET "downVotesCount" = "downVotesCount" + 1
      WHERE id = NEW."postId";
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.type = 'UPVOTE' THEN
      UPDATE "Post"
      SET "upVotesCount" = "upVotesCount" - 1
      WHERE id = OLD."postId";
    ELSIF OLD.type = 'DOWNVOTE' THEN
      UPDATE "Post"
      SET "downVotesCount" = "downVotesCount" - 1
      WHERE id = OLD."postId";
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update comment vote counts
CREATE OR REPLACE FUNCTION update_comment_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.type = 'UPVOTE' THEN
      UPDATE "Comment"
      SET "upVotesCount" = "upVotesCount" + 1
      WHERE id = NEW."commentId";
    ELSIF NEW.type = 'DOWNVOTE' THEN
      UPDATE "Comment"
      SET "downVotesCount" = "downVotesCount" + 1
      WHERE id = NEW."commentId";
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.type = 'UPVOTE' THEN
      UPDATE "Comment"
      SET "upVotesCount" = "upVotesCount" - 1
      WHERE id = OLD."commentId";
    ELSIF OLD.type = 'DOWNVOTE' THEN
      UPDATE "Comment"
      SET "downVotesCount" = "downVotesCount" - 1
      WHERE id = OLD."commentId";
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update post like counts
CREATE OR REPLACE FUNCTION update_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE "Post" 
    SET "likesCount" = "likesCount" + 1
    WHERE id = NEW."postId";
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE "Post"
    SET "likesCount" = "likesCount" - 1
    WHERE id = OLD."postId";
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update post comment counts
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE "Post"
    SET "commentsCount" = "commentsCount" + 1
    WHERE id = NEW."commentOnPostId";
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE "Post"
    SET "commentsCount" = "commentsCount" - 1
    WHERE id = OLD."commentOnPostId";
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Add function to update post share counts
CREATE OR REPLACE FUNCTION update_post_share_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.type = 'SHARE' THEN
      UPDATE "Post" 
      SET "sharesCount" = "sharesCount" + 1
      WHERE id = NEW."postId";
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.type = 'SHARE' THEN
      UPDATE "Post"
      SET "sharesCount" = "sharesCount" - 1
      WHERE id = OLD."postId";
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_post_vote_count_trigger
AFTER INSERT OR DELETE ON "PostOnUser"
FOR EACH ROW
WHEN (NEW.type IN ('UPVOTE', 'DOWNVOTE') OR OLD.type IN ('UPVOTE', 'DOWNVOTE'))
EXECUTE FUNCTION update_post_vote_count();

CREATE TRIGGER update_comment_vote_count_trigger
AFTER INSERT OR DELETE ON "CommentOnUser"
FOR EACH ROW
WHEN (NEW.type IN ('UPVOTE', 'DOWNVOTE') OR OLD.type IN ('UPVOTE', 'DOWNVOTE'))
EXECUTE FUNCTION update_comment_vote_count();

CREATE TRIGGER update_post_like_count_trigger
AFTER INSERT OR DELETE ON "PostOnUser"
FOR EACH ROW
WHEN (NEW.type = 'LIKE' OR OLD.type = 'LIKE')
EXECUTE FUNCTION update_post_like_count();

CREATE TRIGGER update_post_comment_count_trigger
AFTER INSERT OR DELETE ON "Comment"
FOR EACH ROW
EXECUTE FUNCTION update_post_comment_count();

-- Add new trigger for share counts
CREATE TRIGGER update_post_share_count_trigger
AFTER INSERT OR DELETE ON "PostOnUser"
FOR EACH ROW
WHEN (NEW.type = 'SHARE' OR OLD.type = 'SHARE')
EXECUTE FUNCTION update_post_share_count(); 