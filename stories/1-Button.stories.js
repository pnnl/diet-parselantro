import React, {useState} from 'react'
import { action } from '@storybook/addon-actions'
import { Button } from '@storybook/react/demo'
import { Input } from '../src/Input'
import { Items } from '../src/Items'
import { SummaryTable } from '../src/SummaryTable'
import { TestComponent } from '../src/TestComponent'
import { getMatches } from '../src/helperFunctions/getMatches'
import * as d3 from 'd3'

import { fromJS } from 'immutable'

// Shift these files into the stories folder
import labels from './data/labels.json'
import parsed_page_content from './data/parsed_page_content'

export default {
  title: 'Components'
};

// Save the python json variable and pass it in
// So what you pass in is what you get
// CR: however CSV data is trickier to load
// I suggest converting it to JSON using the
// props trick I mentioed a while back

function updateInput() {
	alert('Input registered')
}

let dataCopy = JSON.parse(JSON.stringify(parsed_page_content))

export const InputTest = () => (
	<div>
		<Input key='Unmatched' oldRegex='Default Regex' oldCategory='Unmatched'/>
		<Input key='All' oldRegex='Default Regex' oldCategory='All'/>
		<Input key='NewUnmatched' oldRegex='Default Regex' oldCategory='New Unmatched'/>
		<Input key='NewMatches' oldRegex='Default Regex' oldCategory='New Matches'/>
		<Input key='Test' oldRegex='Default Regex' oldCategory='Test' onUpdate={updateInput} />
	</div>
)

export const ItemsTest = () => {
	return <Items rows={dataCopy} />
}

export const ImmutableTest = () => {

	const [testState, setTestState] = useState(fromJS({'number': 5}))

	const update = (newNumber) => {
		const newTestState = testState.merge(fromJS({'number': 10}))
		setTestState(newTestState)
	}

	return <div>
		<button onClick={() => update(10)}>Click</button>
		<TestComponent integer={testState.get('number')} />
	</div>

}

export const TableTest = () => {
	const [matchedCategory, matchedData] = getMatches(labels, dataCopy)

	return <div>
		<SummaryTable regex={labels} dataProcessed={matchedData.splice(0, 20)} dataOriginal={dataCopy.splice(0, 20)} />
	</div>

}