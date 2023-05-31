# `Sveltekit` & `Auth0` - SSR integration

View the demo here 🥳🥳🥳

### [🎪🎪 auth0-ssr-sveltekit.vercel.app 🎪🎪](https://auth0-ssr-sveltekit.vercel.app/) ###

## Prerequisites

1. Node.js v16

## Set-up

### Development Config

1. Copy [.env.example](.env.example) as [.env](.env)

```bash
cp ./.env.example ./.env
```

2. Belows are available configurations:

| Key                   | Description                     | Required | Values |
|-----------------------|---------------------------------|----------|--------|
| `VITE_APP_NAME`       | Application name's              | **✓**    | String |
| `BASE_URL`            | Runtime baseURL                 | **✓**    | String |
| `ENCRYPT_SECRET`      | Encryption secret               | **✓**    | String |
| `AUTH0_DOMAIN`        | Auth0 application domain        | **✓**    | String |
| `AUTH0_CLIENT_ID`     | Auth0 application client id     | **✓**    | String |
| `AUTH0_CLIENT_SECRET` | Auth0 application client secret | **✓**    | String |

### Install Dependencies

```bash
npm install
```

## Development

### Start App Development Runtime

```bash
npm run dev
```

### Contributors ###

- Alfarih Faza <alfarihfz@gmail.com>
