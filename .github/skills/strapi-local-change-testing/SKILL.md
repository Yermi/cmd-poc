---
name: strapi-local-change-testing
description: 'Run and validate this local Strapi project after code changes. Use for post-change verification, plugin/custom-field testing, schema checks, and API smoke testing in development.'
argument-hint: 'Describe what changed and what should be verified'
user-invocable: true
disable-model-invocation: false
---

# Strapi Local Change Testing

## What This Skill Produces

A repeatable local verification workflow for this repository that confirms:

- dependencies are installed
- Strapi compiles and admin builds successfully
- runtime boots without schema or plugin registration errors
- changed behavior is validated in admin and API responses

## When To Use

Use this after any change to:

- content-type or component schema
- local plugins in src/plugins
- custom fields and admin input components
- API controllers/services/routes
- model values that may require data remapping

## Inputs

Provide:

- what files or features changed
- expected behavior to verify
- whether existing data must be preserved or migrated

## Procedure

1. Confirm project context
- Ensure current folder is the project root.
- Review changed files first.

2. Verify dependencies
- If Strapi CLI is missing or build errors with strapi not found, run:
- npm install

3. Run compile/build gate
- Run: npm run build
- This validates TypeScript compile, schema loading, plugin wiring, and admin build.

4. Branch on build failures
- If JSX parse errors appear, ensure React files use .jsx or .tsx extensions.
- If custom field errors appear, verify:
- plugin is enabled in config/plugins.ts
- resolve path points to ./src/plugins/<plugin-name>
- customField UID format matches plugin::plugin-name.field-name
- If schema errors appear, validate attribute types and option shapes in JSON schemas.

5. Start runtime for interactive testing
- Run: npm run develop
- Confirm startup has no plugin or schema registration failures.

6. Validate changed behavior
- In Admin UI, perform a functional check for the changed feature.
- For custom numeric enums:
- confirm dropdown labels render correctly
- save an entry and confirm persisted value is numeric
- call API and confirm numeric response value

7. API smoke test
- Perform a focused API request for the changed entity.
- Verify status code, response shape, and changed field values.

8. Data compatibility check
- If value encoding changed (for example 1 or 2 to 0 or 1), decide whether migration is required.
- Add migration or remap step before release if existing records use old values.

9. Completion checks
- npm run build exits 0
- npm run develop starts cleanly
- UI behavior matches expected outcome
- API output matches expected types and values
- Any migration need is documented or implemented

## Quick Command Set

- npm install
- npm run build
- npm run develop

## Troubleshooting Notes

- strapi: not found:
- install dependencies with npm install
- custom field not visible in builder:
- verify admin register and server register both exist
- verify plugin is enabled in config/plugins.ts
- option list shows empty in custom input:
- verify options payload format consumed by input component
- stale admin behavior:
- rebuild and restart development server
