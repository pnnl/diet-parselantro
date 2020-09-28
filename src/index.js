// DietParselantro Widget

// Copyright (c) 2020, Battelle Memorial Institute
// All rights reserved.

// 1.	Battelle Memorial Institute (hereinafter Battelle) hereby grants permission
// to any person or entity lawfully obtaining a copy of this software and associated 
// documentation files (hereinafter “the Software”) to redistribute and use the 
// Software in source and binary forms, with or without modification.  Such person 
// or entity may use, copy, modify, merge, publish, distribute, sublicense, and/or 
// sell copies of the Software, and may permit others to do so, subject to the following 
// conditions:

// * Redistributions of source code must retain the above copyright notice, this
//   list of conditions and the following disclaimer.

// * Redistributions in binary form must reproduce the above copyright notice,
//   this list of conditions and the following disclaimer in the documentation
//   and/or other materials provided with the distribution.

// * Neither the name of the copyright holder nor the names of its
//   contributors may be used to endorse or promote products derived from
//   this software without specific prior written permission.

// 2.	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
// FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
// DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
// CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
// OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

import React, { useState, useEffect } from 'react'

import { fromJS, Set } from 'immutable'

import { makeStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import NearMe from '@material-ui/icons/NearMeOutlined'
import Switch from '@material-ui/core/Switch'
import ZoomIn from '@material-ui/icons/ZoomIn'

import { DialogDiff } from './DialogDiff'
import { Embedding } from './Embeddings'
import { Icicle } from './Icicle'
import { Items } from './Items'
import { Input } from './Input'
import { MenuTabs } from './Tabs'

import { getDiff } from './helperFunctions/getDiff'
import { preprocessData } from './helperFunctions/preprocessData'
import { getMatches } from './helperFunctions/getMatches'

import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

import debounce from 'lodash/debounce'

import * as d3 from 'd3'

import './Index.css'

const useStyles = makeStyles((theme) => ({
  button: {
    marginBottom: theme.spacing(1),
  },
  toggleButton: {
  	padding: 5,
  	marginBottom: theme.spacing(1),
  }
}))

// Export DietParselantro widget

// Widget input:
// 		- data array in json format [{row1}, {row2}...]
// 		- regex array of [{category : categoryRegex}...] pairs
// 		- coords array of position of each row in embedding space [{x:, y:}...]
// 		- nearestNeighbors array of indices of nearest neighbors in embedding space
// 							 		[{source: sourceIndex, target: targetIndex}...]

// Embedding to generate coords and nearestNeighbors is done by the user beforehand
// Any suitable embedding algorithm can be used
// Order of elements in data and coords arrays must be the same
export const DietParselantro = ({data, regex={}, coords, nearestNeighbors}) => {
	const classes = useStyles()

	// Never change the following variable
	const dataset = preprocessData(regex, data, coords, nearestNeighbors)

	const [matchedCategory, matchedData] = getMatches(regex, dataset)

	// Track matched statements for each category/regex
	const [currentMatches, setCurrentMatches] = React.useState(matchedCategory)

	// Track hidden and unhidden items
	const [visibleRows, setVisibleRows] = React.useState(matchedData)
	const [deletedRows, setDeletedRows] = React.useState([])

	// Track past regexes and current regex
	const [regexList, setRegexList] = React.useState([regex])
	// Track user defined regex checkpoints
	const [regexCheckpoints, setRegexCheckpoints] = React.useState([])
	// If user reverts to a checkpoint, store future regex states
	const [regexRedoList, setRegexRedoList] = React.useState([])
	const [checkpointRestored, setCheckpointRestored] = React.useState(false)

	// Track items that are selected in the icicle plot
	const [selectedRows, setSelectedRows] = React.useState([])
	const [selectedCategory, setSelectedCategory] = React.useState('')

	// Track icicle focus
	const [currentFocus, setCurrentFocus] = React.useState('')

	// Update icicle focus
	const updateFocus = (f) => { setCurrentFocus(f) }

	// Track whether mismatched neighbors are being shown
	const [showMismatched, setShowMismatched] = React.useState(false)

	const updateMismatched = (f) => { setShowMismatched(f) }

	// When regex list is updated, automatically compute:
	// New matches for each category
	// And the category matches for each row
	useEffect(() => {
		const [newMatchedCategory, newMatchedData] = getMatches(regexList[0], dataset)

		let previousRegex

		if (regexRedoList.length > 0) {
			previousRegex = regexRedoList[0]
		} else {
			previousRegex = regexList[1] ? regexList[1] : regexList[0]
		}
		const diffDict = getDiff(currentMatches, newMatchedCategory, regexList[0], previousRegex, visibleRows)
		setDifference(difference.merge(fromJS(diffDict)))

		// setPreviousMatches(currentMatches)
		setCurrentMatches(newMatchedCategory)
		setVisibleRows(newMatchedData)

		// For each checkpoint, update their index in the regex list
		if (!checkpointRestored) {

			let newRegexCheckpoints = regexCheckpoints.filter(rc => rc.regexListIndex - regexRedoList.length >= 0)

			newRegexCheckpoints = newRegexCheckpoints.map(rc => {
				rc.regexListIndex = rc.regexListIndex - regexRedoList.length + 1
				return rc
			})

			setRegexRedoList([])
			setRegexCheckpoints(newRegexCheckpoints)
		}
	}, [regexList])

	// When deleted rows are changed, update the list of visible elements
	useEffect(() => {
		let datasetCopy = JSON.parse(JSON.stringify(dataset))
		for (let d of deletedRows) {
			delete datasetCopy[d.index]
		}

		const [newMatchedCategory, newMatchedData] = getMatches(regexList[0], datasetCopy)

		setCurrentMatches(newMatchedCategory)
		setVisibleRows(newMatchedData)
	}, [deletedRows])

	// If selected category or visible rows change,
	// update selected rows
	useEffect(() => {
		if (selectedCategory === '') {
			setSelectedRows([])
		} else if (selectedCategory === 'All') {
			setSelectedRows(visibleRows.filter(r => r))
		} else if (selectedCategory === 'Matched') {
			setSelectedRows(visibleRows.filter(r => r && r.matched_spans))
		} else if (selectedCategory === 'Unmatched') {
			setSelectedRows(visibleRows.filter(r => r && !r.matched_spans))
		} else if (selectedCategory === 'New Category') {
			setSelectedRows([])
		} else {
			let newSelectedRows = []
			for (let m of Object.keys(currentMatches)) {
				if (m.startsWith(selectedCategory)) {
					newSelectedRows = currentMatches[m].concat(newSelectedRows)
				}
			}
			setSelectedRows(newSelectedRows)
		}

	}, [selectedCategory, visibleRows, currentMatches])

	// Add new checkpoint
	const updateCheckpoints = (name) => {
		const dateNow = new Date()

		let matchedIndices = []

		for (let m of Object.keys(currentMatches)) {
			let indices = currentMatches[m].map(i => i.index)
			matchedIndices = matchedIndices.concat(indices)
		}

		let matchCount = (new Set(matchedIndices)).size
		
		const newRegexCheckpoints = [{'name': name,
									  'time': dateNow,
									  'regex': regexList[0],
									  'matchCount': matchCount,
									  'hidden': deletedRows,
									  'regexListIndex': 0}].concat(regexCheckpoints)
		setRegexCheckpoints(newRegexCheckpoints)
	}

	// Restore DietParselantro to checkpoint state
	const restoreCheckpoint = (checkpoint) => {
		const checkpointIndex = checkpoint.regexListIndex

		const oldRegexList = regexRedoList.concat(regexList)
		const newRegexList = oldRegexList.slice(checkpointIndex, oldRegexList.length)
		const newRegexRedoList = oldRegexList.slice(0, checkpointIndex)

		setRegexList(newRegexList)
		setRegexRedoList(newRegexRedoList)
		setCheckpointRestored(true)
		setDeletedRows(checkpoint.hidden)
	}
  
  	// Update selected category name
	const updateSelected = (n) => {
		if (n === '') {
			setSelectedCategory('')
		} else {
			let newN

			if (n === 'All') {
				newN = n
			} else if (n === 'All.Matched') {
				newN = 'Matched'
			} else if (n === 'All.Unmatched') {
				newN = 'Unmatched'
			} else {
				newN = n.replace('All.Matched.', '')
			}

			setSelectedCategory(newN)
		}
	}

	// Track differences after user updates regex
	const [difference, setDifference] = useState(fromJS({'deleted': {},
														 'added': {},
														 'deletedCount': 0,
														 'addedCount': 0}))

	// Preview differences after user updates regex
	const [tempState, setTempState] = useState(fromJS({'newRegexDict': {},
												'newCategory': '',
												'newDiff': {},
												'openDeletedDialog': false,
												'mode': 'updating',
												'show': 'deleted'}))

	// Update all regexes
	const updateAllRegex = (newRegexDict, category) => {

		let newSelectedCategory
		if (!category) {
			newSelectedCategory = selectedCategory
		} else {
			newSelectedCategory = category
		}

		const [newMatches, newVisible] = getMatches(newRegexDict, visibleRows)

		const regexDict = regexList[0]

		// Get all items that were added and deleted
		const diffDict = getDiff(currentMatches, newMatches, regexDict, newRegexDict, visibleRows)

		// If no items unmatched, perform update immediately
		if (diffDict.deletedCount === 0 && diffDict.addedCount !== 0) {
			const newRegexList = [newRegexDict].concat(regexList)
			setRegexList(newRegexList)
			setCheckpointRestored(false)

			updateSelected(newSelectedCategory)
			return
		}

		// If items unmatched, create a temporary state
		// Show summary of unmatched items in dialog box
		// Request user confirmation
		const newTempState = tempState.merge(fromJS({'newRegexDict': newRegexDict,
											  'newCategory': newSelectedCategory,
											  'newDiff': diffDict,
											  'openDeletedDialog': true}))

		setTempState(newTempState)
	}

	// Update a single regex
	const updateData = (oldCategory, oldRegex, newCategory, newRegex) => {
		const regexDict = regexList[0]
		let newRegexDict = JSON.parse(JSON.stringify(regexDict))

		if (newRegex === '') {
			delete newRegexDict[newCategory]
		}

		// If no new category created, only regex updated
		else if (newCategory === oldCategory) {
			newRegexDict[newCategory] = newRegex
		}

		// If the add category feature was used
		else if (newCategory !== oldCategory && oldCategory === 'New Category') {
			newRegexDict[newCategory] = newRegex
		}

		// Category name updated
		else if (newCategory !== oldCategory) {
			for (let r of Object.keys(newRegexDict)) {
				if (r.indexOf(oldCategory) !== -1) {
					let newR = r.replace(oldCategory, newCategory)
					newRegexDict[newR] = newRegexDict[r]
					delete newRegexDict[r]
				}
			}
		}

		updateAllRegex(newRegexDict, newCategory)
	}

	// Delete a category and subcategories
	const deleteCategory = () => {
		const category = selectedCategory

		// Non-user defined categories cannot be deleted
		if (["Matched", "Unmatched", "All", "New Matches", "New Unmatched", ""].indexOf(category) !== -1) {
			return
		}

		const regexDict = regexList[0]
		let newRegexDict = JSON.parse(JSON.stringify(regexDict))

		for (let r of Object.keys(newRegexDict)) {
			if (r.startsWith(category)) {
				delete newRegexDict[r]
			}
		}

		updateAllRegex(newRegexDict, 'All')
	}

	// Show items that have been matched/unmatched
	const showDelta = (show) => {
		if (difference.get(`${show}Count`) === 0) { return }

		const newTempState = tempState.merge(fromJS({'newRegexDict': {},
											  'newCategory': selectedCategory,
											  'newDiff': difference,
											  'openDeletedDialog': true,
											  'mode': 'read',
											  'show': show}))

		setTempState(newTempState)
	}

	// Perform update after user confirmation
	// Only applies in cases of items unmatching
	const confirmUpdate = () => {
		if (tempState.get('mode') === 'read') {
			const newTempState = tempState.merge(fromJS({'newRegexDict': {},
												  'newCategory': '',
												  'newDiff': {},
												  'openDeletedDialog': false,
												  'mode': 'updating',
												  'show': 'deleted'}))

			setTempState(newTempState)

			return
		}

		const newRegexList = [tempState.get('newRegexDict').toObject()].concat(regexList)
		setRegexList(newRegexList)
		setCheckpointRestored(false)

		updateSelected(tempState.get('newCategory'))

		const newTempState = tempState.merge(fromJS({'newRegexDict': {},
											  'newCategory': '',
											  'newDiff': {},
											  'openDeletedDialog': false,
											  'mode': 'updating',
											  'show': 'deleted'}))

		setTempState(newTempState)
	}

	// Cancel update on user cancel
	// Only applies in cases of items unmatching
	const cancelUpdate = () => {
		const newTempState = tempState.merge(fromJS({'newRegexDict': {},
											  'newCategory': '',
											  'newDiff': {},
											  'openDeletedDialog': false,
											  'mode': 'updating',
											  'show': 'deleted'}))

		setTempState(newTempState)
	}

	// Update list of 'hidden' rows
	const deleteData = (items) => {
		const newDeleted = visibleRows.filter(s => {
			if (!s) { return false }
			return items.indexOf(s.index) > -1
		})

		const allDeleted = deletedRows.concat(newDeleted)
		setDeletedRows(allDeleted)
	}

	const fn = debounce(deleteData, 1000)

	// Move 'hidden' items back to list of visibles
	const replaceDeleted = (item) => {
		const newDeleted = deletedRows.filter(s => s.index !== item.index)

		let newVisible = JSON.parse(JSON.stringify(visibleRows))
		newVisible[item.index] = item

		setDeletedRows(newDeleted)
	}

	// Determines whether icicle is in select or zoom mode
	const [icicleMode, setIcicleMode] = React.useState("select")

	// Update icicle mode
	const handleIcicleMode = (e, newMode) => {
		if (newMode !== null) { setIcicleMode(newMode) }
	}
 
	return	<div class="main">
				<div class="overview">
				    <Embedding visibleRows={visibleRows}
							   selectedRows={selectedRows.length === 0 ? visibleRows : selectedRows}
							   selectedCategory={selectedCategory}
							   toggleMismatched={updateMismatched}
							   mismatched={showMismatched}/>
					<div class="overviewHeader">
						<ToggleButtonGroup
							exclusive
							value={icicleMode}
					    	aria-label="icicle mode"
					    	onChange={handleIcicleMode}>
					    	<ToggleButton
					    		value="addNew"
					    		className={classes.toggleButton}
								onClick={() => updateSelected('New Category')}
								variant="contained">
								<AddIcon />
						    	Add New
						    </ToggleButton>
						    <ToggleButton
						    	value="zoom"
						    	aria-label="bold"
						    	className={classes.toggleButton}>
						    	<ZoomIn />
						    </ToggleButton>
						    <ToggleButton
						    	value="select"
						    	aria-label="bold"
						    	className={classes.toggleButton}>
						    	<NearMe />
						    </ToggleButton>
						</ToggleButtonGroup>
					    <div class="overviewSummary">
						    <p class="overviewStatement" onClick={() => showDelta('added')}>{`${difference.get('addedCount')} new matches`}</p>
						    <p class="overviewStatement" onClick={() => showDelta('deleted')}>
						    	{`${difference.get('deletedCount')} unmatched`}
						    </p>
					    </div>
				    </div>
					<Icicle data={visibleRows}
						currentMatches={currentMatches}
						difference={difference}
						currentFocus={currentFocus}
						mode={icicleMode}
						onSelectSubcategory={updateSelected}
						onChangeFocus={updateFocus}
					/>
				</div>
				<div key={selectedCategory} class="details">
					<MenuTabs key={regexList.length}
						regexList={regexList}
						visibleRows={visibleRows}
						dataOriginal={data}
						deletedRows={deletedRows}
						replaceDeleted={replaceDeleted}
						onDelete={deleteCategory}
						onUpdate={updateAllRegex}
						onCheckpoint={updateCheckpoints}
						restoreCheckpoint={restoreCheckpoint}
						regexCheckpoints={regexCheckpoints} />
					<Input oldRegex={regexList[0]}
						   oldCategory={selectedCategory}
						   onUpdate={updateData} />
					<Items visibleRows={visibleRows} 
						   selectedRows={selectedRows}
						   selectedCategory={selectedCategory}
						   mismatched={showMismatched}
						   updateDeleted={fn}
						   difference={difference}
						   updateSelected={updateSelected} />
				</div>

				<DialogDiff key={`${tempState.get('mode')}${tempState.get('show')}`}
							isOpen={tempState.get('openDeletedDialog')}
							diffDict={tempState.get('newDiff')}
							mode={tempState.get('mode')}
							show={tempState.get('show')}
							onConfirm={() => confirmUpdate()}
							onCancel={() => cancelUpdate()}/>
			</div>
}
