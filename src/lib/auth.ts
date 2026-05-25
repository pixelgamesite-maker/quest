export function getXAuthUrl() {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: import.meta.env.VITE_X_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_X_REDIRECT_URI,
    scope: "tweet.read users.read follows.read like.read",
    state: crypto.randomUUID(),
    code_challenge: "challenge",
    code_challenge_method: "plain",
  });
  return `https://twitter.com/i/oauth2/authorize?${params}`;
}

export function getDiscordAuthUrl(state = "collab") {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_DISCORD_REDIRECT_URI,
    response_type: "code",
    scope: "identify guilds",
    state,
  });
  return `https://discord.com/api/oauth2/authorize?${params}`;
}
