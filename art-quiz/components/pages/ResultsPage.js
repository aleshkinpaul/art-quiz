'use strict';

import { Results } from './classes/Results.js'

export const ResultsPage = {
  render: async () => {
    const results = new Results();
    const view = await results.createPage();
    return view.outerHTML;
  },
  postRender: () => { }
}

export default ResultsPage;