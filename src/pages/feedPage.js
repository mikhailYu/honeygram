import "../styles/feed.css";
import { FeedContent } from "../feed/feedContent";
import { FeedProfileHeader } from "../feed/feedProfileHeader";
import { FeedSuggestions } from "../feed/feedSuggestions";

export function Feed() {
  return (
    <div className="feedCont">
      <div className="feedLPad"></div>
      <div className="feedPostsCont">
        <FeedProfileHeader />
        <FeedContent />
        <FeedContent />
      </div>

      <FeedSuggestions />

      <div className="feedRPad"></div>
    </div>
  );
}
