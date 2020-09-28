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

import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { SwatchesPicker } from 'react-color'

import Refresh from '@material-ui/icons/Refresh'

import clsx from 'clsx'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListSubheader from '@material-ui/core/ListSubheader'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles((theme) => ({
	list: {
		width: 500,
	},
	fullList: {
		width: 'auto',
	},
	CategoryBox: {
		width: '450px',
		marginBottom: '15px'
	},
	inputBox: {
		width: '450px',
		marginBottom: '25px'
	},
	regexListItems: {
		marginTop: 50
	}
}));

// Show all category:regex pairs
export const DrawerRegexList = ({anchor, regex, onUpdate}) => {
	const classes = useStyles()
	const [regexDict, setRegexDict] = React.useState(regex)

	let categoryNames = Object.keys(regexDict).sort()

	// Update regex for a particular category
	const onRegexChange = (e, r) => {
		e.preventDefault()
		e.stopPropagation()
		let newRegexDict = JSON.parse(JSON.stringify(regexDict))

		if (e.target.value === '') {
			delete newRegexDict[r]
		} else {
			newRegexDict[r] = e.target.value
		}
		setRegexDict(newRegexDict)
	}

	// Update category name
	const onCategoryChange = (e, r) => {
		e.preventDefault()
		e.stopPropagation()
		let newRegexDict = JSON.parse(JSON.stringify(regexDict))
		newRegexDict[e.target.value] = regexDict[r]
		delete newRegexDict[r]
		setRegexDict(newRegexDict)
	}

	// Update all categories and regexes
	const updateAll = () => {
		onUpdate(regexDict)
	}

	return (
	<div
			className={clsx(classes.list, {
				[classes.fullList]: anchor === 'top' || anchor === 'bottom',
			})}
			role="presentation"
		>
			<List id="regexList"
				subheader={
					<div id="allRegexHeader">
						<ListSubheader disableSticky component="div" id="nested-list-subheader">
							All Regex
							<IconButton aria-label="delete" onClick={() => updateAll()}>
								<Refresh />
							</IconButton>
						</ListSubheader>
					</div>
				}
			>
			<div className={classes.regexListItems}>
				{categoryNames.map((r, index) => (
					<ListItem key={r}>
						<div class="drawerItem">
							<TextField
								className={classes.CategoryBox}
								id={`${r}-standard-helperText`}
								defaultValue={r}
								onChange={(e) => onCategoryChange(e, r)}
								onFocus={() =>
                	typeof Jupyter !== 'undefined' &&
	                Jupyter.keyboard_manager.disable()
	              }
	              onBlur={() =>
	                typeof Jupyter !== 'undefined' &&
	                Jupyter.keyboard_manager.enable()
	              }
							/>
							<TextField
								multiline
								className={classes.inputBox}
								id={`${r}-outlined-helperText`}
								label="Regex"
								defaultValue={regexDict[r]}
								variant="outlined"
								size="small"
								onChange={(e) => onRegexChange(e, r)}
								onFocus={() =>
	                typeof Jupyter !== 'undefined' &&
	                Jupyter.keyboard_manager.disable()
	              }
	              onBlur={() =>
	                typeof Jupyter !== 'undefined' &&
	                Jupyter.keyboard_manager.enable()
	              }
							/>
						</div>
					</ListItem>
				))}
			</div>
			</List>
		</div>
	);
}