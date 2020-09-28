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

import { fromJS, toJS } from 'immutable'

import { Highlight } from './Highlight'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import ListSubheader from '@material-ui/core/ListSubheader'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TextField from '@material-ui/core/TextField'

import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

const useStyles = makeStyles((theme) => ({
  collapseMenu: {
    display: 'flex',
    flexDirection: 'column',
    alignItems:'flex-start',
    width: '500px'
  },
  updateButton: {
    fontSize: '8px',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif;',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 5
  },
  updateIcon: {
    padding: '5px 5px 5px 5px'
  },
  inputBox: {
    width: '400px',
    fontSize: '12px',
    marginTop: 5
  },
  subheader: {
  	lineHeight: '1.5em',
  	margin: '15px 0px 20px 0px',
  }
}))

// Show changes in dialog
export const DialogDiff = ({isOpen, diffDict, mode, show, onConfirm, onCancel}) => {
	const classes = useStyles()

	const [open, setOpen] = React.useState([]);

	const handleClick = (c) => {
		let cIndex = open.indexOf(c)
		if (cIndex > -1) {
			setOpen(open.filter(i => i !== c))
		} else {
			setOpen(open.concat([c]))
		}
	}

	const collapseOpen = (c) => {
		if (open.indexOf(c) > -1) {
			return true
		}
		return false
	}

	const items = []
	const diff = diffDict.get(show) ? diffDict.get(show) : fromJS({})

	let listTitle

	// Determine whether to show added items, unmatched items, or items that will be unmatched
	if (show === 'added') {
		listTitle = 'Items from the following categories were added:'
	} else if (show === 'deleted' && mode === 'updating' && diffDict.get('deletedCount') === 0) {
		listTitle = `${diffDict.get('addedCount')} new matches will be made. This action will not unmatch any items.`
	} else if (show === 'deleted' && mode === 'updating' && diffDict.get('deletedCount') !== 0) {
		listTitle = `${diffDict.get('addedCount')} new matches will be made. Items from the following categories will be unmatched:`
	} else if (show === 'deleted' && mode === 'read') {
		listTitle = 'Items from the following categories were unmatched:'
	}

	for (let c of diff.keySeq()) {
		const strings = diff.getIn([c, 'strings'])

		let defaultValueText

		if (mode === 'read') {
			defaultValueText = 'This category was deleted'
		} else {
			defaultValueText = 'This category will be deleted'
		}

		if (strings.size > 0) {
			items.push(<div>
							<ListItem button onClick={() => handleClick(c)}>
								<div className={classes.collapseMenu}>
							        <ListItemText primary={c} />
							        <TextField
										className={classes.inputBox}
										id="outlined-helperText"
										label="Regex"
										defaultValue={diff.getIn([c, 'newRegex']) === '' ? defaultValueText : diff.getIn([c, 'newRegex'])}
										variant="outlined"
										size="small"
										helperText={`[Previous Regex] ${diff.getIn([c, 'oldRegex'])}`}
										disabled={diff.getIn([c, 'newRegex']) === '' ? true : false}
						            />
					            </div>
					            {open.indexOf(c) > -1 ? <ExpandLess /> : <ExpandMore />}
						    </ListItem>
							<Collapse in={open.indexOf(c) > -1} timeout="auto" unmountOnExit>
								<Table aria-label="simple table">
								{strings.map((s) => 
									<TableRow>
										<TableCell>
											<Highlight
					                            show={true}
					                            row={s.toJS()} />
					                    </TableCell>
				                    </TableRow>)}
								</Table>
							</Collapse>
						</div>)
		}
	}

	// If updating (i.e. this is a preview), user can choose to cancel the update
	let actions = mode === 'updating' ? [
		<Button onClick={onConfirm} color="primary">
			Confirm
		</Button>,
		<Button onClick={onCancel} color="primary">
			Cancel
		</Button>
	] : (
		<Button onClick={onConfirm} color="primary">
			Confirm
		</Button>
	)

  	return (
		<Dialog
			open={isOpen}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogContent>
				<ListSubheader className={classes.subheader} component="div" id="nested-list-subheader">
		        	{listTitle}
		        </ListSubheader>
				{items}
			</DialogContent>
			<DialogActions>
				{actions}
			</DialogActions>
		</Dialog>
  	)
}