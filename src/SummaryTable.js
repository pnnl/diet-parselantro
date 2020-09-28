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
import { getMatches } from './helperFunctions/getMatches.js'

import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles({
	container: {
		height: 500,
	},
	cell: {
		maxWidth: 300,
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis",
	}
});

// Display data and matching categories in a table
export const SummaryTable = ({regex, dataProcessed, dataOriginal}) => {
	const classes = useStyles()
	const [page, setPage] = React.useState(0)

	const handleChangePage = (event, newPage) => {
		setPage(newPage)
	}

	const originalHeaders = Object.keys(dataOriginal[0])
	const allCategories = Object.keys(regex)

	const headers = originalHeaders.concat(allCategories)

	// If data row matches a certain category regex, display the matched span
	// If data row does not match a certain category regex, display empty string
	const getValue = (row, header) => {
		if (allCategories.indexOf(header) > -1) {
			if (row.matched_spans) {
				return row.matched_spans[header] ? row.matched_spans[header] : " "
			} else {
				return " "
			}
		}

		return row[header]
	}

	// Truncate if category name is longer than 20 char
	const truncateName = (s) => {
    const stringLength = s.length
    if (stringLength < 20) {return s}
    return s.slice(0, 10) + '...' + s.slice(stringLength-10, stringLength)
  }

	return (
		<Paper className={classes.root}>
			<TablePagination
				rowsPerPageOptions={[10]}
				component="div"
				count={dataProcessed.length}
				rowsPerPage={10}
				page={page}
				onChangePage={handleChangePage}
			/>
			<TableContainer className={classes.container}>
				<Table stickyHeader className={classes.table} aria-label="simple table">
					<TableHead>
						<TableRow>
							{headers.map((h) => 
								<TableCell className={classes.cell}>{truncateName(h)}</TableCell>
							)}
						</TableRow>
					</TableHead>
					<TableBody>
						{dataProcessed.slice(page * 10, page * 10 + 10).map((row) => {
							return (<TableRow>
								{headers.map((h) => {
									return <TableCell className={classes.cell} component="th" scope="row">
										{ getValue(row, h) }
									</TableCell>
								})}
							</TableRow>)
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	)
}