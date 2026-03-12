import { writeFileSync } from 'fs';

const res = await fetch('https://api.cars-base.ru/full');
const { data } = await res.json();

const brands = data.map((brand) => ({
  name: brand.name,
  models: brand.models.map((model) => ({
    name: model.name,
    yearRange: `${model.year_from}-${model.year_to}`,
    options: [],
  })),
}));

writeFileSync('src/content/cars.json', JSON.stringify({ brands }, null, 2));
console.log(`Imported ${brands.length} brands`);
