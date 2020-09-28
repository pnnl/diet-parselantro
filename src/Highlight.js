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

import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  text: {
    paddingRight: 24
  },
  mismatchedCell: {
    fontSize: '10px',
    color: '#b83333'
  },
})

// If text matches currently selected category:regex, highlight matching span
export const Highlight = ({row, span, mismatched}) => {
  const classes = useStyles()

  const string = row['clean_text']

  if (span) {
    let spanStart = string.indexOf(span)
    let spanEnd = spanStart + span.length

    return (
      <div className={classes.text}>
        <p>{string.slice(0, spanStart)}
        <span style={{'backgroundColor': 'yellow'}}>{span}</span>
        {string.slice(spanEnd, string.length)}</p>
        <p className={classes.mismatchedCell}>{row.mismatched && row.mismatched[0] && mismatched ? `[mismatched] ${row.mismatched[0]['clean_text']}` : ''}</p>
      </div>
    )
  } else {
    return (
      <div className={classes.text}>
        <p>{string}</p>
        <p className={classes.mismatchedCell}>{row.mismatched && row.mismatched[0] && mismatched ? `[mismatched] ${row.mismatched[0]['clean_text']}` : ''}</p>
      </div>
    )
  }
  
}