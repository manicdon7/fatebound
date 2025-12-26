export function parseStoryResponse(rawText) {
  const text = typeof rawText === "string" ? rawText : "";

  const storyLabel = /\bSTORY:\s*/i;
  const suggestionsLabel = /\bSUGGESTIONS:\s*/i;

  const storyIdx = text.search(storyLabel);
  const suggestionsIdx = text.search(suggestionsLabel);

  let story = "";
  let suggestionsBlock = "";

  if (storyIdx !== -1 && suggestionsIdx !== -1 && suggestionsIdx > storyIdx) {
    const storyPart = text.slice(storyIdx, suggestionsIdx);
    story = storyPart.replace(storyLabel, "").trim();
    suggestionsBlock = text.slice(suggestionsIdx).replace(suggestionsLabel, "").trim();
  } else if (storyIdx !== -1) {
    story = text.slice(storyIdx).replace(storyLabel, "").trim();
  } else {
    story = text.trim();
  }

  const suggestions = suggestionsBlock
    .split("\n")
    .map((line) => line.replace(/^\s*(?:[-*•]|\d+\.|\d+\)|\(?[a-c]\)|\(?[a-c]\.)\s*/i, "").trim())
    .filter(Boolean)
    .slice(0, 3);

  const safeStory = story || "The world seems to hesitate, but then gathers itself. Something must still happen...";

  const safeSuggestions = suggestions.length
    ? suggestions
    : [
        "Look around carefully",
        "Call out to see if anyone answers",
        "Take a cautious step forward",
      ];

  return {
    story: safeStory,
    suggestions: safeSuggestions.slice(0, 3),
  };
}
