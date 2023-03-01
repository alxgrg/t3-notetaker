# T3 Notetaker app

Based on the T3 Stack tutorial [here](https://www.youtube.com/watch?v=J1gzN1SAhyM) by [Jack Herrington](https://github.com/jherr)

## Description

A note taking app with auth and a code editor, built with the T3 Stack. Based on a great tutorial by Jack Herrington. I did some things differently, and added error handling and toasts for alerts.

### Built With

- [T3 Stack](https://create.t3.gg/)

  - [NextJs](https://nextjs.org/)
  - [Typescript](https://www.typescriptlang.org/)
  - [Tailwind](https://tailwindcss.com/)
  - [tRPC](https://trpc.io/)
  - [Prisma](https://prisma.io/)
  - [NextAuth](https://next-auth.js.org/)

- [daisyUI](https://daisyui.com/)
- [radix-ui](https://www.radix-ui.com/)
- [codemirror](https://codemirror.net/)
- [HeroIcons](https://heroicons.com/)

### Installing locally

```bash
# installation
$ git clone https://github.com/alxgrg/t3-notetaker.git
$ cd t3-notetaker
$ npm install
```

# Set up your .env variables...

- DATABASE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- DISCORD_CLIENT_ID
- DISCORD_CLIENT_SECRET
- GITHUB_ID
- GITHUB_SECRET

```bash
# sync Prisma schema with your database
$ npx prisma db push

# start docker postgreSQL image
$ docker compose up

# development mode
$ npm run dev

```

## Author

Alex George
[Email](mailto:alxmgrg@gmail.com)
