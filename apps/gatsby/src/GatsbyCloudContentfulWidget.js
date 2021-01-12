import React from 'react';
import {
  Spinner,
  Button,
  Note,
} from '@contentful/forma-36-react-components';
import "@contentful/forma-36-fcss/dist/styles.css"
import { css } from 'emotion';
import { GatsbyCloudWidgetProvider } from '@gatsby-cloud-pkg/gatsby-cms-extension-base';
import { useWidgetStatus, useOpenPreview } from '@gatsby-cloud-pkg/gatsby-cms-extension-base';
import { WidgetDisplayStatus, BuildRunnerStatus } from '@gatsby-cloud-pkg/gatsby-cms-extension-base';
import { usePreviewStatus } from '@gatsby-cloud-pkg/gatsby-cms-extension-base';
import { useDispatchDataChange } from '@gatsby-cloud-pkg/gatsby-cms-extension-base';
import { useBuildStatus } from '@gatsby-cloud-pkg/gatsby-cms-extension-base';

export function GatsbyCloudContentfulWidgetContainer({ sdk }) {
  const { webhookUrl, authToken, siteId } = sdk.parameters.installation;

  React.useEffect(() => {
    sdk.window.startAutoResizer()
  }, [])

  return (
    <GatsbyCloudWidgetProvider
      config={{
        webhookUrl,
        authToken,
        siteId,
        headers: {
          'x-preview-update-source': 'contentful-sidebar-extension',
        },
      }}
    >
      <div className="extension">
        <GatsbyCloudContentfulWidget sdk={sdk} />
      </div>
    </GatsbyCloudWidgetProvider>
  )
}

function GatsbyCloudContentfulWidget({ sdk }) {
  const { status, message } = useWidgetStatus()
  const disptachDataChange = useDispatchDataChange()

  React.useEffect(() => {
    const removeListener = sdk.entry.onSysChanged(disptachDataChange)

    return () => {
      removeListener()
    }
  }, [disptachDataChange])

  return (
      <div className="flexcontainer">
        {status === WidgetDisplayStatus.Error && (
          <Note noteType="negative">
            {message}
          </Note>
        )}
        {status === WidgetDisplayStatus.Initializing && (
          <div>
            {message} <Spinner />
          </div>
        )}
        {status === WidgetDisplayStatus.Ready && (
          <React.Fragment>
            <div className="f36-margin-bottom--m">
              <PreviewStatus sdk={sdk} />
            </div>
            <div className="f36-margin-bottom--m">
              <BuildStatus sdk={sdk} />
            </div>
          </React.Fragment>
        )}
      </div>
  )
}

function PreviewStatus({ sdk }) {
  const { status, message } = usePreviewStatus()
  const openInPreview = useOpenPreview()
  const slug = sdk.entry.fields.slug;

  return (
    <div className={css({ display: `flex`, flexDirection: `column`, alignItems: `stretch` })}>
    <Button
      onClick={() => {
        const contentSlug = slug && slug.getValue()
        openInPreview(contentSlug)
      }}
      disabled={status === BuildRunnerStatus.InProgress}
      className="f36-margin-bottom--m"
    >
        {status === BuildRunnerStatus.InProgress ? `Updating preview ` : `Open Preview`}
        {status === BuildRunnerStatus.InProgress && <Spinner color="white" />}
      </Button>
      {message && (
        <Note title="Preview Status" noteType={getNoteType(status)}>
          {message}
        </Note>
      )}
    </div>
  )
}

function BuildStatus({ sdk }) {
  const { status, message } = useBuildStatus()

  return message && (
    <Note title="Build Status" noteType={getNoteType(status)}>
      {message}
    </Note>
  )
}

function getNoteType(status) {
  switch (status) {
    case BuildRunnerStatus.Success:
      return `positive`
    case BuildRunnerStatus.Error:
      return `negative`
    default:
      return `primary`
  }
}
