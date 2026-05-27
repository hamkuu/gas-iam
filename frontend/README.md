# Frontend for Gas IAM

## Tech Stack

- React
- TypeScript
- Vite

## Getting-started

```bash
npm run dev
```

## Lint

```bash
npm run lint
```

## Sync OpenAPI scheme with backend

```bash
npm run gen:openapi
```

## Deployment

```bash
docker buildx build --platform linux/amd64 --push \
  -t asia-northeast1-docker.pkg.dev/gas-iam/gas-iam/frontend:latest \
  ./frontend
docker push asia-northeast1-docker.pkg.dev/gas-iam/gas-iam/frontend:latest
```

## References

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)
  uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc)
  uses [SWC](https://swc.rs/)
