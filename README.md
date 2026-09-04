# A Next.js Personal Website with a Native Authoring Experience<!-- omit in toc -->

[![Deploy with Vercel](https://vercel.com/button)][vercel-deploy]

This starter is a personal website that uses [Next.js][nextjs] for the frontend and [Sanity][sanity-homepage] to handle its content. It runs with [Next.js Cache Components][cache-components] enabled: every page prerenders into a static shell and refreshes on content changes through Sanity Live — no rebuild required. The template comes with a native Sanity Studio that offers features like real-time collaboration and visual editing with live updates using [Presentation][presentation].

The Studio connects to Sanity Content Lake, which gives you hosted content APIs with a flexible query language, on-demand image transformations, powerful patching, and more. You can use this starter to kick-start a personal website or learn these technologies.

## Features

- Runs on [Next.js Cache Components][cache-components] — pages prerender into a static shell and refresh on content changes through Sanity Live
- A performant personal website with editable projects
- A native and customizable authoring environment, accessible on `yourpersonalwebsite.com/studio`
- Real-time and collaborative content editing with fine-grained revision history
- Side-by-side instant content preview that works across your whole site
- Support for block content and the most advanced custom fields capability in the industry
- Sanity Live Revalidation; no need to wait for a rebuild to publish new content
- Free Sanity project with unlimited admin users, free content updates, and pay-as-you-go for API overages
- A project with starter-friendly and not too heavy-handed TypeScript and Tailwind.css

## Table of Contents

- [Features](#features)
- [Table of Contents](#table-of-contents)
- [Project Overview](#project-overview)
  - [Important files and folders](#important-files-and-folders)
  - [Cache Components](#cache-components)
  - [Sanity Functions](#sanity-functions)
- [ Getting Started](#configuration)
  - [Step 1. Initialize template with Sanity CLI](#initialize-template-with-sanity-cli)
  - [Step 2. Run app locally in development mode](#run-app-locally-in-development-mode)
  - [Step 3. Open the app and sign in to the Studio](#open-the-app-and-sign-in-to-the-studio)
- [Adding content with Sanity](#adding-content-with-sanity)
  - [Step 1. Publish your first document](#publish-your-first-document)
  - [Step 2. Extending the Sanity schema](#extending-the-sanity-schema)
- [Deploying your application and inviting editors](<>)
  - [Step 1. Deploy Next.js app to Vercel](#deploy-next.js-app-to-vercel)
  - [Step 2. Invite a collaborator](#invite-a-collaborator)
- [Questions and Answers](#questions-and-answers)
  - [It doesn't work! Where can I get help?](#it-doesnt-work-where-can-i-get-help)
  - [How can I remove the "Next steps" block from my personal site?](#how-can-i-remove-the-next-steps-block-from-my-personal-website)
- [Next steps](#next-steps)

## Project Overview

| [Personal Website](https://template-nextjs-personal-website.sanity.build/)                                                | [Studio](https://template-nextjs-personal-website.sanity.build/studio)                                                 |
| ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| ![Personal Website](https://user-images.githubusercontent.com/6951139/206395107-e58a796d-13a9-400a-94b6-31cb5df054ab.png) | ![Sanity Studio](https://user-images.githubusercontent.com/6951139/206395521-8a5f103d-4a0c-4da8-aff5-d2a1961fb2c0.png) |

### Important files and folders

| File(s)                                      | Description                                                                                   |
| -------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `sanity.config.ts`                           | Config file for Sanity Studio                                                                 |
| `sanity.cli.ts`                              | Config file for Sanity CLI                                                                    |
| `next.config.ts`                             | Enables [Cache Components][cache-components] and sets the default `cacheLife` to Sanity Live  |
| `/app/studio/[[...tool]]/Studio.tsx`         | Where Sanity Studio is mounted                                                                |
| `/app/api/draft-mode/enable/route.ts`        | Serverless route for triggering Draft mode                                                    |
| `/app/api/revalidate/route.ts`               | Route handler the Sanity Function calls to expire cache tags before live events are released  |
| `/sanity/schemas`                            | Where Sanity Studio gets its content types from                                               |
| `/sanity/plugins`                            | Where the advanced Sanity Studio customization is setup                                       |
| `/sanity/lib/api.ts`,`/sanity/lib/client.ts` | Configuration for the Sanity Content Lake client                                              |
| `/sanity/lib/live.ts`                        | `sanityFetch`, `sanityFetchMetadata`, `sanityFetchStaticParams`, `getDynamicFetchOptions`     |
| `sanity.blueprint.ts`                        | [Sanity Blueprint][blueprints] that deploys the [Sanity Functions][functions] in `/functions` |
| `/functions/lib/events.ts`                   | When each Function runs (GROQ filters and projections) and the payload type it receives       |
| `/functions/invalidate-sync-tags`            | Sync tag invalidate Function backing `<SanityLive waitFor="function">`                        |

### Cache Components

The template enables Next.js [Cache Components][cache-components] in [`next.config.ts`](./next.config.ts):

```ts
import {sanity} from 'next-sanity/live/cache-life'

const config: NextConfig = {
  cacheComponents: true,
  cacheLife: {default: sanity},
}
```

Data fetching follows the three-layer (Page → Dynamic → Cached) pattern from the [`sanity-live-cache-components`](https://github.com/sanity-io/next-sanity/tree/main/skills/sanity-live-cache-components) skill, applied in:

- [`app/(website)/layout.tsx`](<./app/(website)/layout.tsx>) — `Dynamic/CachedNavbar` and `Dynamic/CachedFooter` share a `'use cache'` `fetchSettings` helper
- [`app/(website)/page.tsx`](<./app/(website)/page.tsx>) — homepage
- [`app/(website)/[slug]/page.tsx`](<./app/(website)/[slug]/page.tsx>) — dynamic page route
- [`app/(website)/projects/[slug]/page.tsx`](<./app/(website)/projects/[slug]/page.tsx>) — dynamic project route

Every cached leaf takes `perspective` and `stega` as plain props sourced from `getDynamicFetchOptions()`, so Visual Editing overlays and content-release previewing keep working in Draft Mode while the static shell is fully prerendered in production.

### Sanity Functions

The Blueprint in [`sanity.blueprint.ts`](./sanity.blueprint.ts) deploys eight [Sanity Functions][functions]. Seven of them fill in content while editors work, four of those through [Agent Actions][agent-actions]. The eighth expires the Next.js cache before Sanity Live releases an event. All of them are opt-in: nothing runs until you complete the setup below.

| Function                                                            | Runs when                                                                                          | What it does                                                                                                                                                                      |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`describe-images`](./functions/describe-images/index.ts)           | an image is added to or replaced on a project or page and has no alternative text                  | Writes alternative text from the image itself with [Transform][agent-transform]. Text an editor typed is never overwritten.                                                       |
| [`generate-images`](./functions/generate-images/index.ts)           | a cover or Open Graph image has a prompt in its "Generate with AI" field and no image              | Generates the image with [Generate][agent-generate], following the "Image style" from Settings and a layout suited to covers or 1200x630 social cards. Takes about half a minute. |
| [`auto-slug`](./functions/auto-slug/index.ts)                       | a project or page has a title and no slug                                                          | Fills the slug from the title, unique among documents of that type.                                                                                                               |
| [`seo-overview`](./functions/seo-overview/index.ts)                 | the body of a project or page changes while the overview is empty and the body has 200+ characters | Writes a meta description of at most 155 characters.                                                                                                                              |
| [`auto-tag`](./functions/auto-tag/index.ts)                         | a project is published for the first time without tags                                             | Adds three to five tags, reusing tags from other projects when they fit.                                                                                                          |
| [`slug-redirects`](./functions/slug-redirects/index.ts)             | a published project or page changes its slug                                                       | Creates a `redirect` document from the old address to the new one. The site answers requests for the old address with a 308.                                                      |
| [`auto-showcase`](./functions/auto-showcase/index.ts)               | a project is published for the first time                                                          | Appends it to the showcase list on the Home document.                                                                                                                             |
| [`invalidate-sync-tags`](./functions/invalidate-sync-tags/index.ts) | Sanity Live emits an event                                                                         | Expires the Next.js cache tags through [`app/api/revalidate/route.ts`](./app/api/revalidate/route.ts), then releases the event to `<SanityLive waitFor="function">` clients.      |

The Functions that react to drafts write into the draft the editor has open, so the result shows up in the Studio a few seconds after the edit that caused it. Redirects, tags and the showcase entry react to publishing, so they show up on the published document. [`functions/lib/events.ts`](./functions/lib/events.ts) holds the exact trigger for every Function next to the payload type its handler receives, and [`functions/lib/events.test.ts`](./functions/lib/events.test.ts) runs each trigger against before/after fixtures with the same GROQ engine Sanity uses.

#### Invalidate before the browser refreshes

By default every open browser tab reacts to a Sanity Live event by calling a Server Action that expires the cache and refreshes the page, racing the revalidation. With the [sync tag invalidate Function][sync-tag-function] deployed, Sanity expires the Next.js cache first and only then releases the event, so `<SanityLive waitFor="function">` clients render fresh content on the first refresh and the cache is expired once, not once per tab.

The setup below takes about ten minutes and covers every Function. The pieces are already in the repo: the handlers in [`functions/`](./functions), [`sanity.blueprint.ts`](./sanity.blueprint.ts) (deploys them), [`app/api/revalidate/route.ts`](./app/api/revalidate/route.ts) (what the sync tag Function calls) and [`.github/workflows/blueprints.yml`](./.github/workflows/blueprints.yml) (deploys the schema and the Blueprint from CI with the official [Blueprints GitHub Actions][blueprints-action]).

#### Setup

You need admin access to the Sanity project, plus access to the GitHub repository settings and the hosting provider's environment variables (Vercel below). Whenever the Sanity CLI prints an id as `<ST-abc123>`, paste it without the `<>`.

**1. Generate a secret.** It's shared between the site and the sync tag invalidate Function, and used in steps 2 and 4.

```shell
openssl rand -hex 32
```

**2. Add environment variables on Vercel** (Project → Settings → Environment Variables, Production). Don't redeploy yet.

| Name                            | Value                  |
| ------------------------------- | ---------------------- |
| `SANITY_REVALIDATE_SECRET`      | the secret from step 1 |
| `SANITY_LIVE_WAIT_FOR_FUNCTION` | `true`                 |

**3. Create a Blueprint stack and a deploy token.** Once, from your machine, in the project root:

```shell
npx sanity login
npx sanity blueprints init . --project-id <project-id> --stack-name <dataset>
npx sanity blueprints mint-deploy-token --print
npx sanity blueprints info
```

- `<project-id>` is the `NEXT_PUBLIC_SANITY_PROJECT_ID` the deployed site uses.
- A stack is a named deployment target inside the project. The name is only a label; naming it after the dataset (`production`) keeps one stack per environment.
- `mint-deploy-token` prints a token; `info` prints the stack id (`ST-…`). Keep both for step 4.
- `init` writes `.sanity/blueprint.config.json`, which is gitignored so every clone binds to its own stack. It also warns that the Blueprint is co-located with a Studio; that's fine here, the Studio is embedded in the Next.js app and the file sits next to the lockfile as [required][blueprints-layout].

**4. Configure GitHub** (Repository → Settings → Secrets and variables → Actions):

| Kind     | Name                            | Value                                             |
| -------- | ------------------------------- | ------------------------------------------------- |
| variable | `SANITY_BLUEPRINT_STACK_ID`     | the `ST-…` id from step 3                         |
| variable | `NEXT_PUBLIC_SANITY_PROJECT_ID` | same as the Vercel project (CI already uses this) |
| variable | `NEXT_PUBLIC_SANITY_DATASET`    | same as the Vercel project (CI already uses this) |
| variable | `REVALIDATE_URL`                | `https://<your-production-domain>/api/revalidate` |
| secret   | `SANITY_DEPLOY_TOKEN`           | the token from step 3                             |
| secret   | `SANITY_REVALIDATE_SECRET`      | the secret from step 1                            |

**5. Deploy the Functions.** Actions → Sanity Blueprints → Run workflow → `main`. The job first runs `npx sanity schema deploy`, because Agent Actions read the deployed schema, then deploys the Blueprint. The log should end with `[Functions] Created 8 functions` and `✅ Blueprints deployed successfully!`. From now on every push to `main` redeploys the schema and the Functions, and every pull request gets a plan comment showing what would change. (The workflow is skipped until `SANITY_BLUEPRINT_STACK_ID` exists, and the "Run workflow" button only appears once the workflow file is on the default branch.)

**6. Redeploy the site on Vercel** so the variables from step 2 apply.

#### Check that it works

- `npx sanity functions env list invalidate-sync-tags` lists `REVALIDATE_URL` and `SANITY_REVALIDATE_SECRET`.
- Open the site with the browser console open. The Sanity Live welcome message ends with "Events will be delayed until after a Sanity Function has processed them."
- Publish a change in the Studio. The page updates on its first refresh, and `npx sanity functions logs invalidate-sync-tags` shows `Revalidated N sync tags: …`.
- Create a project in the Studio and type a title. The slug appears after a moment. Upload a cover image and its alternative text follows. Type a sentence into the cover image's "Generate with AI" field instead and an image arrives about half a minute later. `npx sanity functions logs <name>` shows one line per run.

#### Good to know

- Every Function is scoped to `NEXT_PUBLIC_SANITY_PROJECT_ID.NEXT_PUBLIC_SANITY_DATASET`. The Blueprint refuses to deploy when either variable is missing, because an unscoped Function would run against every dataset in the project. Only one sync tag invalidate Function can exist per dataset; deploying a second one fails with "a sync tag invalidation subscription already exists".
- Agent Actions read the schema deployed to the dataset (`_.schemas.default`), not your local files. The deploy job deploys it on every push to `main`. After changing a schema locally, run `npx sanity schema deploy` before testing a Function against that change.
- The sync tag invalidate Function reads `REVALIDATE_URL` and `SANITY_REVALIDATE_SECRET` from whatever environment runs `blueprints deploy` (GitHub variables and secrets in CI, `.env.local` locally). Keep `SANITY_REVALIDATE_SECRET` identical on Vercel and GitHub; nothing else has to stay in sync.
- `SANITY_LIVE_WAIT_FOR_FUNCTION` is read at build time, so changing it needs a redeploy. Leave it unset for local development (the Function can't reach `localhost`) and for Preview deployments unless you point `REVALIDATE_URL` at one. Draft Mode ignores it: `includeDrafts` wins and the browser refreshes on every event.
- To deploy without GitHub Actions, add `REVALIDATE_URL` and `SANITY_REVALIDATE_SECRET` to `.env.local` and run `npx sanity schema deploy && npx sanity blueprints deploy`.
- Image generation writes the image about half a minute after the prompt. Wait for it before changing the prompt again or uploading an image by hand, otherwise whichever finishes last wins. To generate a new image, clear the image and keep or edit the prompt.
- Clearing an overview does not regenerate it, so an editor can write their own. The next change to the body regenerates an empty overview. Removing tags from a project keeps them removed; `auto-tag` only runs on the first publish.
- Functions on drafts run once per Studio save while a field is still missing. `auto-slug`, `seo-overview` and `generate-images` wait a couple of seconds and re-read the document before writing, so a title typed in three bursts produces one slug, not three.
- To run a Function locally against the dataset, sign in with `npx sanity login` (or set `SANITY_AUTH_TOKEN`) and pass a document change. Local runs are dry runs unless `SANITY_FUNCTIONS_LOCAL_WRITE=1` is set, so the first command below only logs what it would write:

  ```shell
  npx sanity functions test auto-slug --with-user-token --event update \
    --data-before '{"_id": "drafts.example", "_type": "project"}' \
    --data-after '{"_id": "drafts.example", "_type": "project", "_rev": "<current rev>", "title": "Hello World"}'

  REVALIDATE_URL=http://localhost:3000/api/revalidate SANITY_REVALIDATE_SECRET=<secret> \
    npx sanity functions test invalidate-sync-tags --data '{"syncTags": ["s1:example"]}'
  ```

  The CLI evaluates the Function's GROQ filter against the before/after pair and skips the run when it does not match, the same way Sanity does after deployment.

## Getting Started

### Installing the template

We will take a look at installing this template with the Sanity CLI, running locally, and lastly deploying to Vercel. If you'd rather start by deploying to Vercel, please instead reference the instructions in [`vercel-installation-instructions.md`](./vercel-installation-instructions.md)

#### 1. Initialize template with Sanity CLI

Run the command in your Terminal to initialize this template on your local computer.

See the documentation if you are [having issues with the CLI](https://www.sanity.io/help/cli-errors).

```shell
npm create sanity@latest -- --template sanity-io/template-nextjs-personal-website
```

#### 2. Run app locally in development mode

Navigate to the template directory using `cd <your app name>`, and start the development servers by running the following command

```shell
npm run dev
```

#### 3. Open the app and sign in to the Studio

Open the Next.js app running locally in your browser on [http://localhost:3000](http://localhost:3000).

Open the Studio by navigating to the `/studio` route [http://localhost:3000/studio](http://localhost:3000/studio). You should now see a screen prompting you to log in to the Studio. Use the same service (Google, GitHub, or email) that you used when you logged in to the CLI.

### Adding content with Sanity

#### 1. Publish your first document

The template comes pre-defined with a schema containing `Page` and `Project` document types.

From the Studio, click "+ Create" and select the `Project` document type. Go ahead and create and publish the document.

Your content should now appear in your Next.js app ([http://localhost:3000](http://localhost:3000)) as well as in the Studio on the "Presentation" Tab

#### 2. Extending the Sanity schema

The schema for the `Post` document type is defined in the `studio/src/schemaTypes/post.ts` file. You can [add more document types](https://www.sanity.io/docs/schema-types) to the schema to suit your needs.

### Deploying your application and inviting editors

#### 1. Deploy Next.js app to Vercel

Your app is still only running on your local computer. It's time to deploy and get it into the hands of other content editors.

You have the freedom to deploy your Next.js app to your hosting provider of choice. With Vercel and GitHub being a popular choice, we'll cover the basics of that approach.

1. Create a GitHub repository from this project. [Learn more](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github).
2. Create a new Vercel project and connect it to your Github repository.
3. Configure your Environment Variables.

#### 2. Invite a collaborator

Now that you’ve deployed your Next.js application and Sanity Studio, you can optionally invite a collaborator to your Studio. Open up [Manage](https://www.sanity.io/manage), select your project and click "Invite project members"

They will be able to access the deployed Studio, where you can collaborate together on creating content.

## Questions and Answers

### It doesn't work! Where can I get help?

In case of any issues or questions, you can post:

- [GitHub Discussions for Next.js][vercel-github]
- [Sanity's GitHub Discussions][sanity-github]
- [Sanity's Community Slack][sanity-community]

### How can I remove the "Next steps" block from my personal website?

You can remove it by deleting the `IntroTemplate` component in `/app/(website)/layout.tsx`.

## Next steps

- [Join our Slack community to ask questions and get help][sanity-community]
- [How to edit my content structure?][sanity-schema-types]
- [How to query content?][sanity-groq]
- [What is content modelling?][sanity-content-modelling]

[vercel-deploy]: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsanity-io%2Ftemplate-nextjs-personal-website&project-name=nextjs-personal-website&repository-name=nextjs-personal-website&demo-title=Personal+Website+with+Built-in+Content+Editing&demo-description=A+Sanity-powered+personal+website+with+built-in+content+editing+and+instant+previews.+Uses+App+Router.&demo-url=https%3A%2F%2Ftemplate-nextjs-personal-website.sanity.build%2F&demo-image=https%3A%2F%2Fuser-images.githubusercontent.com%2F6951139%2F206395107-e58a796d-13a9-400a-94b6-31cb5df054ab.png&products=%5B%7B%22type%22%3A%22integration%22%2C%22protocol%22%3A%22other%22%2C%22productSlug%22%3A%22project%22%2C%22integrationSlug%22%3A%22sanity%22%7D%5D
[integration]: https://www.sanity.io/docs/vercel-integration?utm_source=github.com&utm_medium=referral&utm_campaign=nextjs-v3vercelstarter
[`.env.local.example`]: .env.local.example
[nextjs]: https://github.com/vercel/next.js
[sanity-create]: https://www.sanity.io/get-started/create-project?utm_source=github.com&utm_medium=referral&utm_campaign=nextjs-v3vercelstarter
[sanity-deployment]: https://www.sanity.io/docs/deployment?utm_source=github.com&utm_medium=referral&utm_campaign=nextjs-v3vercelstarter
[sanity-homepage]: https://www.sanity.io?utm_source=github.com&utm_medium=referral&utm_campaign=nextjs-v3vercelstarter
[sanity-community]: https://slack.sanity.io/
[sanity-schema-types]: https://www.sanity.io/docs/schema-types?utm_source=github.com&utm_medium=referral&utm_campaign=nextjs-v3vercelstarter
[sanity-github]: https://github.com/sanity-io/sanity/discussions
[sanity-groq]: https://www.sanity.io/docs/groq?utm_source=github.com&utm_medium=referral&utm_campaign=nextjs-v3vercelstarter
[sanity-content-modelling]: https://www.sanity.io/docs/content-modelling?utm_source=github.com&utm_medium=referral&utm_campaign=nextjs-v3vercelstarter
[sanity-webhooks]: https://www.sanity.io/docs/webhooks?utm_source=github.com&utm_medium=referral&utm_campaign=nextjs-v3vercelstarter
[localhost-3000]: http://localhost:3000
[localhost-3000-studio]: http://localhost:3000/studio
[vercel]: https://vercel.com
[vercel-github]: https://github.com/vercel/next.js/discussions
[personal-website-pages]: https://github.com/sanity-io/template-nextjs-personal-website
[presentation]: https://www.sanity.io/docs/presentation
[cache-components]: https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents
[blueprints]: https://www.sanity.io/docs/blueprints/blueprints-introduction
[blueprints-layout]: https://www.sanity.io/docs/blueprints/project-layout-and-monorepos
[blueprints-action]: https://www.sanity.io/docs/blueprints/blueprint-action
[functions]: https://www.sanity.io/docs/functions/functions-introduction
[sync-tag-function]: https://www.sanity.io/docs/functions/sync-tag-function-quickstart
[agent-actions]: https://www.sanity.io/docs/agent-actions
[agent-transform]: https://www.sanity.io/docs/agent-actions/transform-cheatsheet
[agent-generate]: https://www.sanity.io/docs/agent-actions/agent-actions-image-generation
