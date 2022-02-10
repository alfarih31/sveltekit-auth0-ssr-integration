# Material UI Dashboard Template using `Sveltekit`

## Prerequisites

1. Node.js v12

## Set-up

### Development Config

1. Copy [.env.example](.env.example) as [.env](.env)

```bash
cp ./.env.example ./.env
```

2. Belows are available configurations:

| Key               | Description            | Required | Values |
| ----------------- | ---------------------- | -------- | ------ |
| `VITE_APP_NAME`   | Application name's     | **✓**    | String |
| `VITE_PUBLIC_URL` | Application public url | **✓**    | String |

### Install Dependencies

```bash
npm install
```

## Development

### Start App Development Runtime

```bash
npm run dev
```

### Ejecting `sass` to static `css`

Use this after edit any sass on [src/assets/scss](src/assets/scss) to make changes effect

```bash
npm run eject
```
