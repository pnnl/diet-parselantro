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

import React, {useRef, useEffect} from 'react'

import { nestData } from './helperFunctions/nestData'
import { getDiff } from './helperFunctions/getDiff'
import { getMatches } from './helperFunctions/getMatches'

import * as d3 from 'd3'
import d3Tip from "d3-tip"
d3.tip = d3Tip

// Visualize nested hierarchy of categories in an icicle plot
export const Icicle = ({data, currentMatches, difference, mode, currentFocus, onSelectSubcategory, onChangeFocus}) => {
  const ref = useRef('icicle')

  //For now, assume margin is equal all around the graph
  //Do not change these variables anywhere else
  const layout = {"width":300,
                  "height":500,
                  "margin":20}

  const visible = data.filter(v => v !== undefined)
  const nestedData = nestData(visible, currentMatches)

  const diffDict = difference.toJS()

  // Helper function to get focusNode
  const getFocusNode = (root, subNodes) => {
    if (subNodes.length === 0) {
      return root
    }
    let currentNodeName = subNodes.splice(0, 1)[0]
    for (let c of root.children) {
      if (c.data.name === currentNodeName) {
        return getFocusNode(c, subNodes)
      }
    }
  }

  // Return the node that is currently in focus
  const focusNode = (root, name) => {
    if (name === '') {
      return root
    }

    let subNodes = name.split('.')
    subNodes.splice(0, 1)

    let result = getFocusNode(root, subNodes)

    if (!result) {return root}
    else {
      return result
    }
  }

  // Get deepest child of current selected category
  // (Not all branches have the same depth)
  const getDeepestChild = (n) => {
    let depth = n.depth

    if (!n.children) {
      return depth
    }
    
    for (let c of n.children) {
      let childDepth = getDeepestChild(c)
      if (childDepth > depth) {
        depth = childDepth
      }
    }

    return depth
  }

  // Given category, get all data rows of category and its children
  const getChildren = (n) => {
    let allValues = []

    if (n.data.value) {
      allValues = n.data.value
    }
    
    if (n.height === 0) { return allValues }

    for (let c of n.children) {
      allValues = allValues.concat(getChildren(c))
    }

    return allValues
  }

  // Given category, count all unique children
  // i.e. only count children once if they match multiple categories
  const countUniqueChildren = (n) => {
    let allValues = getChildren(n)
    allValues = allValues.map(v => v.index)

    return (new Set(allValues)).size
  }

  // Given category name, get its full parent category hierarchy
  // i.e. All.Matched...
  const getParents = (n) => {
    let name = n.data.name
    
    if (n.parent) {
      const parents = getParents(n.parent)
      if (parents !== '') {
        name = getParents(n.parent) + '.' + name
      }
    }

    return name
  }

  // Partition data for d3 rendering
  const partition = data => {
    const root = d3.hierarchy(data)
                    .sum(d => d.value ? d.value.length : 0)
                    .sort((a, b) => b.data.name < a.data.name ? 1 : -1)
    return d3.partition().size([layout.height, (root.height + 1) * layout.width / 3])
                          (root)
  }
  
  useEffect(() => {
    const root = partition(nestedData)
    const focus = focusNode(root, currentFocus)

    d3.select(".d3-tip").remove()

    // Reposition all Nodes relative to node that is currently in focus
    root.each(d => d.target = {
      x0: (d.x0 - focus.x0) / (focus.x1 - focus.x0) * layout.height,
      x1: (d.x1 - focus.x0) / (focus.x1 - focus.x0) * layout.height,
      y0: d.y0 - focus.y0,
      y1: d.y1 - focus.y0
    })

    const svgElement = d3.select(ref.current)

    const gElement = svgElement.select("g")

    const format = d3.format(",d")

    // Show category stats on hover
    let tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return `<b>${d.data.name}</b><br />
                ${d.children ? d.children.length : 0} subcategories<br />
                ${countUniqueChildren(d)}`
      })

    svgElement.call(tip)

    const rectHeight = (d) => {
      return d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2);
    }

    // If a category has too few children and is thus very thin
    // Only show lable on hover
    const labelVisible = (d) => {
      return d.y1 <= layout.width && d.y0 >= 0 && d.x1 - d.x0 > 16;
    }

    const rectElements = gElement
      .selectAll(".rect")
      .data(root.descendants())
      .join("rect")
      .attr("class", "rect")
      .attr("x", d => d.target.y0)
      .attr("y", d => d.target.x0)
      .attr("width", d => d.target.y1 - d.target.y0 - 1)
      .attr("height", d => rectHeight(d.target))
      .attr("key", d => getParents(d))
      .attr("fill", d => d.data.name === "All" || d.data.name === "Unmatched" ? "#e0e0e0": "#8cb2d1")
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .style('cursor', d => mode === 'zoom' ? 'zoom-in' : 'pointer')

    // Calculate change in number of children when regexes are updated
    const getCategoryDiff = (d) => {
      let name = getParents(d)

      if (name.startsWith('All.Matched')) {
        name = name.replace('All.Matched.', '')
      }

      return diffDict.added[name] ? diffDict.added[name].strings.length : 0
    }

    // Calculate height of rectangle when only the new elements are counted
    const diffRectHeight = (d) => {
      return rectHeight(d.target) * getCategoryDiff(d) / d.value
    }

    const rectDiffElements = gElement
      .selectAll(".diffRect")
      .data(root.descendants())
      .join("rect")
      .attr("class", "diffRect")
      .attr("x", d => d.target.y0)
      .attr("y", d => d.target.x1 - diffRectHeight(d) - 1)
      .attr("width", d => d.target.y1 - d.target.y0 - 1)
      .attr("height", d => diffRectHeight(d))
      .attr("key", d => getParents(d))
      .attr("fill", '#ffd154')
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .style('cursor', d => mode === 'zoom' ? 'zoom-in' : 'pointer')

    rectDiffElements.on("click", function(p) {
          d3.event.stopPropagation()
          if (mode === "zoom") {

            if (currentFocus === getParents(p)) {
              // If deselecting
              onChangeFocus(getParents(p.parent))
            } else {
              // Always show at least 2 layers
              // If selecting category with no children
              // Show parents instead
              let deepestChild = getDeepestChild(p)
              let depthDifference = deepestChild - p.depth

              if (depthDifference === 0) {
                p = p.parent
              }
              onChangeFocus(getParents(p))  
            }       
          }
          if (mode === "select") {
            let name = getParents(p)

            if (name.startsWith('All.Matched')) {
              name = name.replace('All.Matched.', '')
            }

            onSelectSubcategory(getParents(p))
          }
        })

    rectElements.on("click", function(p) {
          d3.event.stopPropagation()
          if (mode === "zoom") {

            if (currentFocus === getParents(p)) {
              // If deselecting
              onChangeFocus(getParents(p.parent))
            } else {
              // Always show at least 2 layers
              // If selecting category with no children
              // Show parents instead
              let deepestChild = getDeepestChild(p)
              let depthDifference = deepestChild - p.depth

              if (depthDifference === 0) {
                p = p.parent
              }
              onChangeFocus(getParents(p))  
            }       
          }
          if (mode === "select") {
            onSelectSubcategory(getParents(p))
          }
        })      

    const nameText = gElement
      .selectAll(".nameText")
      .data(root.descendants())
      .join("text")
      .attr("class", "nameText")
      .attr("x", d => d.target.y0 + 4)
      .attr("y", d => d.target.x0 + 13)
      .text(d => (d.target.x1 - d.target.x0) > 30 ? d.data.name : "")
      .attr("font-size", "8px")
      .attr("font-family", "sans-serif")
      .style("fill-opacity", d => +labelVisible(d.target))
      .style('cursor', 'pointer')

    const countText = gElement
      .selectAll(".countText")
      .data(root.descendants())
      .join("text")
      .attr("class", "countText")
      .attr("x", d => d.target.y0 + 4)
      .attr("y", d => d.target.x0 + 22)
      .text(d => (d.target.x1 - d.target.x0) > 30 ? ` ${format(countUniqueChildren(d))}` : "")
      .attr("font-size", "8px")
      .attr("font-family", "sans-serif")
      .style("fill-opacity", d => +labelVisible(d.target))
      .style('cursor', 'pointer')    
    
  }, [data, diffDict, mode, currentFocus])
  
  return <div>
    <svg id="icicleView" width={layout.width} height={layout.height} ref={ref}>
      <g />
    </svg>
  </div>
}