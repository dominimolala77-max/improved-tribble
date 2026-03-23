import { defineType, defineField } from 'sanity'

export const beanToCup = defineType({
  name: 'beanToCup',
  title: 'Bean-to-Cup Product',
  type: 'document',
  icon: () => '🫘',

  fields: [
    // ── Identity ───────────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Product Name',
      description: 'e.g. "The Manhattan Project - The One & Only"',
      type: 'string',
      validation: (Rule) => Rule.required().min(3).max(150),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    // ── Main Image ─────────────────────────────────────────────────
    defineField({
      name: 'image',
      title: 'Product Image',
      description: 'The photo displayed on the product card in beans-to-cup page.',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),

    // ── Pricing ────────────────────────────────────────────────────
    defineField({
      name: 'price',
      title: 'Price (ZAR)',
      description: 'e.g. 560 → displays as "R 560.00"',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),

    // ── Roast Profile ──────────────────────────────────────────────
    defineField({
      name: 'roastProfile',
      title: 'Roast Profile',
      type: 'string',
      options: {
        list: [
          { title: 'Light',        value: 'light'        },
          { title: 'Medium',       value: 'medium'       },
          { title: 'Medium-Dark',  value: 'medium-dark'  },
          { title: 'Dark',         value: 'dark'         },
          { title: 'Decaf',        value: 'decaf'        },
        ],
        layout: 'radio',
      },
    }),

    // ── Short Description ──────────────────────────────────────────
    defineField({
      name: 'description',
      title: 'Tasting Notes / Description',
      description: 'Brief flavour notes or product description shown on the card.',
      type: 'text',
      rows: 3,
    }),

    // ── Badge ──────────────────────────────────────────────────────
    defineField({
      name: 'badge',
      title: 'Badge Label',
      description: 'e.g. "LIMITED EDITION", "NEW", "BESTSELLER". Leave empty for none.',
      type: 'string',
    }),

    // ── Availability ───────────────────────────────────────────────
    defineField({
      name: 'available',
      title: 'Available / Active?',
      description: 'Uncheck to hide this product from the live page instantly.',
      type: 'boolean',
      initialValue: true,
    }),

    // ── Sort Order ─────────────────────────────────────────────────
    defineField({
      name: 'sortOrder',
      title: 'Display Order',
      description: 'Lower number = appears first. Use to control card position.',
      type: 'number',
      initialValue: 99,
    }),
  ],

  // ── Ordering options in Studio list ───────────────────────────
  orderings: [
    {
      title: 'Display Order',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
    {
      title: 'Price (low → high)',
      name: 'priceAsc',
      by: [{ field: 'price', direction: 'asc' }],
    },
  ],

  // ── Studio card preview ────────────────────────────────────────
  preview: {
    select: {
      title:   'name',
      price:   'price',
      media:   'image',
      avail:   'available',
      roast:   'roastProfile',
    },
    prepare(sel: any) {
      const roastEmoji: Record<string, string> = {
        light:        '🌤️',
        medium:       '☀️',
        'medium-dark':'🌇',
        dark:         '🌑',
        decaf:        '💤',
      }
      return {
        title:    sel.avail ? sel.title : `⛔ ${sel.title}`,
        subtitle: `${roastEmoji[sel.roast] ?? '☕'} ${sel.roast ?? ''}  ·  R ${sel.price}`,
        media:    sel.media,
      }
    },
  },
})
