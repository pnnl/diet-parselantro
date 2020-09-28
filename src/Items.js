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

import React, { useEffect } from 'react'

import { Highlight } from './Highlight'
import { ItemTags } from './ItemTags'
import { ItemChips } from './ItemChips'

import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import ListSubheader from '@material-ui/core/ListSubheader'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Pagination from '@material-ui/lab/Pagination'
import Paper from '@material-ui/core/Paper'

import VisibilityOff from '@material-ui/icons/VisibilityOff'
import Visibility from '@material-ui/icons/Visibility'

import debounce from 'lodash/debounce'

const useStyles = makeStyles({
  paper: {
    width: '600px',
  },
  table: {
    width: '600px',
  },
  tableCell: {
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    "&:hover": {
      backgroundColor: '#f8f8f8',
      "& $visibilityIcon": {
        visibility: 'visible'
      },
      "& $itemTags": {
        display: 'none'
      },
      "& $itemChips": {
        display: 'block',
      },
    }
  },
  cellContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  mismatchedCell: {
    fontSize: '10px',
    color: '#b83333'
  },
  tableIcon: {
    marginRight: 15,
    fontSize: 'small',
    padding: 0,
    height: 24,
    width: 24
  },
  visibilityIcon: {
    visibility: 'hidden',
  },
  itemTags: {
    display: 'block',
  },
  itemChips: {
    display: 'none',
  }
})

// For each category, show all items that match the regex
export const Items = ({visibleRows=[], selectedRows=[], difference, selectedCategory, mismatched, updateDeleted, replaceDeleted, maxItems = 5, mode="showActive", updateSelected}) => {
  const classes = useStyles()

  const [start, setStart] = React.useState(0)
  const [hiddenItems, setHiddenItems] = React.useState([])
  const [processedRows, setProcessedRows] = React.useState([])

  const pages = Math.ceil(selectedRows.length/maxItems)

  let allAdded
  let addedItems

  // Determine if any items are newly added after regex update
  if (difference) {
    allAdded = difference.get('added').toJS()
    addedItems = allAdded[selectedCategory] ? allAdded[selectedCategory].strings.map(s => s.index) : []
  }

  // Update items shown given page number
  const handleChange = (event, value) => {
    setStart((value - 1) * maxItems)
  }

  // Hide items to remove from analysis
  const toggleHide = (item) => {
    if (mode !== "showActive") {
      replaceDeleted(item)
      return
    }
    const itemIndex = hiddenItems.indexOf(item.index)
    if (itemIndex === -1) {
      const newHiddenItems = hiddenItems.concat([item.index])
      setHiddenItems(newHiddenItems)
      updateDeleted(newHiddenItems)
    } else {
      const newHiddenItems = hiddenItems.filter(h => h !== item.index)
      setHiddenItems(newHiddenItems)
      updateDeleted(newHiddenItems)
    }
  }

  const isShown = (index) => {
    return hiddenItems.indexOf(index) === -1
  }

  let header

  if (mode === "showActive") {
    header = <Pagination count={pages} onChange={handleChange} showFirstButton showLastButton />
  } else {
    header = <ListSubheader component="div" id="nested-list-subheader">
              {selectedCategory}
            </ListSubheader>
  }

  // Get mismatched neighbors for each row
  useEffect(() => {
    let allSelected = []

    if (["All", "Matched", "Unmatched", ""].indexOf(selectedCategory) > -1) {
      setProcessedRows(allSelected)
    }

    for (let s of selectedRows) {

      let newS = JSON.parse(JSON.stringify(s))
      newS.mismatched = []

      if (!s.neighbors || !s.matched_spans) {
        allSelected.push(newS)
        continue 
      }

      // If row is not part of the category (part of subcategory)
      if ((Object.keys(s.matched_spans)).indexOf(selectedCategory) === -1) {
        allSelected.push(newS)
        continue
      }

      for (let n of s.neighbors) {
        let target = visibleRows[n.target]

        // If nearest neighbor has been removed from dataset, continue
        if (!target) { continue }

        let targetCategories = target.matched_spans ? Object.keys(target.matched_spans) : []

        if (targetCategories.indexOf(selectedCategory) === -1) {
          newS.mismatched.push(JSON.parse(JSON.stringify(target)))
        }
      }

      allSelected.push(newS)
    }

    const newHighlights = allSelected.map(r => {
      const span = r['matched_spans'] ? r['matched_spans'][selectedCategory] : undefined
      r.span = span
      return r
    })

    setProcessedRows(newHighlights)
  }, [selectedRows, selectedCategory])

  useEffect(() => {
    setHiddenItems([])
  }, [selectedRows])

  return (
    <div>
      {header}
      <TableContainer className={classes.paper} component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableBody>
            {processedRows.slice(start,start+maxItems).map((row, i) => (
              <TableRow key={`TableRow${i}`}>
                <TableCell key={`TableCell${i}`} className={classes.tableCell} component="th" scope="row">
                  <IconButton
                    aria-label="delete"
                    className={classes.tableIcon}
                    onClick={() => toggleHide(row)}
                  >
                    {mode === "showActive" ? <VisibilityOff className={classes.visibilityIcon} /> : <Visibility /> }
                  </IconButton>
                  <div className={classes.cellContainer}>
                    <div className={classes.itemTags}>
                      {difference ? <ItemTags row={row} addedItems={addedItems} /> : undefined}
                    </div>
                    <div className={classes.itemChips} >
                      {difference ? <ItemChips row={row} addedItems={addedItems} updateSelected={updateSelected} /> : undefined}
                    </div>
                    {isShown(row.index) ?
                      <div >
                        <Highlight row={row}
                                   span={row.span}
                                   mismatched={mismatched} />
                      </div> : <div />}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}