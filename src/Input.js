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
import { DialogUpdate } from './DialogUpdate'

import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'

import Delete from '@material-ui/icons/Delete'
import Refresh from '@material-ui/icons/Refresh'

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
  container:{
    display: 'flex',
    flexDirection: 'column'
  },
  categoryBox: {
    width: '520px',
  },
  regexField: {
    display: 'flex',
    alignItems: 'center',
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
  inputBox: {
    width: '520px',
    fontSize: '12px',
  }
}))

// Input boxes to view and edit category:regex pairs
export const Input = ({oldCategory, oldRegex, onUpdate}) => {
  const classes = useStyles()
  const [currentCategory, setCategory] = React.useState(oldCategory)
  const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false)

  const [currentRegex, setRegex] = React.useState(oldRegex[oldCategory])

  const handleChange = () => {
    // Create new category
    if (currentCategory === 'New Category') {
      setOpenUpdateDialog(true)
    }

    // Updating is not possible for disabled categories
    // e.g. All, Matched, Unmatched...
    else if (disabled) {
      return
    }

    // Update category:regex
    else {
      onUpdate(oldCategory, oldRegex[oldCategory], currentCategory, currentRegex)
    }
  }

  // Update category name
  const onCategoryChange = (e) => {
    e.preventDefault()
    setCategory(e.target.value)
  }

  // Update regex
  const onRegexChange = (e) => {
    e.preventDefault()
    setRegex(e.target.value)
  }

  const handleUpdateClose = () => {
    setOpenUpdateDialog(false)
  }

  let disabled = false

  // Disable for certain default categories
  // e.g. All, Matched, Unmatched...
  if (["Matched", "Unmatched", "All", "New Matches", "New Unmatched", ""].indexOf(currentCategory) !== -1) {
    disabled = true
  }

  return (
    <div>
      <form className={classes.root} noValidate autoComplete="off">
        <div className={classes.container} 
          onKeyPress={(ev) => {
            if (ev.key === 'Enter') {
              handleChange()
              ev.preventDefault()
            }
          }}>
          <div className={classes.regexField}>
            <TextField
              className={classes.categoryBox}
              id="standard-helperText"
              label="Category"
              defaultValue={currentCategory}
              disabled={disabled}
              onChange={(e) => onCategoryChange(e)}
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
          <div className={classes.regexField}>
            <TextField
              multiline
              className={classes.inputBox}
              id="outlined-helperText"
              label="Regex"
              defaultValue={currentRegex}
              variant="outlined"
              size="small"
              disabled={disabled}
              onChange={(e) => onRegexChange(e)}
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
                aria-label="delete" onClick={() => handleChange()}>
                <Refresh />
              </IconButton>
              UPDATE
            </div>
          </div>
        </div>
      </form>
      <DialogUpdate onSelect={handleUpdateClose} isOpen={openUpdateDialog} />
      
    </div>
  );
}