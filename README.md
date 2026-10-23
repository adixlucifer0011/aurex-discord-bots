# AUREX Discord Management Hub

AUREX is a dark, futuristic Discord management hub for inviting and configuring multiple bots from one workspace.

## Current implementation

The project intentionally preserves the existing plain HTML/CSS/JavaScript foundation. The public landing page and dashboard shell are implemented with a mock data layer so the full interaction model can be reviewed before external credentials and database provisioning are added.

The dashboard includes Overview, Bot Hub, Servers, Music, Guard, Greet, Levels, Tickets, Embeds + Reaction Roles, Commands, Logs, Analytics, Team Access, and Settings tabs. The Bot Hub includes mock invite, configure, toggle, add-bot, and invite-all flows.

## Local development

```bash
npm run dev
```

The server listens on port 3000. The mock API is available at `/api/session`, `/api/guilds`, `/api/bots`, and `/api/invites`.

## Production wiring plan

Use Discord OAuth2 code flow server-side with `identify guilds`, a state parameter, token exchange, httpOnly cookies, CSRF protection, and permission re-checks on every guild API call. Store bots, guilds, guild_bots, guild_settings, and audit_logs in PostgreSQL. Bot services should write guild join/leave state to guild_bots and expose small internal authenticated HTTP endpoints for live actions.

Copy `.env.example` to `.env` and fill secrets only when wiring those services. Never expose OAuth secrets, session secrets, database URLs, or bot tokens to browser code.
