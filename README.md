

# Building your own from statch


## server

mkdir server; cd server
npm init -y
// https://www.typescriptlang.org/download
npm install typescript ts-node @types/node --save-dev
npx tsc --init

```
    "sourceMap": true,
    "outDir": "dist",
    "strict": true,

    "esModuleInterop": true
```

// https://trpc.io/docs/v10/quickstart#installation-snippets
npm install @trpc/server@next @trpc/client@next @trpc/react@next @trpc/next@next @tanstack/react-query --save
npm install zod --save

// add file

## Mongo Typescript ORM
https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/mongodb-typescript-mongodb
npx prisma
npx prisma init



// run watch
npx ts-node ./trcpRouter.