// This plugin is responsible for adding a “Preview” tab to the document pane
// You can add any React component to `S.view.component` and it will be rendered in the pane
// and have access to content in the form in real-time.
// It's part of the Studio's “Structure Builder API” and is documented here:
// https://www.sanity.io/docs/structure-builder-reference

import { DefaultDocumentNodeResolver } from 'sanity/desk'

import { PREVIEWABLE_DOCUMENT_TYPES } from '../../sanity.config'
import { PreviewPane } from './PreviewPane'

export const previewDocumentNode = ({
  apiVersion,
  previewSecretId,
}: {
  apiVersion: string
  previewSecretId: `${string}.${string}`
}): DefaultDocumentNodeResolver => {
  return (S, { schemaType }) => {
    if (PREVIEWABLE_DOCUMENT_TYPES.includes(schemaType)) {
      return S.document().views([
        // Default form view
        S.view.form(),
        // Preview
        S.view
          .component((props) => (
            <PreviewPane
              previewSecretId={previewSecretId}
              apiVersion={apiVersion}
              {...props}
            />
          ))
          .title('Preview'),
      ])
    }

    return null
  }
}
