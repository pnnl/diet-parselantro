import React from 'react';
import { linkTo } from '@storybook/addon-links';
import { Welcome } from '@storybook/react/demo';
import { Embedding } from '../src/Embeddings'

import { getMatches } from '../src/helperFunctions/getMatches'

import labels from './data/labels.json'
import nearest_neighbors from './data/nearest_neighbors.json'
import parsed_page_content from './data/parsed_page_content'
import umap from './data/umap.json'

// CR: change the title and component from the default example
export default {
  title: 'Embeddings',
}

const coords = umap.map(xy => {return {'x': xy[0], 'y': xy[1]}})

let dataCopy = JSON.parse(JSON.stringify(parsed_page_content))

for (let n of nearest_neighbors) {
	const source = n.source
	const target = n.target

	if (!dataCopy[source].neighbors) { dataCopy[source].neighbors = [] }

	dataCopy[source].neighbors.push(n)
}

// The following variable should never be changed
const dataset = dataCopy.map((s, i) => {
	s.index = i
	s.coords = coords[i]
	return s
})

const [matchedCategory, matchedData] = getMatches(labels, dataset)

// console.log(nearest_neighbors)

export const EmbeddingTest = () => {
	return <div>
        <Embedding dataset={matchedData} selectedRows={matchedData} selectedCategory="All" />
    </div>
}