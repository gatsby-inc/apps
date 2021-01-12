import React from 'react';
import { render } from 'react-dom';

import { init, locations } from 'contentful-ui-extensions-sdk';

import Sidebar from './Sidebar';
import { AppConfig } from './AppConfig';

import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import './index.css';
import { GatsbyCloudContentfulWidgetContainer } from './GatsbyCloudContentfulWidget';

init(sdk => {
  const root = document.getElementById('root');

  if (sdk.location.is(locations.LOCATION_ENTRY_SIDEBAR)) {
    const { siteId } = sdk.parameters.installation;

    // We can use "siteId" to check whther we can try to show the new Gatsby Cloud widget,
    // since this is a new required parameter that wasn't available before
    const shouldShowNewWidget = Boolean(siteId)
    
    if (shouldShowNewWidget) {
      render(<GatsbyCloudContentfulWidgetContainer sdk={sdk} />, root);
    } else {
      render(<Sidebar sdk={sdk} />, root);
    }
  } else if (sdk.location.is(locations.LOCATION_APP_CONFIG)) {
    render(<AppConfig sdk={sdk} />, root);
  }
});
