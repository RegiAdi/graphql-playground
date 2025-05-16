-- Function to increment achievement points for a character
CREATE OR REPLACE FUNCTION increment_achievement_points(char_id UUID, points_to_add INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE characters
  SET achievement_points = achievement_points + points_to_add
  WHERE id = char_id;
END;
$$ LANGUAGE plpgsql;
