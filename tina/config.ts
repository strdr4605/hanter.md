import { defineConfig } from 'tinacms';

export default defineConfig({
  clientId: process.env.TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  branch: process.env.TINA_BRANCH ?? 'main',
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
    basePath: 'hanter.md',
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
            name: 'brands',
            label: 'Brands',
            list: true,
            ui: { itemProps: (item) => ({ label: item.name }) },
            fields: [
              { type: 'string', name: 'name', label: 'Brand name', required: true },
              {
                type: 'object',
                name: 'models',
                label: 'Models',
                list: true,
                ui: { itemProps: (item) => ({ label: item.name }) },
                fields: [
                  { type: 'string', name: 'name', label: 'Model name', required: true },
                  { type: 'string', name: 'yearRange', label: 'Year range (e.g. 2004-2024)', required: true },
                  {
                    type: 'object',
                    name: 'options',
                    label: 'Seat options',
                    list: true,
                    ui: { itemProps: (item) => ({ label: item.label_ro }) },
                    fields: [
                      {
                        type: 'object',
                        name: 'label',
                        label: 'Label',
                        fields: [
                          { type: 'string', name: 'ro', label: 'RO', required: true },
                          { type: 'string', name: 'ru', label: 'RU', required: true },
                          { type: 'string', name: 'en', label: 'EN', required: true },
                        ],
                      },
                      { type: 'number', name: 'meters', label: 'Base meters of material', required: true },
                      {
                        type: 'object',
                        name: 'suboptions',
                        label: 'Suboptions',
                        list: true,
                        ui: { itemProps: (item) => ({ label: item.id }) },
                        fields: [
                          { type: 'string', name: 'id', label: 'ID (e.g. carpetCoverage)', required: true },
                          {
                            type: 'object',
                            name: 'label',
                            label: 'Label',
                            fields: [
                              { type: 'string', name: 'ro', label: 'RO', required: true },
                              { type: 'string', name: 'ru', label: 'RU', required: true },
                              { type: 'string', name: 'en', label: 'EN', required: true },
                            ],
                          },
                          { type: 'number', name: 'extraMeters', label: 'Extra meters', required: true },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'materials',
        label: 'Materials',
        path: 'src/content',
        format: 'json',
        match: { include: 'materials' },
        ui: {
          allowedActions: { create: false, delete: false },
          filename: { readonly: true, slugify: () => 'materials' },
        },
        fields: [
          {
            type: 'object',
            name: 'classes',
            label: 'Material classes',
            list: true,
            ui: { itemProps: (item) => ({ label: item.id }) },
            fields: [
              { type: 'string', name: 'id', label: 'ID', required: true },
              {
                type: 'object',
                name: 'label',
                label: 'Label',
                fields: [
                  { type: 'string', name: 'ro', label: 'RO', required: true },
                  { type: 'string', name: 'ru', label: 'RU', required: true },
                  { type: 'string', name: 'en', label: 'EN', required: true },
                ],
              },
              {
                type: 'object',
                name: 'items',
                label: 'Items',
                list: true,
                ui: { itemProps: (item) => ({ label: item.id }) },
                fields: [
                  { type: 'string', name: 'id', label: 'ID', required: true },
                  {
                    type: 'object',
                    name: 'label',
                    label: 'Label',
                    fields: [
                      { type: 'string', name: 'ro', label: 'RO', required: true },
                      { type: 'string', name: 'ru', label: 'RU', required: true },
                      { type: 'string', name: 'en', label: 'EN', required: true },
                    ],
                  },
                  { type: 'number', name: 'pricePerMeter', label: 'Price per meter (MDL)', required: true },
                  { type: 'string', name: 'image', label: 'Swatch image URL', required: true },
                  { type: 'string', name: 'demoImage', label: 'Demo image URL', required: true },
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
            name: 'protectiveMats',
            label: 'Protective mats',
            fields: [
              { type: 'number', name: 'withDelta', label: 'WITH protective mats delta (MDL)', required: true },
              { type: 'number', name: 'withoutDelta', label: 'WITHOUT protective mats delta (MDL)', required: true },
              { type: 'number', name: 'onlyProtectivePrice', label: 'ONLY protective mats flat price (MDL)', required: true },
            ],
          },
        ],
      },
    ],
  },
});
