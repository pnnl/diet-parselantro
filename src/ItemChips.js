// DietParselantro Widget

// Copyright (c) 2020, Battelle Memorial Institute
// All rights reserved.

// 1. Battelle Memorial Institute (hereinafter Battelle) hereby grants permission
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

// 2. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
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

import Chip from '@material-ui/core/Chip'

const useStyles = makeStyles({
	tagsContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
    flexWrap: 'wrap',
		alignItems: 'center',
		padding: 0
	},
  chip: {
    marginRight: '5px',
    marginBottom: '5px',
    cursor: 'pointer',
    fontSize: 12
  },
  tags: {
  	margin: 0,
  	marginLeft: '5px',
  }
})

// If a data text instance matches multiple categories,
// show categories as chips on top
export const ItemChips = ({row, addedItems, updateSelected}) => {
	const classes = useStyles()

	const itemCategories = row.matched_spans ? Object.keys(row.matched_spans) : []

  // Truncate if category name is longer than 20 char
  const truncateName = (s) => {
    const stringLength = s.length
    if (stringLength < 20) {return s}
    return s.slice(0, 10) + '...' + s.slice(stringLength-10, stringLength)
  }

  // Switch focus to selected category on click
  const onClick = (c) => {
    updateSelected('All.Matched.' + c)
  }

  return (
  	<div className={classes.tagsContainer}>
  		{itemCategories.map(c => (
        <Chip
        className={classes.chip}
          variant="outlined"
          size="small"
          title={c}
          label={truncateName(c)}
          onClick={() => onClick(c)}
        />
  		))}
			{addedItems.indexOf(row.index) === -1 ? <p/> : <p className={classes.tags}>*new</p>}
		</div>
  );
}