export const CHAT_HISTORY_LIMIT = 10;

export function buildSupportHistory(messages) {
  return messages
    .filter((message, index) => {
      const followedByFailedReply = message.role === "user" && messages[index + 1]?.state === "error";
      return !message.isIntro && message.state !== "error" && !followedByFailedReply;
    })
    .slice(-CHAT_HISTORY_LIMIT)
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      content: message.content,
    }));
}
