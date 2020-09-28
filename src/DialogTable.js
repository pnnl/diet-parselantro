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
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'

import { SummaryTable } from './SummaryTable'

// Displays data and categories in a table
export const DialogTable = ({isOpen, onSelect, regex, dataProcessed, dataOriginal}) => {

	// Save as tabular data
  const save = () => {
  	const originalHeaders = Object.keys(dataOriginal[0])
		const allCategories = Object.keys(regex)

		const headers = originalHeaders.concat(allCategories)

		let newData = []

		for (let row of dataProcessed) {
			let newRow = {}

			// If data row matches a certain category regex, display the matched span
			// If data row does not match a certain category regex, display empty string
			for (let h of headers) {
				if (allCategories.indexOf(h) > -1) {
					if (row.matched_spans) {
						newRow[h] = row.matched_spans[h] ? row.matched_spans[h] : ' '
					} else {
						newRow[h] = ' '
					}
				} else {
					newRow[h] = row[h]
				}
			}

			newData.push(newRow)
		}
		
    download('labels2.json', JSON.stringify(newData))
  }

  // Option to download data with category labels
  const download = (filename, text) => {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', filename)

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)

    onSelect()
  }

  return (
	<Dialog
		fullWidth
		maxWidth={'xl'}
		open={isOpen}
		aria-labelledby="alert-dialog-title"
		aria-describedby="alert-dialog-description"
	>
		<DialogContent>
			<SummaryTable regex={regex} dataProcessed={dataProcessed} dataOriginal={dataOriginal} />
		</DialogContent>
		<DialogActions>
			<Button onClick={() => {save()}} color="primary">
				DOWNLOAD
			</Button>
			<Button onClick={onSelect} color="primary">
				CLOSE
			</Button>
		</DialogActions>
	</Dialog>
  );
}