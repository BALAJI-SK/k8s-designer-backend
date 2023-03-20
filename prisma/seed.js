const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      fullName: 'Alice',
      email: 'alice@prisma.io',
      password: 'abcd',
      salt: '1234',
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
      fullName: 'bob',
      email: 'bob@prisma.io',
      password: 'abcd',
      salt: '1234',
    },
  });
  console.log({ alice, bob });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });