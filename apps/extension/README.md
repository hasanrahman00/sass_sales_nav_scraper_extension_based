# VikiLeads Chrome Extension

Port your v3 extension files here on Day 8.

## Auth Flow (API Key + Registered Profile)

1. User generates API key in dashboard (Settings → API Keys)
2. User pastes API key into extension popup, clicks [Save]
3. Extension generates a random profile_id, stored in chrome.storage.local
4. Extension calls POST /profiles/register with API key + profile_id
5. Server checks slot limit → assigns slot → registers profile
6. Extension stores: { apiKey, profileId, user, slot }
7. Every request sends: Authorization header + X-Profile-Id header
8. No heartbeat. No refresh. No expiry. Profile stays until removed.

## Remove a profile

- Extension: click [Remove] → DELETE /profiles/:profileId → slot freed
- Dashboard: Settings → Registered Profiles → [Remove] → slot freed
- Delete API key: all profiles under that key auto-deleted (CASCADE)
- Delete account: everything deleted (CASCADE)

## Files to port from v3:

- manifest.json (remove externally_connectable — not needed)
- background.js (remove getValidToken — just use apiCall with key + profileId)
- content-scripts/ (salesnav-inject.js, salesnav-collect.js, salesnav-scroll.js)
- sidepanel/ (panel.html, panel.js, panel.css)
- popup/ (popup.html + popup.js — add API key input + Save button)
- lib/ (parseSalesNav.js, offlineBuffer.js)
