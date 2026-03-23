import { defineType, defineField } from 'sanity'

export const brewingEquipment = defineType({
  name: 'brewingEquipment',
  title: 'Home Brewing Equipment',
  type: 'document',
  icon: () => '☕',

  fields: [
    defineField({
      name: 'name',
      title: 'Equipment Name',
      description: 'E.g. "Hario V60", "Chemix", "AeroPress"',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'price',
      title: 'Price (ZAR)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: 'equipmentType',
      title: 'Equipment Type',
      description: 'E.g. Pour Over, French Press, Accessories',
      type: 'string',
      options: {
        list: [
          { title: 'Pour Over', value: 'pour-over' },
          { title: 'French Press', value: 'french-press' },
          { title: 'Coffee Makers', value: 'maker' },
          { title: 'Accessories', value: 'accessories' },
          { title: 'Grinders', value: 'grinders' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
    }),

    defineField({
      name: 'badge',
      title: 'Badge Label (e.g. "NEW", "LIMITED")',
      type: 'string',
    }),

    defineField({
      name: 'available',
      title: 'Available?',
      type: 'boolean',
      initialValue: true,
    }),

    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      initialValue: 99,
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'equipmentType',
      media: 'image',
      price: 'price',
    },
    prepare(selection: any) {
      return {
        title: selection.title,
        subtitle: `${selection.subtitle}  ·  R${selection.price}`,
        media: selection.media,
      }
    },
  },
})
