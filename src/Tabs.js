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
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'

import Bookmarks from '@material-ui/icons/Bookmarks'
import Copy from '@material-ui/icons/FileCopy'
import Delete from '@material-ui/icons/Delete'
import GetApp from '@material-ui/icons/GetApp'
import Refresh from '@material-ui/icons/Refresh'
import ViewList from '@material-ui/icons/ViewList'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

import clsx from 'clsx'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListSubheader from '@material-ui/core/ListSubheader'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import TextField from '@material-ui/core/TextField'

import { DialogTable } from './DialogTable'
import { DrawerCheckpoints } from './DrawerCheckpoints'
import { DrawerRegexList } from './DrawerRegexList'
import { Items } from './Items'

const useStyles = makeStyles((theme) => ({
  tabs: {
    marginBottom: 15,
    display: 'flex',
  },
  inputBox: {
    width: '450px',
    marginBottom: '25px'
  },
  tabButtonFirst: {
    marginRight: 'auto',
  },
  tabButtonDivide: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  tabButton: {
    fontSize: '8px',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif;',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 15,
    width: 80,
    overflow: 'hidden'
  },
  tabTitle: {
    margin: 0,
    cursor: 'pointer',
    color: 'gray'
  },
  tabIcon: {
    padding: '0px',
    color: 'gray'
  },
  tabTitleDownload: {
    color: 'black'
  },
  tabIconDownload: {
    color: 'black'
  },
}));

// Menu tabs
export const MenuTabs = ({regexList, visibleRows, dataOriginal, deletedRows, replaceDeleted, onDelete, onUpdate, regexCheckpoints, onCheckpoint, restoreCheckpoint}) => {
  const classes = useStyles()
  const [state, setState] = React.useState({ right: false, })
  const [regexDict, setRegexDict] = React.useState(regexList[0])
  const [dialogTable, setDialogTable] = React.useState(false)

  // Track which drawer is open, if any
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open })
  }

  // Copy to clipboard category:regex dict for all categories
  const copyRegex = () => {
    var element = document.createElement('textarea')
    element.value = JSON.stringify(regexList[0])
    element.style.opacity = 0
    document.body.appendChild(element)
    
    element.select()
    document.execCommand("copy")
  }

  return (
    <div>
      <div
        className={classes.tabs}
      >
        <div className={classes.tabButton} onClick={() => copyRegex()}>
          <Tab className={classes.tabIcon} icon={<Copy />}/>
          <p className={classes.tabTitle}>COPY REGEX</p>
        </div>
        <div className={`${classes.tabButtonFirst} ${classes.tabButton}`} onClick={() => onDelete()}>
          <Tab className={classes.tabIcon} icon={<Delete />}/>
          <p className={classes.tabTitle}>DELETE</p>
        </div>
        <div className={classes.tabButton} onClick={toggleDrawer('right', true)}>
          <Tab className={classes.tabIcon} icon={<ViewList />}/>
          <p className={classes.tabTitle}>REGEX LIST</p>
        </div>
        <div className={classes.tabButton} onClick={toggleDrawer('checkpoints', true)}>
          <Tab className={classes.tabIcon} icon={<Bookmarks />}/>
          <p className={classes.tabTitle}>CHECKPOINTS</p>
        </div>
        <div className={`${classes.tabButtonDivide} ${classes.tabButton}`} onClick={toggleDrawer('hidden', true)}>
          <Tab className={classes.tabIcon} icon={<VisibilityOff />}/>
          <p className={classes.tabTitle}>HIDDEN</p>
        </div>
        <div className={classes.tabButton} onClick={() => setDialogTable(true)}>
          <Tab className={`${classes.tabIcon} ${classes.tabIconDownload}`} icon={<GetApp />}/>
          <p className={`${classes.tabTitle} ${classes.tabTitleDownload}`}>DOWNLOAD</p>
        </div>
      </div>
      <DialogTable isOpen={dialogTable}
        onSelect={() => {setDialogTable(false)}}
        regex={regexDict}
        dataProcessed={visibleRows}
        dataOriginal={dataOriginal}
      />
      <Drawer anchor={'right'} open={state['right']} onClose={toggleDrawer('right', false)}>
        <DrawerRegexList anchor="right"
                         regex={regexList[0]}
                         onUpdate={onUpdate} />
      </Drawer>
      <Drawer anchor={'right'} open={state['checkpoints']} onClose={toggleDrawer('checkpoints', false)}>
        <DrawerCheckpoints anchor="right"
                         regexList={regexList}
                         regexCheckpoints={regexCheckpoints}
                         onCheckpoint={onCheckpoint}
                         restoreCheckpoint={restoreCheckpoint} />
      </Drawer>
      <Drawer anchor={'right'} open={state['hidden']} onClose={toggleDrawer('hidden', false)}>
        <Items selectedRows={deletedRows}
               selectedCategory='Hidden'
               maxItems={deletedRows.length}
               replaceDeleted={replaceDeleted}
               mode="showHidden"/>
      </Drawer>
    </div>
  );
}
