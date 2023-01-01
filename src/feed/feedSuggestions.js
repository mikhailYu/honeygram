import { FeedSuggestsUser } from "./feedSuggestsUser";
export function FeedSuggestions() {
  return (
    <div className="feedSuggestsCont">
      <p>Suggestions For You</p>
      <div className="feedSuggestsList">
        <FeedSuggestsUser />
        <FeedSuggestsUser />
        <FeedSuggestsUser />
        <FeedSuggestsUser />
        <FeedSuggestsUser />
      </div>
    </div>
  );
}
