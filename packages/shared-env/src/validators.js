// Duration string → milliseconds (kept synchronous, but you can make it async later)
export function parseDurationToMs(duration) {
  const match = duration.match(/^(\d+)(ms|[smhdwyMY])$/);
  if (!match) throw new Error(`Invalid duration format: ${duration}`);

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000,
    M: 30 * 24 * 60 * 60 * 1000,
    y: 365 * 24 * 60 * 60 * 1000,
  };

  if (!multipliers[unit]) throw new Error(`Unknown unit: ${unit}`);
  return value * multipliers[unit];
}

// Cookie options factory (uses parsed config, not global process.env)
export function createCookieOptions(
  accessExpiresIn,
  refreshExpiresIn,
  nodeEnv,
) {
  return {
    access: {
      httpOnly: true,
      secure: nodeEnv === "production",
      sameSite: "strict",
      maxAge: parseDurationToMs(accessExpiresIn),
    },
    refresh: {
      httpOnly: true,
      secure: nodeEnv === "production",
      sameSite: "strict",
      maxAge: parseDurationToMs(refreshExpiresIn),
    },
  };
}
