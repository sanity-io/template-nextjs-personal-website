import page from "@/sanity/schemas/documents/page";
import project from "@/sanity/schemas/documents/project";
import blockContent from "@/sanity/schemas/objects/blockContent";
import cta from "@/sanity/schemas/objects/cta";
import duration from "@/sanity/schemas/objects/duration";
import hero from "@/sanity/schemas/objects/hero";
import mainHeadingBlockContent from "@/sanity/schemas/objects/mainHeadingBlockContent";
import milestone from "@/sanity/schemas/objects/milestone";
import textContent from "@/sanity/schemas/objects/textContent";
import textImage from "@/sanity/schemas/objects/textImage";
import timeline from "@/sanity/schemas/objects/timeline";
import home from "@/sanity/schemas/singletons/home";
import settings from "@/sanity/schemas/singletons/settings";
import capForm from "@/sanity/schemas/objects/capForm";
import mushroom from "@/sanity/schemas/documents/mushroom";

export const schemaTypes = [
	home,
	settings,
	duration,
	page,
	project,
	milestone,
	timeline,
	mainHeadingBlockContent,
	cta,
	blockContent,
	hero,
	textImage,
	textContent,
	capForm,
	mushroom,
];
