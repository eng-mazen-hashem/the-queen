import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding...');

  // 1. Create Categories
  const herbsCat = await prisma.category.upsert({
    where: { slug: 'herbs' },
    update: {},
    create: {
      name: 'أعشاب طبية',
      slug: 'herbs',
      description: 'مجموعة من الأعشاب الطبية الطبيعية لتعزيز الصحة والمناعة.',
    },
  });

  const spicesCat = await prisma.category.upsert({
    where: { slug: 'spices' },
    update: {},
    create: {
      name: 'بهارات طبخ',
      slug: 'spices',
      description: 'أفضل أنواع البهارات لإضافة نكهات مميزة لأطباقك.',
    },
  });

  const oilsCat = await prisma.category.upsert({
    where: { slug: 'oils' },
    update: {},
    create: {
      name: 'زيوت طبيعية',
      slug: 'oils',
      description: 'زيوت طبيعية 100% للعناية بالبشرة والشعر والطبخ.',
    },
  });

  // 2. Create Products
  const productsData = [
    {
      name: 'يانسون بلدي',
      slug: 'anise',
      description: 'يانسون بلدي نقي مهدئ للأعصاب ويساعد على الهضم.',
      categoryId: herbsCat.id,
      variants: [
        { weight: '50g', price: 15, stock: 100 },
        { weight: '100g', price: 25, stock: 100 },
        { weight: '250g', price: 50, stock: 100 },
      ]
    },
    {
      name: 'كركم مطحون',
      slug: 'turmeric',
      description: 'كركم طبيعي عالي الجودة مضاد للالتهابات.',
      categoryId: spicesCat.id,
      variants: [
        { weight: '50g', price: 10, stock: 100 },
        { weight: '100g', price: 18, stock: 100 },
        { weight: '250g', price: 40, stock: 100 },
      ]
    },
    {
      name: 'كمون بلدي',
      slug: 'cumin',
      description: 'كمون بلدي ذو رائحة قوية ونكهة ممتازة.',
      categoryId: spicesCat.id,
      variants: [
        { weight: '50g', price: 12, stock: 100 },
        { weight: '100g', price: 22, stock: 100 },
        { weight: '250g', price: 45, stock: 100 },
      ]
    },
    {
      name: 'زيت الزيتون البكر',
      slug: 'olive-oil',
      description: 'زيت زيتون بكر ممتاز عصرة أولى على البارد.',
      categoryId: oilsCat.id,
      variants: [
        { weight: '250ml', price: 40, stock: 50 },
        { weight: '500ml', price: 75, stock: 50 },
        { weight: '1L', price: 140, stock: 50 },
      ]
    },
    {
      name: 'زيت السمسم',
      slug: 'sesame-oil',
      description: 'زيت سمسم طبيعي ومفيد لصحة القلب والشعر.',
      categoryId: oilsCat.id,
      variants: [
        { weight: '125ml', price: 30, stock: 50 },
        { weight: '250ml', price: 55, stock: 50 },
        { weight: '500ml', price: 100, stock: 50 },
      ]
    }
  ];

  for (const p of productsData) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        categoryId: p.categoryId,
        variants: {
          create: p.variants,
        }
      },
    });
    console.log(`Created product: ${product.name}`);
  }

  console.log('Seeding finished.');
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
