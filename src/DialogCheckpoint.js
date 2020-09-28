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

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles((theme) => ({
	inputBox: {
		width: '450px',
		marginBottom: '15px'
	},
}));

// Create and name a new checkpoint
export const DialogCheckpoint = ({isOpen, onSelect}) => {
	const classes = useStyles()
	const [checkpointName, setCheckpointName] = React.useState('New Checkpoint')

	const onChange = (e) => {
		e.preventDefault()
		setCheckpointName(e.target.value)
	}

	return (
	<Dialog
		open={isOpen}
		aria-labelledby="alert-dialog-title"
		aria-describedby="alert-dialog-description" >
		<DialogContent>
			<DialogContentText id="alert-dialog-description">
				<TextField	className={classes.inputBox}
							id="outlined-helperText"
							label="Checkpoint Name"
							defaultValue={checkpointName}
							variant="outlined"
							autofocus
							onChange={(e) => onChange(e)} />
			</DialogContentText>
		</DialogContent>
		<DialogActions>
			<Button onClick={() => onSelect(checkpointName)} color="primary">
				Create Checkpoint
			</Button>
			<Button onClick={() => onSelect('')} color="primary">
				Cancel
			</Button>
		</DialogActions>
	</Dialog>
	);
}