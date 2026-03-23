import { defineType, defineField } from 'sanity'

export const coffeeEssential = defineType({
  name: 'coffeeEssential',
  title: 'Coffee Essential',
  type: 'document',
  icon: () => '☕',

  fields: [
    // ── Identity ───────────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Product Name',
      description: 'e.g. "Relativity Blend Coffee Capsules (50 Caps)"',
      type: 'string',
      validation: (Rule) => Rule.required().min(3).max(120),
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
      description: 'The photo shown on the product card in intoproduct2.html.',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),

    // ── Pricing ────────────────────────────────────────────────────
    defineField({
      name: 'price',
      title: 'Price (ZAR)',
      description: 'Full price, e.g. 520. Displayed as "R 520.00".',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),

    // ── Product Type ───────────────────────────────────────────────
    defineField({
      name: 'productType',
      title: 'Product Type',
      type: 'string',
      options: {
        list: [
          { title: 'Coffee Capsules', value: 'capsules' },
          { title: 'Pour-Over Sachet', value: 'pour-over' },
          { title: 'Subscription', value: 'subscription' },
          { title: 'Ground Coffee', value: 'ground' },
          { title: 'Whole Bean', value: 'whole-bean' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),

    // ── Short Description ──────────────────────────────────────────
    defineField({
      name: 'description',
      title: 'Short Description',
      description: 'Brief tagline shown below the product name (optional).',
      type: 'text',
      rows: 2,
    }),

    // ── Badge ──────────────────────────────────────────────────────
    defineField({
      name: 'badge',
      title: 'Badge Label',
      description: 'Optional corner badge, e.g. "NEW", "SALE", "LIMITED". Leave empty for none.',
      type: 'string',
    }),

    // ── Availability ───────────────────────────────────────────────
    defineField({
      name: 'available',
      title: 'Available / Active?',
      description: 'Uncheck to hide this product from the live page.',
      type: 'boolean',
      initialValue: true,
    }),

    // ── Sort order ───────────────────────────────────────────────
    defineField({
      name: 'sortOrder',
      title: 'Display Order',
      description: 'Lower numbers appear first on the page.',
      type: 'number',
      initialValue: 99,
    }),
  ],

  // ── Ordering options in the Studio list view ───────────────────
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
      title:    'name',
      price:    'price',
      media:    'image',
      avail:    'available',
      type:     'productType',
    },
    prepare(sel: any) {
      const typeEmoji: Record<string, string> = {
        capsules:     '💊',
        'pour-over':  '☕',
        subscription: '🔄',
        ground:       '☕',
        'whole-bean': '🫘',
        other:        '📦',
      }
      return {
        title:    sel.avail ? sel.title : `⛔ ${sel.title}`,
        subtitle: `${typeEmoji[sel.type] ?? '📦'} ${sel.type ?? ''}  ·  R ${sel.price}`,
        media:    sel.media,
      }
    },
  },
})
