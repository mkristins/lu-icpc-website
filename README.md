# lu-icpc-website

Repozitorijs `lu-icpc-website` satur visu kvalifikācijas darba kodu.

Lai ar Prisma ORM izveidotu jaunu datu bāzes migrāciju, jālieto komanda:

```bash
prisma migrate dev --name init
```

Lai testētu vai izstrādātu programmu, var piepildīt datu bāzi ar paraugdatiem.
```bash
npx prisma db push --force-reset && npx prisma db seed
```
