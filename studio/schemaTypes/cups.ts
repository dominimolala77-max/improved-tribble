import { defineType, defineField } from 'sanity'

export const cups = defineType({
  name: 'cups',
  title: 'Cups',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Cup Name',
      type: 'string',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
    }),
    defineField({
      name: 'image',
      title: 'Cup Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
  ],
})
