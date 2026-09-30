/**
 * Structure Tool resolver for the studio.
 *
 * Singletons (such as Home and Settings) are registered through the first-class
 * `document.singletons` option in `sanity.config.ts`. The studio takes care of
 * hiding them from "create new" menus, removing the "duplicate" action and
 * filtering them out of `S.documentTypeListItems()`, so this resolver only has
 * to decide where they appear.
 */

import {type StructureResolver} from 'sanity/structure'

export const pageStructure = (singletonIds: string[]): StructureResolver => {
  return (S) => {
    // `S.listItem().singleton()` creates both the list item and its document
    // pane from the registered singleton definition (title and icon fall back
    // to the schema type's).
    const singletonItems = singletonIds.map((id) => S.listItem().singleton(id))

    // The default root list items; singleton schema types are excluded
    // automatically. `showCount()` adds a live document count badge.
    const defaultListItems = S.documentTypeListItems().map((item) => item.showCount())

    return S.list()
      .title('Content')
      .items([...singletonItems, S.divider(), ...defaultListItems])
  }
}
