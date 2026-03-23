import { defineType, defineField } from 'sanity'

export const bakeryItem = defineType({
  name: 'bakeryItem',
  title: 'Bakery Item',
  type: 'document',
  icon: () => '🥐',

  fields: [
    // ── Identity ───────────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Item Name',
      description: 'E.g. "Butter Croissant", "Fudge Brownie"',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(80),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    // ── Image ──────────────────────────────────────────────────────
    defineField({
      name: 'image',
      title: 'Product Image',
      description: 'Upload the photo that appears on the bakery card.',
      type: 'image',
      options: {
        hotspot: true, // lets you choose which part of the image to keep when cropped
      },
      validation: (Rule) => Rule.required(),
    }),

    // ── Pricing ────────────────────────────────────────────────────
    defineField({
      name: 'price',
      title: 'Price (ZAR)',
      description: 'Price in Rands, e.g. 35',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),

    // ── Category (matches the filter tabs in bakery.html) ──────────
    defineField({
      name: 'category',
      title: 'Category',
      description: 'Used to power the filter tabs on the bakery page.',
      type: 'string',
      options: {
        list: [
          { title: 'Croissant', value: 'croissant' },
          { title: 'Pastry',    value: 'pastry'    },
          { title: 'Cake & Slice', value: 'cake'   },
          { title: 'Bread & Bagel', value: 'bread' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),

    // ── Description ────────────────────────────────────────────────
    defineField({
      name: 'description',
      title: 'Short Description',
      description: 'One or two sentences shown below the item name on the card.',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(200),
    }),

    // ── Badge ──────────────────────────────────────────────────────
    defineField({
      name: 'badge',
      title: 'Badge Label',
      description: 'Optional label shown in the corner of the card (e.g. "BESTSELLER", "MORNING SPECIAL", "CHEF\'S PICK"). Leave empty for no badge.',
      type: 'string',
    }),

    defineField({
      name: 'badgeStyle',
      title: 'Badge Style',
      description: 'Gold = normal badge. Green = vegan / special badge.',
      type: 'string',
      options: {
        list: [
          { title: 'Gold (default)', value: 'default' },
          { title: 'Green (vegan / eco)', value: 'vegan' },
        ],
        layout: 'radio',
      },
      initialValue: 'default',
      hidden: ({ document }) => !document?.badge,
    }),

    // ── Availability ───────────────────────────────────────────────
    defineField({
      name: 'available',
      title: 'Available Today?',
      description: 'Uncheck to temporarily hide this item on the bakery page.',
      type: 'boolean',
      initialValue: true,
    }),

    // ── Sort Order ─────────────────────────────────────────────────
    defineField({
      name: 'sortOrder',
      title: 'Display Order',
      description: 'Lower numbers appear first. Use to control card order on the page.',
      type: 'number',
      initialValue: 99,
    }),
  ],

  // ── Studio list preview ────────────────────────────────────────────
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

  preview: {
    select: {
      title:    'name',
      subtitle: 'category',
      price:    'price',
      media:    'image',
      avail:    'available',
    },
    prepare(selection: any) {
      const categoryLabels: Record<string, string> = {
        croissant: '🥐 Croissant',
        pastry:    '🧁 Pastry',
        cake:      '🎂 Cake & Slice',
        bread:     '🥯 Bread & Bagel',
      }
      return {
        title:    selection.avail ? selection.title : `⛔ ${selection.title}`,
        subtitle: `${categoryLabels[selection.category] ?? selection.category}  ·  R${selection.price}`,
        media:    selection.media,
      }
    },
  },
})
