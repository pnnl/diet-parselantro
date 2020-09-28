import React from 'react';
import { linkTo } from '@storybook/addon-links';
// import { Welcome } from '@storybook/react/demo';
import { DietParselantro } from '../src'

import labels from './data/labels.json'
import parsed_page_content from './data/parsed_page_content'
import nearest_neighbors from './data/nearest_neighbors.json'
import umap from './data/umap.json'

// CR: change the title and component from the default example
export default {
  title: 'Diet Parselantro',
};

let coords = umap.map(xy => {return {'x': xy[0], 'y': xy[1]}})
let dataCopy = JSON.parse(JSON.stringify(parsed_page_content))
// let data = dataCopy.map((s, i) => {
// 		s.index = i
// 		s.coords = coords[i]
// 		return s
// 	})

export const FromScratch = () => {
	return <div>
        <DietParselantro data={dataCopy}
        				 coords={coords}
        				 nearestNeighbors={nearest_neighbors} />
    </div>
}

export const Current = () => {
	return <div>
        <DietParselantro data={dataCopy}
        				 regex={labels}
        				 coords={coords}
        				 nearestNeighbors={nearest_neighbors} />
    </div>
}