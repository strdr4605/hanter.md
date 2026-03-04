import { defineConfig } from 'tinacms';

export default defineConfig({
  clientId: process.env.TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  branch: process.env.TINA_BRANCH ?? 'main',
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'images',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [
      {
        name: 'cars',
        label: 'Cars',
        path: 'src/content',
        format: 'json',
        match: { include: 'cars' },
        ui: {
          allowedActions: { create: false, delete: false },
          filename: { readonly: true, slugify: () => 'cars' },
        },
        fields: [
          {
            type: 'object',
            name: 'makes',
            label: 'Makes',
            list: true,
            ui: { itemProps: (item) => ({ label: item.name }) },
            fields: [
              { type: 'string', name: 'name', label: 'Make name', required: true },
              {
                type: 'object',
                name: 'models',
                label: 'Models',
                list: true,
                ui: { itemProps: (item) => ({ label: item.name }) },
                fields: [
                  { type: 'string', name: 'name', label: 'Model name', required: true },
                  { type: 'boolean', name: 'has7seats', label: 'Has 7 seats option' },
                  {
                    type: 'object',
                    name: 'years',
                    label: 'Years',
                    list: true,
                    ui: { itemProps: (item) => ({ label: String(item.year) }) },
                    fields: [
                      { type: 'number', name: 'year', label: 'Year', required: true },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'pricing',
        label: 'Pricing',
        path: 'src/content',
        format: 'json',
        match: { include: 'pricing' },
        ui: {
          allowedActions: { create: false, delete: false },
          filename: { readonly: true, slugify: () => 'pricing' },
        },
        fields: [
          {
            type: 'object',
            name: 'materials',
            label: 'Materials',
            list: true,
            ui: { itemProps: (item) => ({ label: item.label }) },
            fields: [
              { type: 'string', name: 'id', label: 'ID', required: true },
              { type: 'string', name: 'label', label: 'Label', required: true },
              { type: 'number', name: 'basePrice', label: 'Base price (MDL)', required: true },
              {
                type: 'object',
                name: 'variants',
                label: 'Variants (color/design)',
                list: true,
                ui: { itemProps: (item) => ({ label: item.label }) },
                fields: [
                  { type: 'string', name: 'id', label: 'ID', required: true },
                  { type: 'string', name: 'label', label: 'Label', required: true },
                  { type: 'number', name: 'priceDelta', label: 'Price delta (MDL)', required: true },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'options',
            label: 'Options',
            fields: [
              { type: 'number', name: 'carpetCoverageDelta', label: 'Carpet coverage delta (MDL)', required: true },
              { type: 'number', name: 'sillCoverageDelta', label: 'Sill coverage delta (MDL)', required: true },
              {
                type: 'number',
                name: 'sillCoverageFormula',
                label: 'Sill coverage multiplier (applied to base price)',
                required: true,
              },
              {
                type: 'object',
                name: 'trunkTiers',
                label: 'Trunk tiers',
                list: true,
                ui: { itemProps: (item) => ({ label: item.label }) },
                fields: [
                  { type: 'string', name: 'id', label: 'ID', required: true },
                  { type: 'string', name: 'label', label: 'Label', required: true },
                  { type: 'number', name: 'priceDelta', label: 'Price delta (MDL)', required: true },
                ],
              },
              {
                type: 'object',
                name: 'protectiveMats',
                label: 'Protective mats',
                fields: [
                  { type: 'number', name: 'withSetDelta', label: 'WITH protective mats delta (MDL)', required: true },
                  { type: 'number', name: 'withoutSetDelta', label: 'WITHOUT protective mats delta (MDL)', required: true },
                  { type: 'number', name: 'onlyProtectivePrice', label: 'ONLY protective mats flat price (MDL)', required: true },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
