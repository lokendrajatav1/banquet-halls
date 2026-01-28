const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const halls = await prisma.banquetHall.findMany();
  if (!halls || halls.length === 0) {
    console.log('No banquet halls found in the database.');
    return;
  }

  console.log('Banquet halls:');
  halls.forEach((h) => {
    console.log(`${h.id} - ${h.name} -> http://localhost:3000/customer/halls/${h.id}`);
  });
}

main()
  .catch((e) => {
    console.error('Error listing halls:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
