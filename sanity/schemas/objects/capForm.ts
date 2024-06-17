/**
 * This is the schema definition for the mushroom cap form it can be
 * reused in other parts of the studio with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'capForm'
 *  }
 */

import { DocumentTextIcon, ImageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const capForm = defineType({
	title: "Cap Form",
	name: "capForm",
	type: "object",
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "image",
			icon: ImageIcon,
			title: "image",
			type: "image",
		}),
	],
	preview: {
		select: {
			image: "image",
			title: "title",
		},
		prepare({ image, title }) {
			return {
				title,
				media: image || DocumentTextIcon,
			};
		},
	},
});

export default capForm;
