import { defineType, defineField, defineArrayMember } from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  // Usually there's only one About page, so we hide the ability to create more if one exists
  // but for simplicity here we just define the fields.

  fields: [
    // ── Hero / Banner ──────────────────────────────────────────────
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      description: 'The large text in the hero (e.g. "OUR STORY")',
      type: 'string',
      initialValue: 'OUR STORY',
    }),

    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      options: { hotspot: true },
    }),

    // ── Mission Section ────────────────────────────────────────────
    defineField({
      name: 'missionTitle',
      title: 'Mission Title',
      type: 'string',
      initialValue: 'COFFEE. ROASTED. PROPERLY.',
    }),

    defineField({
      name: 'missionSubtitle',
      title: 'Mission Subtitle',
      type: 'string',
      initialValue: 'THE COFFEE YOU DESERVE.',
    }),

    defineField({
      name: 'paragraphs',
      title: 'About Paragraphs',
      description: 'The main story text paragraphs.',
      type: 'array',
      of: [defineArrayMember({ type: 'text', rows: 4 })],
    }),

    // ── Founders Box ───────────────────────────────────────────────
    defineField({
      name: 'foundersText',
      title: 'Founders / History Text',
      description: 'The text inside the dark box.',
      type: 'array',
      of: [defineArrayMember({ type: 'text', rows: 3 })],
    }),

    // ── Best-Sellers Preview Cards ─────────────────────────────────
    defineField({
      name: 'bestSellerImages',
      title: 'Best-Seller Card Images',
      description: 'Images for the "This Month\'s Best-Sellers" section.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'productName',
              title: 'Product Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Product Image',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'badge',
              title: 'Badge Label (e.g. "NEW")',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              title: 'productName',
              subtitle: 'badge',
              media: 'image',
            },
          },
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: 'heroTitle',
      media: 'heroImage',
    },
    prepare(selection: any) {
      return {
        title: selection.title || 'About Page',
        media: selection.media,
      }
    },
  },
})
