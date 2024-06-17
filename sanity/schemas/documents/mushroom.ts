import { ImageIcon } from "@sanity/icons";
import { GiMushroomGills } from "react-icons/gi";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
	name: "mushroom",
	title: "Mushroom",
	type: "document",
	icon: GiMushroomGills,
	fields: [
		defineField({
			name: "name",
			title: "Name",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "title",
				maxLength: 160,
				isUnique: (value, context) => context.defaultIsUnique(value, context),
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "mainImage",
			title: "Main Image",
			description:
				"This image will be used as the cover image for the mushroom.",
			type: "image",
			options: {
				hotspot: true,
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "galleryImages",
			title: "Gallery Images",
			description: "Add more images of mushroom",
			type: "array",
			of: [
				defineArrayMember({
					name: "image",
					type: "image",
					options: { hotspot: true },
					fields: [
						{
							name: "alt",
							type: "string",
							title: "Alternative text",
						},
					],
				}),
			],
			options: {
				layout: "grid",
			},
		}),
		defineField({
			name: "description",
			title: "Description",
			type: "array",
			of: [
				defineArrayMember({
					type: "block",
					marks: {
						annotations: [
							{
								name: "link",
								type: "object",
								title: "Link",
								fields: [
									{
										name: "href",
										type: "url",
										title: "Url",
									},
								],
							},
						],
					},
					styles: [],
				}),
				defineField({
					type: "image",
					icon: ImageIcon,
					name: "image",
					title: "Image",
					options: {
						hotspot: true,
					},
					preview: {
						select: {
							imageUrl: "asset.url",
							title: "caption",
						},
					},
					fields: [
						defineField({
							title: "Caption",
							name: "caption",
							type: "string",
						}),
						defineField({
							name: "alt",
							type: "string",
							title: "Alt text",
							description:
								"Alternative text for screenreaders. Falls back on caption if not set",
						}),
					],
				}),
			],
		}),
		defineField({
			name: "warning",
			title: "Warning",
			type: "textContent",
		}),
		defineField({
			title: "Cap form",
			name: "capForm",
			type: "array",
			of: [
				defineArrayMember({
					name: "capForm",
					type: "capForm",
				}),
			],
		}),
	],
});
