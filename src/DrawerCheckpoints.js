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

import AddIcon from '@material-ui/icons/Add'
import Bookmarks from '@material-ui/icons/BookmarkBorder'

import clsx from 'clsx'
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import ListSubheader from '@material-ui/core/ListSubheader'
import TextField from '@material-ui/core/TextField'

import { DialogCheckpoint } from './DialogCheckpoint'

const useStyles = makeStyles((theme) => ({
	list: {
		width: 500,
	},
	listSubheader: {
		cursor: "pointer"
	},
	fullList: {
		width: 'auto',
	},
	listItem: {
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
		cursor: "pointer",
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start'
	},
	subText: {
		fontSize: 10,
		color: 'gray',
	},
	updateButton: {
	    fontSize: '8px',
	    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif;',
	    display: 'flex',
	    flexDirection: 'column',
	    alignItems: 'center',
	    marginLeft: 5,
	    color: 'gray'
	},
	updateIcon: {
	    padding: '5px 5px 5px 5px',
	    color: 'gray'
	},
	listText: {
		lineHeight: '1.5em',
		margin: 0
	},
	inputContainer: {
		display: 'flex',
		alignItems: 'center'
	},
	inputBox: {
		width: '400px',
		marginRight: '5px'
	},
}));

// Show checkpoints that have been created
export const DrawerCheckpoints = ({anchor, regexList=[], regexCheckpoints=[], onCheckpoint, restoreCheckpoint}) => {
	const classes = useStyles()

	const [checkpointName, setCheckpointName] = React.useState('New Checkpoint')

	const onChange = (e) => {
		e.preventDefault()
		e.stopPropagation()
		setCheckpointName(e.target.value)
	}

	const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

	let checkpoints = []

	// For each checkpoint, display time created, num categories, num matches, and num hidden
	for (let c of regexCheckpoints) {
		const cTime = c.time

		checkpoints.push(
			<ListItem className={classes.listItem} onClick={() => restoreCheckpoint(c)}>
				<p className={classes.listText}>{c.name} created at {monthNames[cTime.getMonth() - 1]} {cTime.getDate()}, {cTime.getHours()}:{(cTime.getMinutes() < 10 ? '0':'') + cTime.getMinutes()}</p>
				<div className={classes.subText}>
					<p className={classes.listText}>{Object.keys(c.regex).length} categories defined</p>
					<p className={classes.listText}>{c.matchCount} matched</p>
					<p className={classes.listText}>{c.hidden.length} hidden</p>
				</div>
			</ListItem>
		)
	}
	
	// On select, restores system state to checkpoint
	const onSelect = () => {
		if (checkpointName === '') {
			return
		}
		onCheckpoint(checkpointName)
		setDialogCheckpoint(false)
	}

	return (
		<div className={clsx(classes.list, {
				[classes.fullList]: anchor === 'top' || anchor === 'bottom',
			})}
			role="presentation">
			<ListSubheader
				className={classes.listSubheader}
				component="div"
				id="nested-list-subheader">
					Checkpoints
			</ListSubheader>
			<ListItem className={classes.inputContainer}>
				<TextField	className={classes.inputBox}
					id="outlined-helperText"
					label="Checkpoint Name"
					defaultValue={checkpointName}
					variant="outlined"
					size="small"
					autoFocus
					onChange={(e) => onChange(e)}
					onFocus={() =>
		                typeof Jupyter !== 'undefined' &&
		                	Jupyter.keyboard_manager.disable()
		              	}
		              	onBlur={() =>
		                	typeof Jupyter !== 'undefined' &&
		                  	Jupyter.keyboard_manager.enable()
		              	}
            	/>
				<div className={classes.updateButton}>
	              	<IconButton 
	                className={classes.updateIcon}
	                aria-label="delete" onClick={() => onSelect()}>
	                	<AddIcon />
	              	</IconButton>
	              	Add New
	            </div>
			</ListItem>
			{checkpoints}
		</div>
	)
}