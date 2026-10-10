# Live chat setup

The public website uses the official tawk.to widget. The contact button and
bottom-right launcher open the same conversation inside the website. The widget
is downloaded only when a visitor chooses to open chat, and persists between
public-site pages. It is not mounted in Sanity Studio.

## Connect the account

1. Create/verify the business account at <https://dashboard.tawk.to/signup>.
2. Create the Huamei property for `https://huamei.io`.
3. Open **Administration → Channels → Chat Widget** and copy the embed URL.
   Its shape is `https://embed.tawk.to/PROPERTY_ID/WIDGET_ID`.
4. Set these public variables locally and in the intended Vercel environments:

   ```dotenv
   NEXT_PUBLIC_TAWK_PROPERTY_ID=
   NEXT_PUBLIC_TAWK_WIDGET_ID=
   ```

   Use the two actual identifiers from that URL. Do not paste the script HTML
   or account/API credentials. Missing or malformed IDs hide both chat entries.
5. Restart local development; rebuild/deploy after changing Vercel variables.
   Next.js embeds `NEXT_PUBLIC_` values at build time.

## Make it a live service

Keep the tawk.to dashboard or its mobile app signed in while handling enquiries.
Set agent availability to Online during actual staffed hours and configure the
widget language, greeting, business hours, and notification settings in tawk.to.
Set widget colours to Huamei ink `#1A1614` and paper `#F4EFE6` if desired.

The website never assumes an agent is online. Before the widget loads it says
“Chat with us”; afterwards it uses tawk.to's online/away/offline status. Outside
staffed hours, the provider can show its clearly identified offline form. Live
chat requires an available agent to reply. No visitor message is automatically
sent by the integration.

## Validate before release

- With the real IDs, open `/house#contact`; confirm no tawk request occurs
  before choosing chat. Click the contact button and confirm the real widget
  opens on desktop and mobile without CSP errors.
- With an available agent, send an explicitly authorized test conversation and
  confirm both directions, notifications, and continued conversation after a
  page change. Close and reopen the panel; there must be only one widget.
- Check the dashboard's Offline status is displayed honestly.
- Block the embed request: the page should show a connection error and a link
  to the existing project form. Unblock and choose Retry live chat.
- Visit `/studio` and confirm the website launcher is absent.

The provider may process chat messages and visitor/device information after
chat is opened. See the website privacy notice and the account's data settings.

Official references: [JavaScript API](https://developer.tawk.to/jsapi/),
[CSP requirements](https://help.tawk.to/article/why-are-images-not-showing-up-in-the-widget).

## Connection verification — 2026-10-09

The Huamei account/property and real embed configuration are connected locally
and configured in Vercel Production, Preview and Development. An explicitly
authorized internal conversation passed both directions in Chrome: the site
message reached the dashboard, and the agent reply appeared in the visitor
widget. The conversation remained after navigation between Contact and Begin.
The confirmed version was deployed on 2026-10-09. The 2026-10-10 release brings
those changes into the production Git branch so later automated content
deployments retain the live-chat integration.
