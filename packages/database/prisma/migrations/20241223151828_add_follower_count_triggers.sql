-- Function to update follower counts
CREATE OR REPLACE FUNCTION update_user_follower_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment follower count for followed user
    UPDATE "User" 
    SET "totalFollowers" = "totalFollowers" + 1
    WHERE id = NEW."followingId";
    
    -- Increment following count for follower
    UPDATE "User"
    SET "totalFollowing" = "totalFollowing" + 1
    WHERE id = NEW."followerId";
    
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement follower count for followed user
    UPDATE "User"
    SET "totalFollowers" = "totalFollowers" - 1
    WHERE id = OLD."followingId";
    
    -- Decrement following count for follower
    UPDATE "User"
    SET "totalFollowing" = "totalFollowing" - 1
    WHERE id = OLD."followerId";
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_user_follower_counts_trigger
AFTER INSERT OR DELETE ON "Follower"
FOR EACH ROW
EXECUTE FUNCTION update_user_follower_counts();

-- Initialize counters for existing data
UPDATE "User" u
SET 
  "totalFollowers" = (SELECT COUNT(*) FROM "Follower" WHERE "followingId" = u.id),
  "totalFollowing" = (SELECT COUNT(*) FROM "Follower" WHERE "followerId" = u.id); 